const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clinica 3A - API',
            version: '1.0.0',
            description: 'API para gerenciamento de fila de atendimento na Clinica 3A',
            contact: {
                name: 'Suporte',
                email: 'suporte@clinica.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Desenvolvimento'
            }
        ],
        components: {
            schemas: {
                Paciente: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nome: { type: 'string' },
                        cpf: { type: 'string' },
                        telefone: { type: 'string' },
                        email: { type: 'string' },
                        data_nascimento: { type: 'string', format: 'date' },
                        genero: { type: 'string' },
                        endereco: { type: 'string' },
                        data_cadastro: { type: 'string', format: 'date-time' },
                        ativo: { type: 'boolean' }
                    }
                },
                Senha: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        numero_senha: { type: 'string' },
                        paciente_id: { type: 'integer' },
                        data_emissao: { type: 'string', format: 'date-time' },
                        status: { type: 'string', enum: ['EMITIDA', 'CHAMADA', 'EM_ATENDIMENTO', 'ATENDIDO', 'CANCELADA'] },
                        local_atendimento: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: [path.join(__dirname, 'routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
