-- ================================================
-- GUIA PRÁTICO DE SETUP NO POSTGRESQL
-- ================================================

-- PASSO 1: Criar usuário (opcional, mas recomendado)
-- No PostgreSQL, conecte como superuser (postgres):

CREATE USER clinica_user WITH PASSWORD 'sua_senha_segura_aqui';

ALTER ROLE clinica_user SET client_encoding TO 'utf8';
ALTER ROLE clinica_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE clinica_user SET default_transaction_deferrable TO on;
ALTER ROLE clinica_user SET timezone TO 'America/Sao_Paulo';

-- PASSO 2: Criar banco de dados
CREATE DATABASE clinica 
  OWNER clinica_user 
  ENCODING 'UTF8' 
  LC_COLLATE='pt_BR.UTF-8' 
  LC_CTYPE='pt_BR.UTF-8' 
  TEMPLATE template0;

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE clinica TO clinica_user;

-- PASSO 3: Conectar ao novo banco
\c clinica clinica_user

-- PASSO 4: Criar schema público se necessário
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO clinica_user;

-- PASSO 5: Executar o arquivo schema.sql
-- Via psql: \i /caminho/para/database/schema.sql
-- Ou via comando: psql -U clinica_user -d clinica -f database/schema.sql

-- ================================================
-- VERIFICAÇÕES APÓS SETUP
-- ================================================

-- Ver todas as tabelas criadas
\dt

-- Ver estrutura de uma tabela
\d pacientes

-- Ver todas as views
\dv

-- Ver índices
\di

-- Contar registros de cada tabela
SELECT 
    tablename,
    (SELECT COUNT(*) FROM pacientes) as pacientes,
    (SELECT COUNT(*) FROM senhas) as senhas,
    (SELECT COUNT(*) FROM fila_atendimento) as fila_atendimento,
    (SELECT COUNT(*) FROM chamadas) as chamadas,
    (SELECT COUNT(*) FROM atendimentos) as atendimentos
FROM pg_tables 
WHERE schemaname = 'public' 
LIMIT 1;

-- Ver configurações
SELECT * FROM configuracoes;

-- ================================================
-- QUERIES ÚTEIS
-- ================================================

-- 1. Fila atual ordenada por prioridade
SELECT * FROM fila_atual;

-- 2. Pacientes em atendimento
SELECT * FROM pacientes_em_atendimento;

-- 3. Total de atendimentos do dia
SELECT COUNT(*) FROM senhas WHERE DATE(data_emissao) = CURRENT_DATE;

-- 4. Tempo médio de atendimento
SELECT AVG(EXTRACT(EPOCH FROM (atendimento_finalizado_em - data_emissao))/60) as tempo_medio_minutos
FROM senhas 
WHERE atendimento_finalizado_em IS NOT NULL
AND DATE(data_emissao) = CURRENT_DATE;

-- 5. Paciente que está esperando há mais tempo
SELECT 
    p.nome,
    s.numero_senha,
    EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP - s.data_emissao)) as minutos_esperando
FROM senhas s
JOIN pacientes p ON s.paciente_id = p.id
WHERE s.status IN ('EMITIDA', 'CHAMADA')
ORDER BY s.data_emissao ASC
LIMIT 1;

-- 6. Histórico de um paciente
SELECT 
    p.nome,
    s.numero_senha,
    s.status,
    s.data_emissao,
    s.atendimento_iniciado_em,
    s.atendimento_finalizado_em
FROM senhas s
JOIN pacientes p ON s.paciente_id = p.id
WHERE p.cpf = '12345678901'
ORDER BY s.data_emissao DESC;

-- 7. Estatísticas de hoje
SELECT 
    DATE(data_emissao) as data,
    COUNT(*) as total_senhas,
    COUNT(CASE WHEN status = 'ATENDIDO' THEN 1 END) as atendidos,
    COUNT(CASE WHEN status IN ('EMITIDA', 'CHAMADA') THEN 1 END) as na_fila,
    ROUND(AVG(EXTRACT(EPOCH FROM (atendimento_finalizado_em - data_emissao)))/60, 2) as tempo_medio_minutos
FROM senhas
WHERE DATE(data_emissao) = CURRENT_DATE
GROUP BY DATE(data_emissao);

-- ================================================
-- LIMPEZA E MANUTENÇÃO
-- ================================================

-- Backup do banco
-- No terminal: pg_dump -U clinica_user -d clinica -f backup.sql

-- Restaurar backup
-- No terminal: psql -U clinica_user -d clinica -f backup.sql

-- Limpar senhas antigas (mais de 30 dias)
DELETE FROM senhas 
WHERE DATE(data_emissao) < CURRENT_DATE - INTERVAL '30 days';

-- Resetar sequências (após DELETE massivo)
ALTER SEQUENCE senhas_id_seq RESTART WITH 1;
ALTER SEQUENCE pacientes_id_seq RESTART WITH 1;

-- ================================================
-- RECRIAR BANCO DO ZERO
-- ================================================

-- Conectar como postgres (superuser)
\c postgres

-- Desconectar todos os usuários
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'clinica' AND pid <> pg_backend_pid();

-- Deletar banco
DROP DATABASE IF EXISTS clinica;

-- Deletar usuário
DROP USER IF EXISTS clinica_user;

-- Recriar tudo (execute os passos 1-5 acima)
