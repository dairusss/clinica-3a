# 🗄️ COMO CRIAR O BANCO DE DADOS NO POSTGRESQL 18

## ✅ INFORMAÇÕES

- **Senha PostgreSQL:** `123`
- **Versão:** PostgreSQL 18
- **Usuário criado:** `clinica_user`
- **Banco criado:** `clinica`
- **Senha do usuário clinica_user:** `123`

---

## 📋 PASSO A PASSO

### **OPÇÃO 1: Usando pgAdmin (Mais fácil para iniciantes)**

#### Passo 1: Abra pgAdmin
- Acesse: `http://localhost:5050`
- Login com suas credenciais

#### Passo 2: Conecte ao PostgreSQL
- Clique em "Servers" → "PostgreSQL 18" (ou seu servidor)
- Digite a senha: `123`

#### Passo 3: Crie o banco
- Clique com botão direito em "Databases"
- Selecione "Create" → "Database"
- Nome: `clinica`
- Clique "Save"

#### Passo 4: Execute o SQL
- Clique no banco `clinica`
- Vá em "Query Tool" (ícone SQL)
- Copie TODO o código abaixo
- Cole na janela
- Clique "Execute" (F5)

---

### **OPÇÃO 2: Usando psql (Linha de comando)**

#### Passo 1: Abra PowerShell
```powershell
# Acesse a pasta do PostgreSQL 18
cd "C:\Program Files\PostgreSQL\18\bin"
```

#### Passo 2: Conecte como superuser
```powershell
.\psql -U postgres
```
Quando pedir senha, digite: `123`

#### Passo 3: Cole o código SQL abaixo
Copie TODO o código SQL e cole no psql

#### Passo 4: Pressione Enter
O banco será criado automaticamente

---

## 🔐 CÓDIGO SQL COMPLETO

```sql
-- ================================================
-- SISTEMA DE CLÍNICA - POSTGRESQL 18
-- ================================================

-- ================================================
-- PARTE 1: CRIAR USUÁRIO E BANCO
-- ================================================

CREATE USER clinica_user WITH PASSWORD '123';
ALTER ROLE clinica_user SET client_encoding TO 'utf8';
ALTER ROLE clinica_user SET timezone TO 'America/Sao_Paulo';

CREATE DATABASE clinica 
  OWNER clinica_user 
  ENCODING 'UTF8';

GRANT ALL PRIVILEGES ON DATABASE clinica TO clinica_user;

-- ================================================
-- PARTE 2: CONECTAR AO BANCO clinica
-- ================================================
-- Se estiver usando pgAdmin, selecione o banco "clinica"
-- Se estiver usando psql, execute: \c clinica clinica_user

-- ================================================
-- PARTE 3: CRIAR TABELAS
-- ================================================

CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    data_nascimento DATE,
    genero VARCHAR(20),
    endereco TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS senhas (
    id SERIAL PRIMARY KEY,
    numero_senha VARCHAR(10) NOT NULL UNIQUE,
    paciente_id INTEGER REFERENCES pacientes(id) ON DELETE CASCADE,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'EMITIDA',
    chamada_em TIMESTAMP,
    atendimento_iniciado_em TIMESTAMP,
    atendimento_finalizado_em TIMESTAMP,
    local_atendimento VARCHAR(100),
    observacoes TEXT
);

CREATE TABLE IF NOT EXISTS fila_atendimento (
    id SERIAL PRIMARY KEY,
    senha_id INTEGER NOT NULL REFERENCES senhas(id) ON DELETE CASCADE UNIQUE,
    posicao_fila INTEGER,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prioridade INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chamadas (
    id SERIAL PRIMARY KEY,
    senha_id INTEGER NOT NULL REFERENCES senhas(id) ON DELETE CASCADE,
    data_chamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    local_chamada VARCHAR(100),
    respondida BOOLEAN DEFAULT FALSE,
    data_resposta TIMESTAMP
);

CREATE TABLE IF NOT EXISTS atendimentos (
    id SERIAL PRIMARY KEY,
    senha_id INTEGER NOT NULL REFERENCES senhas(id) ON DELETE CASCADE,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP,
    tipo_atendimento VARCHAR(100),
    profissional VARCHAR(255),
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50),
    descricao TEXT,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- PARTE 4: CRIAR ÍNDICES
-- ================================================

CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX IF NOT EXISTS idx_senhas_numero ON senhas(numero_senha);
CREATE INDEX IF NOT EXISTS idx_senhas_status_data ON senhas(status, data_emissao DESC);
CREATE INDEX IF NOT EXISTS idx_senhas_paciente_id ON senhas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_fila_posicao ON fila_atendimento(posicao_fila);
CREATE INDEX IF NOT EXISTS idx_chamadas_data ON chamadas(data_chamada);
CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON atendimentos(paciente_id);

-- ================================================
-- PARTE 5: CRIAR VIEWS
-- ================================================

CREATE OR REPLACE VIEW fila_atual AS
SELECT 
    f.id,
    f.posicao_fila,
    s.numero_senha,
    p.nome as paciente_nome,
    s.status,
    s.data_emissao,
    f.prioridade,
    EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP - s.data_emissao)) as tempo_espera_minutos
FROM fila_atendimento f
JOIN senhas s ON f.senha_id = s.id
JOIN pacientes p ON s.paciente_id = p.id
WHERE s.status IN ('EMITIDA', 'CHAMADA')
ORDER BY f.prioridade DESC, f.posicao_fila ASC;

CREATE OR REPLACE VIEW pacientes_em_atendimento AS
SELECT 
    s.numero_senha,
    p.nome,
    s.status,
    a.tipo_atendimento,
    a.profissional,
    s.local_atendimento
FROM senhas s
JOIN pacientes p ON s.paciente_id = p.id
LEFT JOIN atendimentos a ON s.id = a.senha_id
WHERE s.status IN ('CHAMADA', 'EM_ATENDIMENTO')
ORDER BY s.chamada_em DESC;

-- ================================================
-- PARTE 6: INSERIR CONFIGURAÇÕES PADRÃO
-- ================================================

INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
('formato_senha', 'NUM', 'string', 'Formato da senha: NUM (numérico)'),
('tamanho_senha', '4', 'number', 'Número de dígitos da senha'),
('tempo_chamada_segundos', '30', 'number', 'Tempo máximo para responder'),
('intervalo_chamada_minutos', '1', 'number', 'Intervalo entre chamadas'),
('som_chamada_ativado', 'true', 'boolean', 'Ativar som ao chamar'),
('exibir_nome_completo', 'true', 'boolean', 'Exibir nome completo')
ON CONFLICT (chave) DO NOTHING;

-- ================================================
-- PARTE 7: INSERIR DADOS DE EXEMPLO
-- ================================================

INSERT INTO pacientes (nome, cpf, telefone, email) VALUES
('João Silva', '12345678901', '11987654321', 'joao@email.com'),
('Maria Santos', '12345678902', '11987654322', 'maria@email.com'),
('Pedro Costa', '12345678903', '11987654323', 'pedro@email.com'),
('Ana Oliveira', '12345678904', '11987654324', 'ana@email.com'),
('Carlos Mendes', '12345678905', '11987654325', 'carlos@email.com')
ON CONFLICT (cpf) DO NOTHING;

-- ================================================
-- VERIFICAÇÃO FINAL
-- ================================================

-- Ver todas as tabelas criadas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Ver estrutura da tabela pacientes
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'pacientes';

-- Contar registros
SELECT COUNT(*) as total_pacientes FROM pacientes;

-- ================================================
-- FIM DO SCRIPT
-- ================================================
```

---

## ✅ VERIFICAÇÃO

Após executar o SQL, você verá:

```
CREATE ROLE
ALTER ROLE
CREATE DATABASE
GRANT
CREATE TABLE
CREATE TABLE
... (mais tabelas)
CREATE INDEX
... (mais índices)
CREATE VIEW
CREATE VIEW
INSERT 0 6
... (inserts)
```

Se vir isso, tudo funcionou! ✅

---

## 🔗 CONEXÃO NO NODE.JS

O arquivo `.env` já está configurado com:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=clinica_user
DB_PASSWORD=123
DB_NAME=clinica
```

Seu Node.js vai se conectar automaticamente!

---

## 📞 SUPORTE RÁPIDO

| Problema | Solução |
|----------|---------|
| "Role already exists" | Role clinica_user já existe (OK) |
| "Database already exists" | Banco clinica já existe (OK) |
| "Connection refused" | PostgreSQL não está rodando |
| "Password authentication failed" | Verifique a senha: deve ser `123` |
| "Syntax error" | Verifique se copiou TODO o código |

---

## 🎯 PRÓXIMO PASSO

Após criar o banco:

```bash
npm install
npm run dev
```

Seu backend vai se conectar automaticamente ao banco!

---

**Status:** ✅ Pronto para usar!
