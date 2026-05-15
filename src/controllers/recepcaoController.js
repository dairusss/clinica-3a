const RecepcaoModel = require('../models/recepcaoModel');

// Chamar próximo paciente
const chamarProximo = async (req, res) => {
    try {
        const resultado = await RecepcaoModel.chamarProximoPaciente();
        
        if (resultado.error) {
            return res.status(404).json({
                success: false,
                error: resultado.error
            });
        }
        
        res.json({
            success: true,
            message: 'Paciente chamado com sucesso',
            data: resultado
        });
    } catch (error) {
        console.error('Erro ao chamar paciente:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao chamar paciente'
        });
    }
};

// Chamar paciente específico
const chamarPorSenha = async (req, res) => {
    try {
        const { numeroSenha } = req.params;
        
        const resultado = await RecepcaoModel.chamarPacientePorSenha(numeroSenha);
        
        if (resultado.error) {
            return res.status(404).json({
                success: false,
                error: resultado.error
            });
        }
        
        res.json({
            success: true,
            message: 'Paciente chamado com sucesso',
            data: resultado
        });
    } catch (error) {
        console.error('Erro ao chamar paciente:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao chamar paciente'
        });
    }
};

// Iniciar atendimento
const iniciarAtendimento = async (req, res) => {
    try {
        const { numeroSenha } = req.params;
        const { local_atendimento, profissional, descricao } = req.body;
        
        const resultado = await RecepcaoModel.iniciarAtendimento(numeroSenha, {
            local_atendimento,
            profissional,
            descricao
        });
        
        if (resultado.error) {
            return res.status(404).json({
                success: false,
                error: resultado.error
            });
        }
        
        res.json({
            success: true,
            message: 'Atendimento iniciado com sucesso',
            data: resultado
        });
    } catch (error) {
        console.error('Erro ao iniciar atendimento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao iniciar atendimento'
        });
    }
};

// Finalizar atendimento
const finalizarAtendimento = async (req, res) => {
    try {
        const { numeroSenha } = req.params;
        
        const resultado = await RecepcaoModel.finalizarAtendimento(numeroSenha);
        
        if (resultado.error) {
            return res.status(404).json({
                success: false,
                error: resultado.error
            });
        }
        
        res.json({
            success: true,
            message: 'Atendimento finalizado com sucesso',
            data: resultado
        });
    } catch (error) {
        console.error('Erro ao finalizar atendimento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao finalizar atendimento'
        });
    }
};

// Obter histórico de chamadas
const obterHistorico = async (req, res) => {
    try {
        const { limite = 20 } = req.query;
        
        const historico = await RecepcaoModel.obterHistoricoChamadas(parseInt(limite));
        
        res.json({
            success: true,
            total: historico.length,
            data: historico
        });
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter histórico'
        });
    }
};

// Obter estatísticas
const obterEstatisticas = async (req, res) => {
    try {
        const stats = await RecepcaoModel.obterEstatisticasDia();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter estatísticas'
        });
    }
};

module.exports = {
    chamarProximo,
    chamarPorSenha,
    iniciarAtendimento,
    finalizarAtendimento,
    obterHistorico,
    obterEstatisticas
};
