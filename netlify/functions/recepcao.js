const { query, transaction } = require('./database');

// Chamar próximo paciente
const chamarProximoPacienteModel = async () => {
    return transaction(async (client) => {
        // Obter próximo da fila
        const filaResult = await client.query(
            `SELECT
                f.id,
                f.posicao_fila,
                s.id as senha_id,
                s.numero_senha,
                p.nome as paciente_nome,
                p.id as paciente_id
             FROM fila_atendimento f
             JOIN senhas s ON f.senha_id = s.id
             JOIN pacientes p ON s.paciente_id = p.id
             WHERE s.status IN ('EMITIDA', 'CHAMADA')
             ORDER BY f.prioridade DESC, f.posicao_fila ASC
             LIMIT 1`
        );

        if (filaResult.rows.length === 0) {
            throw new Error('Nenhum paciente na fila');
        }

        const paciente = filaResult.rows[0];

        // Atualizar status da senha para CHAMADA
        await client.query(
            `UPDATE senhas
             SET status = 'CHAMADA', chamada_em = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [paciente.senha_id]
        );

        // Registrar a chamada
        await client.query(
            `INSERT INTO chamadas (senha_id, data_chamada, local_chamada, respondida)
             VALUES ($1, CURRENT_TIMESTAMP, 'RECEPCAO', FALSE)`,
            [paciente.senha_id]
        );

        return {
            numero_senha: paciente.numero_senha,
            paciente_nome: paciente.paciente_nome,
            posicao_fila: paciente.posicao_fila,
            status: 'CHAMADA'
        };
    });
};

// Chamar paciente específico
const chamarPacienteEspecificoModel = async (numeroSenha) => {
    return transaction(async (client) => {
        // Verificar se senha existe
        const senhaResult = await client.query(
            'SELECT id, status FROM senhas WHERE numero_senha = $1',
            [numeroSenha]
        );

        if (senhaResult.rows.length === 0) {
            throw new Error('Senha não encontrada');
        }

        const senha = senhaResult.rows[0];

        if (senha.status !== 'EMITIDA') {
            throw new Error('Senha já foi chamada ou não está disponível');
        }

        // Atualizar status
        await client.query(
            `UPDATE senhas
             SET status = 'CHAMADA', chamada_em = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [senha.id]
        );

        // Registrar chamada
        await client.query(
            `INSERT INTO chamadas (senha_id, data_chamada, local_chamada, respondida)
             VALUES ($1, CURRENT_TIMESTAMP, 'RECEPCAO', FALSE)`,
            [senha.id]
        );

        // Obter dados do paciente
        const pacienteResult = await client.query(
            `SELECT p.nome, s.numero_senha
             FROM pacientes p
             JOIN senhas s ON p.id = s.paciente_id
             WHERE s.id = $1`,
            [senha.id]
        );

        return {
            numero_senha: pacienteResult.rows[0].numero_senha,
            paciente_nome: pacienteResult.rows[0].nome,
            status: 'CHAMADA'
        };
    });
};

// Obter fila atual
const obterFilaModel = async () => {
    const result = await query(
        `SELECT
            f.posicao_fila,
            s.numero_senha,
            s.prioridade,
            s.status,
            p.nome as paciente_nome,
            s.data_emissao
         FROM fila_atendimento f
         JOIN senhas s ON f.senha_id = s.id
         JOIN pacientes p ON s.paciente_id = p.id
         WHERE s.status IN ('EMITIDA', 'CHAMADA')
         ORDER BY f.prioridade DESC, f.posicao_fila ASC`
    );

    return result.rows.map(row => ({
        posicao_fila: row.posicao_fila,
        numero_senha: row.numero_senha,
        prioridade: row.prioridade,
        status: row.status,
        paciente_nome: row.paciente_nome,
        data_emissao: row.data_emissao
    }));
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

        if (method === 'POST' && path.includes('/chamar-proximo')) {
            const response = await chamarProximo(event);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'POST' && path.includes('/chamar/')) {
            const numeroSenha = path.split('/chamar/')[1]?.split('/')[0] || '';
            const response = await chamarPaciente(event, numeroSenha);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'POST' && path.includes('/iniciar/')) {
            const numeroSenha = path.split('/iniciar/')[1]?.split('/')[0] || '';
            const response = await iniciarAtendimento(event, numeroSenha);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'POST' && path.includes('/finalizar/')) {
            const numeroSenha = path.split('/finalizar/')[1]?.split('/')[0] || '';
            const response = await finalizarAtendimento(event, numeroSenha);
            response.headers = corsHeaders;
            return response;
        } else if (method === 'GET' && path.includes('/fila')) {
            const response = await obterFila(event);
            response.headers = corsHeaders;
            return response;
        }

        return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Rota não encontrada' })
        };
    } catch (error) {
        console.error('Erro no handler recepcao:', error);
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

const chamarProximo = async (event) => {
    try {
        const resultado = await chamarProximoPacienteModel();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Paciente chamado com sucesso',
                data: resultado
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao chamar próximo paciente',
                message: error.message
            })
        };
    }
};

const chamarPaciente = async (event, numeroSenha) => {
    try {
        const resultado = await chamarPacienteEspecificoModel(numeroSenha);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Paciente chamado com sucesso',
                data: resultado
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao chamar paciente',
                message: error.message
            })
        };
    }
};

const obterFila = async (event) => {
    try {
        const fila = await obterFilaModel();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: fila
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

const iniciarAtendimento = async (event, numeroSenha) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { local_atendimento, profissional } = body;

        const result = await query(
            `UPDATE senhas SET status = $1, atendimento_inicio = NOW() WHERE numero_senha = $2 RETURNING *`,
            ['EM_ATENDIMENTO', numeroSenha]
        );

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Senha não encontrada' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Atendimento iniciado',
                data: result.rows[0]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao iniciar atendimento',
                message: error.message
            })
        };
    }
};

const finalizarAtendimento = async (event, numeroSenha) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { observacoes } = body;

        const result = await query(
            `UPDATE senhas SET status = $1, atendimento_fim = NOW() WHERE numero_senha = $2 RETURNING *`,
            ['ATENDIDO', numeroSenha]
        );

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Senha não encontrada' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Atendimento finalizado',
                data: result.rows[0]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Erro ao finalizar atendimento',
                message: error.message
            })
        };
    }
};