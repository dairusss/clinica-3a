const { query, transaction } = require('../config/database');

// Chamar próximo paciente
const chamarProximoPaciente = async () => {
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
            return { error: 'Nenhum paciente na fila' };
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
        
        // Remover da fila (opcional - pode manter registro)
        // await client.query(
        //     'DELETE FROM fila_atendimento WHERE id = $1',
        //     [paciente.id]
        // );
        
        return {
            numero_senha: paciente.numero_senha,
            paciente_nome: paciente.paciente_nome,
            posicao_fila: paciente.posicao_fila,
            timestamp: new Date()
        };
    });
};

// Chamar paciente específico por número de senha
const chamarPacientePorSenha = async (numeroSenha) => {
    return transaction(async (client) => {
        // Obter a senha
        const senhaResult = await client.query(
            `SELECT s.id, s.numero_senha, p.nome as paciente_nome
             FROM senhas s
             JOIN pacientes p ON s.paciente_id = p.id
             WHERE s.numero_senha = $1`,
            [numeroSenha]
        );
        
        if (senhaResult.rows.length === 0) {
            return { error: 'Senha não encontrada' };
        }
        
        const senha = senhaResult.rows[0];
        
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
             VALUES ($1, CURRENT_TIMESTAMP, 'PAINEL', FALSE)`,
            [senha.id]
        );
        
        return {
            numero_senha: senha.numero_senha,
            paciente_nome: senha.paciente_nome,
            chamado_em: new Date()
        };
    });
};

// Iniciar atendimento (recepção confirma que paciente chegou)
const iniciarAtendimento = async (numeroSenha, dados = {}) => {
    return transaction(async (client) => {
        // Obter a senha
        const senhaResult = await client.query(
            `SELECT s.id, s.paciente_id, s.numero_senha, p.nome
             FROM senhas s
             JOIN pacientes p ON s.paciente_id = p.id
             WHERE s.numero_senha = $1`,
            [numeroSenha]
        );
        
        if (senhaResult.rows.length === 0) {
            return { error: 'Senha não encontrada' };
        }
        
        const senha = senhaResult.rows[0];
        
        // Atualizar status da senha
        await client.query(
            `UPDATE senhas 
             SET status = 'EM_ATENDIMENTO', 
                 atendimento_iniciado_em = CURRENT_TIMESTAMP,
                 local_atendimento = $2
             WHERE id = $1`,
            [senha.id, dados.local_atendimento || 'Recepção']
        );
        
        // Criar registro de atendimento
        const atendimentoResult = await client.query(
            `INSERT INTO atendimentos (senha_id, paciente_id, data_inicio, tipo_atendimento, profissional, descricao)
             VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)
             RETURNING id`,
            [senha.id, senha.paciente_id, 'RECEPCAO', dados.profissional || 'Recepcionista', 
             dados.descricao || 'Atendimento na recepção']
        );
        
        return {
            numero_senha: senha.numero_senha,
            paciente_nome: senha.nome,
            atendimento_id: atendimentoResult.rows[0].id,
            status: 'EM_ATENDIMENTO',
            timestamp: new Date()
        };
    });
};

// Finalizar atendimento
const finalizarAtendimento = async (numeroSenha) => {
    return transaction(async (client) => {
        // Obter a senha
        const senhaResult = await client.query(
            `SELECT s.id, s.numero_senha
             FROM senhas s
             WHERE s.numero_senha = $1`,
            [numeroSenha]
        );
        
        if (senhaResult.rows.length === 0) {
            return { error: 'Senha não encontrada' };
        }
        
        const senhaId = senhaResult.rows[0].id;
        
        // Atualizar status da senha
        await client.query(
            `UPDATE senhas 
             SET status = 'ATENDIDO', 
                 atendimento_finalizado_em = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [senhaId]
        );
        
        // Finalizar atendimento
        await client.query(
            `UPDATE atendimentos 
             SET data_fim = CURRENT_TIMESTAMP
             WHERE senha_id = $1`,
            [senhaId]
        );
        
        return {
            numero_senha: numeroSenha,
            status: 'ATENDIDO',
            timestamp: new Date()
        };
    });
};

// Obter histórico de chamadas
const obterHistoricoChamadas = async (limite = 20) => {
    const result = await query(
        `SELECT 
            c.id,
            c.data_chamada,
            s.numero_senha,
            p.nome as paciente_nome,
            s.status,
            c.respondida,
            EXTRACT(MINUTE FROM (c.data_chamada - s.data_emissao)) as tempo_espera_minutos
         FROM chamadas c
         JOIN senhas s ON c.senha_id = s.id
         JOIN pacientes p ON s.paciente_id = p.id
         ORDER BY c.data_chamada DESC
         LIMIT $1`,
        [limite]
    );
    
    return result.rows;
};

// Obter estatísticas do dia
const obterEstatisticasDia = async () => {
    const result = await query(
        `SELECT 
            COUNT(DISTINCT s.id) as total_senhas,
            COUNT(DISTINCT CASE WHEN s.status = 'ATENDIDO' THEN s.id END) as atendidos,
            COUNT(DISTINCT CASE WHEN s.status = 'EM_ATENDIMENTO' THEN s.id END) as em_atendimento,
            COUNT(DISTINCT CASE WHEN s.status IN ('EMITIDA', 'CHAMADA') THEN s.id END) as na_fila,
            AVG(EXTRACT(MINUTE FROM (s.atendimento_finalizado_em - s.data_emissao))) as tempo_medio_atendimento
         FROM senhas s
         WHERE DATE(s.data_emissao) = CURRENT_DATE`
    );
    
    return result.rows[0];
};

module.exports = {
    chamarProximoPaciente,
    chamarPacientePorSenha,
    iniciarAtendimento,
    finalizarAtendimento,
    obterHistoricoChamadas,
    obterEstatisticasDia
};
