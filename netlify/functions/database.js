const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Criar conexão com SQLite (banco em memória para teste)
let db = null;

const getDb = async () => {
    if (!db) {
        db = await open({
            filename: ':memory:',
            driver: sqlite3.Database
        });

        // Criar tabelas
        await db.exec(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cpf TEXT UNIQUE,
                telefone TEXT,
                email TEXT,
                data_nascimento DATE,
                genero TEXT,
                endereco TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS senhas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero_senha TEXT UNIQUE NOT NULL,
                paciente_id INTEGER,
                prioridade INTEGER DEFAULT 0,
                status TEXT DEFAULT 'espera',
                data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_chamada DATETIME,
                atendimento_inicio DATETIME,
                atendimento_fim DATETIME,
                FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
            );

            CREATE TABLE IF NOT EXISTS fila_atendimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                senha_id INTEGER,
                posicao_fila INTEGER,
                prioridade INTEGER DEFAULT 0,
                FOREIGN KEY (senha_id) REFERENCES senhas (id)
            );

            CREATE TABLE IF NOT EXISTS chamadas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                senha_id INTEGER,
                data_chamada DATETIME DEFAULT CURRENT_TIMESTAMP,
                local_chamada TEXT DEFAULT 'RECEPCAO',
                respondida BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (senha_id) REFERENCES senhas (id)
            );

            CREATE TABLE IF NOT EXISTS atendimentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                senha_id INTEGER,
                profissional TEXT,
                observacoes TEXT,
                data_inicio DATETIME,
                data_fim DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (senha_id) REFERENCES senhas (id)
            );
        `);
    }
    return db;
};

// Executar query
const query = async (text, params = []) => {
    const database = await getDb();
    return await database.all(text, params);
};

// Executar query com transaction
const transaction = async (callback) => {
    const database = await getDb();
    const result = await database.run('BEGIN TRANSACTION');
    try {
        const res = await callback(database);
        await database.run('COMMIT');
        return res;
    } catch (error) {
        await database.run('ROLLBACK');
        throw error;
    }
};

module.exports = {
    query,
    transaction
};