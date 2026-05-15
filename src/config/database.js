const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'clinica',
    ssl: false
};

const pool = new Pool(poolConfig);

// Teste de conexão
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✓ Conectado ao PostgreSQL:', result.rows[0]);
        client.release();
        return true;
    } catch (error) {
        console.error('✗ Erro ao conectar ao PostgreSQL:', error.message);
        throw error;
    }
};

// Executar query
const query = (text, params) => pool.query(text, params);

// Executar query com transaction
const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};
