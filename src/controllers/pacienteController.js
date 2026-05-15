const PacienteModel = require('../models/pacienteModel');
const { validationResult } = require('express-validator');

// Emitir senha
const emitirSenha = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { nome, cpf, telefone, email, data_nascimento, genero, endereco, prioridade } = req.body;
        
        const resultado = await PacienteModel.emitirSenha({
            nome,
            cpf,
            telefone,
            email,
            data_nascimento,
            genero,
            endereco,
            prioridade: prioridade || 0
        });
        
        res.status(201).json({
            success: true,
            message: 'Senha emitida com sucesso',
            data: {
                ...resultado,
                numeroSenha: resultado.numero_senha
            }
        });
    } catch (error) {
        console.error('Erro ao emitir senha:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao emitir senha',
            message: error.message
        });
    }
};

// Obter status da senha
const obterStatus = async (req, res) => {
    try {
        const { numeroSenha } = req.params;
        
        const status = await PacienteModel.obterStatusSenha(numeroSenha);
        
        if (!status) {
            return res.status(404).json({
                success: false,
                error: 'Senha não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: {
                ...status,
                numeroSenha: status.numero_senha,
                posicaoFila: status.posicao_fila,
                horaEmissao: status.data_emissao
            }
        });
    } catch (error) {
        console.error('Erro ao obter status:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter status'
        });
    }
};

// Obter fila atual
const obterFila = async (req, res) => {
    try {
        const fila = await PacienteModel.obterFilaAtual();
        
        res.json({
            success: true,
            total: fila.length,
            data: fila
        });
    } catch (error) {
        console.error('Erro ao obter fila:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter fila'
        });
    }
};

// Obter próximo paciente
const obterProximo = async (req, res) => {
    try {
        const proximo = await PacienteModel.obterProximoPaciente();
        
        if (!proximo) {
            return res.status(404).json({
                success: false,
                message: 'Nenhum paciente na fila'
            });
        }
        
        res.json({
            success: true,
            data: proximo
        });
    } catch (error) {
        console.error('Erro ao obter próximo:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter próximo paciente'
        });
    }
};

// Obter paciente em atendimento atual (chamado ou em atendimento)
const obterAtendimentoAtual = async (req, res) => {
    try {
        const atendimento = await PacienteModel.obterAtendimentoAtual();

        if (!atendimento) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: atendimento
        });
    } catch (error) {
        console.error('Erro ao obter atendimento atual:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao obter atendimento atual'
        });
    }
};

module.exports = {
    emitirSenha,
    obterStatus,
    obterFila,
    obterProximo,
    obterAtendimentoAtual
};
