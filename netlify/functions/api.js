// Esta função Netlify carrega o Express app direto
// Permite rodar o servidor completo como função serverless

require('dotenv').config();

// Importar o app Express do src/server.js
const app = require('../../src/server.js');
const serverlessHttp = require('serverless-http');

// Validar variáveis de ambiente críticas
if (!process.env.DATABASE_URL) {
    console.error('❌ ERRO: DATABASE_URL não está configurada no .env');
}

// Exportar como função Netlify
exports.handler = serverlessHttp(app);
