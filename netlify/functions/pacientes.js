const { query, transaction } = require('./database');
const { cpfValidator } = require('../../src/utils/validators');

// Gerar número de senha aleatório
const gerarNumeroSenha = async () => {
    const tamanho = parseInt(process.env.TAMANHO_SENHA || 4);
    let numero = '';

    for (let i = 0; i < tamanho; i++) {
        numero += Math.floor(Math.random() * 10);
    }

    // Garantir que é único
    let existente = await query('SELECT id FROM senhas WHERE numero_senha = $1', [numero]);

    if (existente.rows.length > 0) {
        return gerarNumeroSenha(); // Recursão se já existe
    }

    return numero;
};

// Criar/atualizar paciente e gerar senha
const emitirSenhaModel = async (pacienteData) => {
    return transaction(async (client) => {
        // 1. Verificar se paciente já existe (por CPF)
        let pacienteId;

        if (pacienteData.cpf) {
            const paciente = await client.query(
                'SELECT id FROM pacientes WHERE cpf = $1',
                [pacienteData.cpf]
            );

            if (paciente.rows.length > 0) {
                pacienteId = paciente.rows[0].id;
                // Atualizar dados do paciente
                await client.query(
                    `UPDATE pacientes SET
                        nome = $1, telefone = $2, email = $3,
                        data_nascimento = $4, genero = $5, endereco = $6,
                        updated_at = NOW()
                    WHERE id = $7`,
                    [
                        pacienteData.nome, pacienteData.telefone, pacienteData.email,
                        pacienteData.data_nascimento, pacienteData.genero, pacienteData.endereco,
                        pacienteId
                    ]
                );
            } else {
                // Criar novo paciente
                const novoPaciente = await client.query(
                    `INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento, genero, endereco)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                    [
                        pacienteData.nome, pacienteData.cpf, pacienteData.telefone,
                        pacienteData.email, pacienteData.data_nascimento,
                        pacienteData.genero, pacienteData.endereco
                    ]
                );
                pacienteId = novoPaciente.rows[0].id;
            }
        }

        // 2. Gerar número de senha único
        const numeroSenha = await gerarNumeroSenha();

        // 3. Inserir senha na tabela senhas
        const senha = await client.query(
            `INSERT INTO senhas (numero_senha, paciente_id, prioridade, status)
            VALUES ($1, $2, $3, 'espera') RETURNING id, numero_senha, prioridade, status, data_emissao`,
            [numeroSenha, pacienteId, pacienteData.prioridade || 0]
        );

        return {
            id: senha.rows[0].id,
            numero_senha: senha.rows[0].numero_senha,
            prioridade: senha.rows[0].prioridade,
            status: senha.rows[0].status,
            data_emissao: senha.rows[0].data_emissao
        };
    });
};

// Obter status da senha
const obterStatusSenhaModel = async (numeroSenha) => {
    const result = await query(
        `SELECT s.numero_senha, s.status, s.prioridade, s.data_emissao, s.data_chamada,
                p.nome, p.cpf,
                (SELECT COUNT(*) FROM senhas s2 WHERE s2.status = 'espera' AND s2.data_emissao < s.data_emissao) as posicao_fila
         FROM senhas s
         LEFT JOIN pacientes p ON s.paciente_id = p.id
         WHERE s.numero_senha = $1`,
        [numeroSenha]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const row = result.rows[0];
    return {
        numero_senha: row.numero_senha,
        status: row.status,
        prioridade: row.prioridade,
        posicao_fila: parseInt(row.posicao_fila) + 1, // +1 porque inclui a própria
        data_emissao: row.data_emissao,
        data_chamada: row.data_chamada,
        paciente: {
            nome: row.nome,
            cpf: row.cpf
        }
    };
};

exports.handler = async (event, context) => {
    try {
        // Parser de requisição para Netlify Functions
        const method = event.httpMethod || event.method;
        const path = event.path || `/`;
        
        // Adicionar headers CORS
        const corsHeaders = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        };

        // Preflight CORS
        if (method === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: ''
            };
        }

        if (method === 'POST' && path.includes('/emitir-senha')) {
            const response = await emitirSenha(event);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'GET' && path.includes('/status/')) {
            const numeroSenha = path.split('/status/')[1]?.split('/')[0] || '';
            const response = await obterStatus(event, numeroSenha);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'GET' && path.includes('/fila')) {
            const response = await obterFila(event);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'GET' && path.includes('/proximo')) {
            const response = await obterProximo(event);
            response.headers = corsHeaders;
            return response;
        }

        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Rota não encontrada' })
        };
    } catch (error) {
        console.error('Erro no handler:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Erro interno do servidor',
                message: error.message
            })
        };
    }
};

const emitirSenha = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { nome, cpf, telefone, email, data_nascimento, genero, endereco, prioridade } = body;

        // Simular validação
        if (!nome || !cpf) {
            return {
                statusCode: 400,
                body: JSON.stringify({ errors: [{ msg: 'Nome e CPF obrigatórios' }] })
            };
        }

        const resultado = await emitirSenhaModel({
            nome,
            cpf,
            telefone,
            email,
            data_nascimento,
            genero,
            endereco,
            prioridade: prioridade || 0
        });

        return {
            statusCode: 201,
            body: JSON.stringify({
                success: true,
                message: 'Senha emitida com sucesso',
                data: {
                    ...resultado,
                    numeroSenha: resultado.numero_senha
                }
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao emitir senha',
                message: error.message
            })
        };
    }
};

const obterStatus = async (event, numeroSenha) => {
    try {
        const status = await obterStatusSenhaModel(numeroSenha);

        if (!status) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Senha não encontrada' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: status
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao obter status',
                message: error.message
            })
        };
    }
};

const obterFila = async (event) => {
    try {
        const result = await query(
            `SELECT s.id, s.numero_senha, s.status, s.prioridade, s.data_emissao,
                    p.nome,
                    ROW_NUMBER() OVER (ORDER BY s.data_emissao) as posicao
             FROM senhas s
             LEFT JOIN pacientes p ON s.paciente_id = p.id
             WHERE s.status IN ('espera', 'chamada')
             ORDER BY s.prioridade DESC, s.data_emissao ASC`
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: result.rows || []
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao obter fila',
                message: error.message
            })
        };
    }
};

const obterProximo = async (event) => {
    try {
        const result = await query(
            `SELECT s.id, s.numero_senha, s.status, s.prioridade, s.data_emissao, p.nome
             FROM senhas s
             LEFT JOIN pacientes p ON s.paciente_id = p.id
             WHERE s.status = 'espera'
             ORDER BY s.prioridade DESC, s.data_emissao ASC
             LIMIT 1`
        );

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Nenhum paciente na fila' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: result.rows[0]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao obter próximo paciente',
                message: error.message
            })
        };
    }
};