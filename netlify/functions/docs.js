const swaggerSpec = require('../../src/swagger');

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(swaggerSpec)
    };
};