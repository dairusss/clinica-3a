/**
 * @openapi
 * /api/pacientes/emitir-senha:
 *   post:
 *     summary: Emitir nova senha para paciente
 *     tags:
 *       - Pacientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *                 description: CPF sem pontos ou traço
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *               genero:
 *                 type: string
 *               endereco:
 *                 type: string
 *               prioridade:
 *                 type: integer
 *                 description: 0=normal, 1=idoso, 2=gestante, 3=deficiente
 *             required:
 *               - nome
 *               - cpf
 *               - telefone
 *               - prioridade
 *     responses:
 *       201:
 *         description: Senha emitida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Senha'
 */
const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { cpfValidator } = require('../utils/validators');

// POST /api/pacientes/emitir-senha - Emitir nova senha
router.post('/emitir-senha', [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('cpf').custom(cpfValidator)
], pacienteController.emitirSenha);

/**
 * @openapi
 * /api/pacientes/status/{numeroSenha}:
 *   get:
 *     summary: Obter status de uma senha
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - in: path
 *         name: numeroSenha
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da senha emitida
 *     responses:
 *       200:
 *         description: Status da senha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     numero_senha:
 *                       type: string
 *                     status:
 *                       type: string
 *                     posicao_fila:
 *                       type: integer
 *                     data_emissao:
 *                       type: string
 *                       format: date-time
 */
router.get('/status/:numeroSenha', [
    param('numeroSenha').notEmpty().withMessage('Número da senha é obrigatório')
], pacienteController.obterStatus);

/**
 * @openapi
 * /api/pacientes/fila:
 *   get:
 *     summary: Obter fila de atendimento atual
 *     tags:
 *       - Pacientes
 *     responses:
 *       200:
 *         description: Lista da fila atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Senha'
 */
router.get('/fila', pacienteController.obterFila);

/**
 * @openapi
 * /api/pacientes/proximo:
 *   get:
 *     summary: Obter próximo paciente da fila
 *     tags:
 *       - Pacientes
 *     responses:
 *       200:
 *         description: Próximo paciente na fila
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Senha'
 */
router.get('/proximo', pacienteController.obterProximo);
router.get('/atendimento-atual', pacienteController.obterAtendimentoAtual);

module.exports = router;
