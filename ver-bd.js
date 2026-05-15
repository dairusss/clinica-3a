require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'clinica'
});

(async () => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id,
                p.nome,
                p.cpf,
                p.telefone,
                p.email,
                s.numero_senha,
                s.status,
                s.data_emissao,
                f.posicao_fila,
                f.prioridade
            FROM pacientes p
            LEFT JOIN senhas s ON p.id = s.paciente_id
            LEFT JOIN fila_atendimento f ON s.id = f.senha_id
            ORDER BY s.data_emissao DESC
            LIMIT 20
        `);
        
        console.log('\n📊 DADOS NO POSTGRESQL:\n');
        
        if (result.rows.length === 0) {
            console.log('Nenhum paciente registrado ainda.');
        } else {
            console.table(result.rows);
            console.log(`\n✓ Total de registros: ${result.rows.length}\n`);
        }
        
        pool.end();
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error.message);
        process.exit(1);
    }
})();
