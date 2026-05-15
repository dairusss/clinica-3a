-- ================================================
-- SCHEMA DO BANCO DE DADOS - SISTEMA DE CLÍNICA
-- ================================================

-- Tabela de Pacientes
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

-- Tabela de Senhas/Tickets (fluxo de atendimento)
CREATE TABLE IF NOT EXISTS senhas (
    id SERIAL PRIMARY KEY,
    numero_senha VARCHAR(10) NOT NULL UNIQUE,
    paciente_id INTEGER REFERENCES pacientes(id) ON DELETE CASCADE,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'EMITIDA', -- EMITIDA, CHAMADA, EM_ATENDIMENTO, ATENDIDO, CANCELADA
    chamada_em TIMESTAMP,
    atendimento_iniciado_em TIMESTAMP,
    atendimento_finalizado_em TIMESTAMP,
    local_atendimento VARCHAR(100), -- sala de recepção, consultório, etc
    observacoes TEXT,
    INDEX idx_status (status),
    INDEX idx_data_emissao (data_emissao),
    INDEX idx_paciente_id (paciente_id)
);

-- Tabela de Fila de Atendimento
CREATE TABLE IF NOT EXISTS fila_atendimento (
    id SERIAL PRIMARY KEY,
    senha_id INTEGER NOT NULL REFERENCES senhas(id) ON DELETE CASCADE,
    posicao_fila INTEGER,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prioridade INTEGER DEFAULT 0, -- 0 = normal, 1 = idoso, 2 = gestante, etc
    UNIQUE(senha_id),
    INDEX idx_posicao_fila (posicao_fila)
);

-- Tabela de Chamadas (histórico de chamadas)
CREATE TABLE IF NOT EXISTS chamadas (
    id SERIAL PRIMARY KEY,
    senha_id INTEGER NOT NULL REFERENCES senhas(id) ON DELETE CASCADE,
    data_chamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    local_chamada VARCHAR(100), -- totem, painel TV, etc
    respondida BOOLEAN DEFAULT FALSE,
    data_resposta TIMESTAMP,
    INDEX idx_data_chamada (data_chamada),
    INDEX idx_senha_id (senha_id)
);

-- Tabela de Atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
    id SERIAL PRIMARY KEY,
    senha_id INTEGER NOT NULL REFERENCES senhas(id) ON DELETE CASCADE,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP,
    tipo_atendimento VARCHAR(100), -- recepção, consulta, procedimento, etc
    profissional VARCHAR(255),
    descricao TEXT,
    INDEX idx_paciente_id (paciente_id),
    INDEX idx_data_inicio (data_inicio)
);

-- Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50), -- string, number, boolean
    descricao TEXT,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
('formato_senha', 'NUM', 'string', 'Formato da senha: NUM (numérico), ALPHA (letras), ALPHANUMERIC'),
('tamanho_senha', '4', 'number', 'Número de dígitos/caracteres da senha'),
('tempo_chamada_segundos', '30', 'number', 'Tempo máximo para responder uma chamada'),
('intervalo_chamada_minutos', '1', 'number', 'Intervalo entre chamadas automáticas'),
('som_chamada_ativado', 'true', 'boolean', 'Ativar som ao chamar paciente'),
('exibir_nome_completo', 'true', 'boolean', 'Exibir nome completo do paciente')
ON CONFLICT (chave) DO NOTHING;

-- ================================================
-- ÍNDICES ADICIONAIS
-- ================================================

CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX IF NOT EXISTS idx_senhas_numero ON senhas(numero_senha);
CREATE INDEX IF NOT EXISTS idx_senhas_status_data ON senhas(status, data_emissao DESC);

-- ================================================
-- VIEWS ÚTEIS
-- ================================================

-- View da fila atual (pacientes que ainda não foram atendidos)
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

-- View de pacientes em atendimento
CREATE OR REPLACE VIEW pacientes_em_atendimento AS
SELECT 
    s.numero_senha,
    p.nome,
    s.status,
    a.tipo_atendimento,
    a.profissional,
    s.local_atendimento,
    s.chamada_em,
    s.atendimento_iniciado_em
FROM senhas s
JOIN pacientes p ON s.paciente_id = p.id
LEFT JOIN atendimentos a ON s.id = a.senha_id
WHERE s.status IN ('CHAMADA', 'EM_ATENDIMENTO')
ORDER BY s.chamada_em DESC NULLS LAST, s.atendimento_iniciado_em DESC NULLS LAST;

-- ================================================
-- GRANT PERMISSIONS (se necessário)
-- ================================================
-- GRANT ALL PRIVILEGES ON DATABASE clinica TO clinica_user;
