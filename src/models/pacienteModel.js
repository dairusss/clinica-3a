const { query, transaction } = require('../config/database');

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
const emitirSenha = async (pacienteData) => {
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
            } else {
                // Criar novo paciente
                const novoPaciente = await client.query(
                    `INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento, genero, endereco)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     RETURNING id`,
                    [pacienteData.nome, pacienteData.cpf, pacienteData.telefone || null,
                     pacienteData.email || null, pacienteData.data_nascimento || null,
                     pacienteData.genero || null, pacienteData.endereco || null]
                );
                pacienteId = novoPaciente.rows[0].id;
            }
        }
        
        // 2. Gerar número de senha
        const numeroSenha = await gerarNumeroSenha();
        
        // 3. Criar registro de senha
        const result = await client.query(
            `INSERT INTO senhas (numero_senha, paciente_id, status)
             VALUES ($1, $2, 'EMITIDA')
             RETURNING id, numero_senha, data_emissao, status`,
            [numeroSenha, pacienteId]
        );
        
        const senhaData = result.rows[0];
        
        // 4. Adicionar à fila de atendimento
        const posicaoFila = await client.query(
            'SELECT MAX(posicao_fila) as max_posicao FROM fila_atendimento'
        );
        
        const proximaPosicao = (posicaoFila.rows[0].max_posicao || 0) + 1;
        
        await client.query(
            `INSERT INTO fila_atendimento (senha_id, posicao_fila, prioridade)
             VALUES ($1, $2, $3)`,
            [senhaData.id, proximaPosicao, pacienteData.prioridade || 0]
        );
        
        return {
            id: senhaData.id,
            numero_senha: senhaData.numero_senha,
            posicao_fila: proximaPosicao,
            data_emissao: senhaData.data_emissao,
            status: senhaData.status
        };
    });
};

// Obter status da senha/fila
const obterStatusSenha = async (numeroSenha) => {
    const result = await query(
        `SELECT 
            s.id,
            s.numero_senha,
            s.status,
            s.data_emissao,
            s.chamada_em,
            s.local_atendimento,
            p.nome as paciente_nome,
            f.posicao_fila,
            EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP - s.data_emissao)) as tempo_espera_minutos
         FROM senhas s
         LEFT JOIN pacientes p ON s.paciente_id = p.id
         LEFT JOIN fila_atendimento f ON s.id = f.senha_id
         WHERE s.numero_senha = $1`,
        [numeroSenha]
    );
    
    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

// Obter fila atual
const obterFilaAtual = async () => {
    const result = await query(
        `SELECT * FROM fila_atual ORDER BY prioridade DESC, posicao_fila ASC`
    );
    return result.rows;
};

// Obter próximo paciente a chamar
const obterProximoPaciente = async () => {
    const result = await query(
        `SELECT 
            f.id,
            f.posicao_fila,
            s.id as senha_id,
            s.numero_senha,
            p.nome as paciente_nome,
            f.prioridade
         FROM fila_atendimento f
         JOIN senhas s ON f.senha_id = s.id
         JOIN pacientes p ON s.paciente_id = p.id
         WHERE s.status IN ('EMITIDA', 'CHAMADA')
         ORDER BY f.prioridade DESC, f.posicao_fila ASC
         LIMIT 1`
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
};

const obterAtendimentoAtual = async () => {
    const result = await query(
        `SELECT * FROM pacientes_em_atendimento
         ORDER BY chamada_em DESC
         LIMIT 1`
    );

    return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = {
    emitirSenha,
    obterStatusSenha,
    obterFilaAtual,
    obterProximoPaciente,
    obterAtendimentoAtual,
    gerarNumeroSenha
};
