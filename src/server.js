const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..')));

// Testes de conexão com BD
const { testConnection } = require('./config/database');

// Swagger
const swaggerSpec = require('./swagger');

// Rotas
const pacienteRoutes = require('./routes/pacientes');
const recepcaoRoutes = require('./routes/recepcao');

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de páginas estáticas
app.get('/totem', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'totem.html'));
});

app.get('/cliente-mobile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'cliente-mobile.html'));
});

app.get('/painel', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'painel-eletronico.html'));
});

app.get('/medico', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'medico.html'));
});

// API Routes
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/recepcao', recepcaoRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'Clinica 3A - API',
        version: '1.0.0',
        interfaces: {
            totem: 'http://localhost:3000/totem - Interface para emitir senhas',
            'cliente-mobile': 'http://localhost:3000/cliente-mobile - Acompanhar fila no celular',
            painel: 'http://localhost:3000/painel - Painel eletrônico (TV)',
            medico: 'http://localhost:3000/medico - Painel médico/recepção',
            docs: 'http://localhost:3000/docs - Documentação Swagger'
        },
        endpoints: {
            pacientes: '/api/pacientes',
            recepcao: '/api/recepcao',
            health: '/health'
        }
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`${'█'.repeat(70)}`);
        console.log(`${'█'}${'  '.repeat(20)}🏥 CLINICA 3A - SISTEMA DE FILA${'  '.repeat(10)}█`);
        console.log(`${'█'.repeat(70)}`);
        console.log(`${'═'.repeat(70)}\n`);
        
        console.log(`✓ Servidor rodando na porta ${PORT}\n`);
        
        console.log('📱 INTERFACES DISPONÍVEIS:\n');
        console.log(`   1️⃣  Totem (Emitir Senhas)`);
        console.log(`       🔗 http://localhost:${PORT}/totem\n`);
        
        console.log(`   2️⃣  Cliente Mobile (Acompanhar Fila)`);
        console.log(`       🔗 http://localhost:${PORT}/cliente-mobile\n`);
        
        console.log(`   3️⃣  Painel Eletrônico (TV)`);
        console.log(`       🔗 http://localhost:${PORT}/painel\n`);
        
        console.log(`   4️⃣  Painel Médico/Recepção`);
        console.log(`       🔗 http://localhost:${PORT}/medico\n`);
        
        console.log(`   5️⃣  Dashboard Principal`);
        console.log(`       🔗 http://localhost:${PORT}\n`);
        
        console.log(`   📚 Documentação API (Swagger)`);
        console.log(`       🔗 http://localhost:${PORT}/docs\n`);
        
        console.log(`${'═'.repeat(70)}\n`);
        console.log(`✅ Sistema pronto para uso! Abra uma das URLs acima no navegador.\n`);
        console.log(`${'═'.repeat(70)}\n`);
    });
}).catch(err => {
    console.error('❌ Falha ao conectar ao banco de dados:', err);
    process.exit(1);
});

module.exports = app;
