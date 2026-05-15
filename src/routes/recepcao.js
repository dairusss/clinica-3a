/**
 * @openapi
 * /api/recepcao/chamar-proximo:
 *   post:
 *     summary: Chamar o próximo paciente na fila
 *     tags:
 *       - Recepção
 *     responses:
 *       200:
 *         description: Paciente chamado com sucesso
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
const { body, param, query } = require('express-validator');
const router = express.Router();
const recepcaoController = require('../controllers/recepcaoController');

// POST /api/recepcao/chamar-proximo - Chamar próximo paciente da fila
router.post('/chamar-proximo', recepcaoController.chamarProximo);

/**
 * @openapi
 * /api/recepcao/chamar/{numeroSenha}:
 *   post:
 *     summary: Chamar paciente específico pelo número da senha
 *     tags:
 *       - Recepção
 *     parameters:
 *       - in: path
 *         name: numeroSenha
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da senha do paciente
 *     responses:
 *       200:
 *         description: Paciente chamado com sucesso
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
router.post('/chamar/:numeroSenha', [
    param('numeroSenha').notEmpty().withMessage('Número da senha é obrigatório')
], recepcaoController.chamarPorSenha);

/**
 * @openapi
 * /api/recepcao/iniciar/{numeroSenha}:
 *   post:
 *     summary: Iniciar atendimento de paciente chamado
 *     tags:
 *       - Recepção
 *     parameters:
 *       - in: path
 *         name: numeroSenha
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da senha do paciente
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               local_atendimento:
 *                 type: string
 *               profissional:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atendimento iniciado com sucesso
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
router.post('/iniciar/:numeroSenha', [
    param('numeroSenha').notEmpty().withMessage('Número da senha é obrigatório'),
    body('local_atendimento').optional(),
    body('profissional').optional(),
    body('descricao').optional()
], recepcaoController.iniciarAtendimento);

/**
 * @openapi
 * /api/recepcao/finalizar/{numeroSenha}:
 *   post:
 *     summary: Finalizar atendimento de paciente
 *     tags:
 *       - Recepção
 *     parameters:
 *       - in: path
 *         name: numeroSenha
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da senha do paciente
 *     responses:
 *       200:
 *         description: Atendimento finalizado com sucesso
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
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 */
router.post('/finalizar/:numeroSenha', [
    param('numeroSenha').notEmpty().withMessage('Número da senha é obrigatório')
], recepcaoController.finalizarAtendimento);

/**
 * @openapi
 * /api/recepcao/historico:
 *   get:
 *     summary: Obter histórico de chamadas
 *     tags:
 *       - Recepção
 *     parameters:
 *       - in: query
 *         name: limite
 *         required: false
 *         schema:
 *           type: integer
 *         description: Quantidade máxima de registros retornados
 *     responses:
 *       200:
 *         description: Histórico de chamadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Senha'
 */
router.get('/historico', [
    query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('Limite deve ser entre 1 e 100')
], recepcaoController.obterHistorico);

/**
 * @openapi
 * /api/recepcao/estatisticas:
 *   get:
 *     summary: Obter estatísticas do dia
 *     tags:
 *       - Recepção
 *     responses:
 *       200:
 *         description: Estatísticas de atendimento
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
 *                     total_na_fila:
 *                       type: integer
 *                     atendidos_hoje:
 *                       type: integer
 *                     tempo_medio_minutos:
 *                       type: number
 */
router.get('/estatisticas', recepcaoController.obterEstatisticas);

module.exports = router;
