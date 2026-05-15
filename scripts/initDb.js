#!/usr/bin/env node

/**
 * Script para inicializar o banco de dados da clínica
 * Uso: node scripts/initDb.js
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'clinica'
});

async function initializeDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Inicializando banco de dados...\n');
        
        // Ler arquivo SQL
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Executar schema
        console.log('📝 Executando schema...');
        await client.query(schema);
        console.log('✓ Schema criado com sucesso\n');
        
        // Adicionar dados de exemplo
        console.log('📦 Adicionando dados de exemplo...');
        
        const pacientesExemplo = [
            ['João Silva', '12345678901', '11987654321', 'joao@email.com'],
            ['Maria Santos', '12345678902', '11987654322', 'maria@email.com'],
            ['Pedro Costa', '12345678903', '11987654323', 'pedro@email.com'],
            ['Ana Oliveira', '12345678904', '11987654324', 'ana@email.com'],
            ['Carlos Mendes', '12345678905', '11987654325', 'carlos@email.com']
        ];
        
        for (const [nome, cpf, telefone, email] of pacientesExemplo) {
            await client.query(
                `INSERT INTO pacientes (nome, cpf, telefone, email) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (cpf) DO NOTHING`,
                [nome, cpf, telefone, email]
            );
        }
        
        console.log(`✓ ${pacientesExemplo.length} pacientes adicionados\n`);
        
        // Contar dados
        const countPacientes = await client.query('SELECT COUNT(*) FROM pacientes');
        const countSenhas = await client.query('SELECT COUNT(*) FROM senhas');
        
        console.log('📊 Status do banco:');
        console.log(`   • Pacientes: ${countPacientes.rows[0].count}`);
        console.log(`   • Senhas: ${countSenhas.rows[0].count}`);
        console.log('\n✅ Banco de dados inicializado com sucesso!\n');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
        process.exit(1);
    } finally {
        await client.end();
        await pool.end();
    }
}

initializeDatabase();
