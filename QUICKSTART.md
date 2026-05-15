# ============================================
# QUICKSTART - COMEÇAR RÁPIDO
# ============================================

## PASSO 1: Setup PostgreSQL

# Abra pgAdmin ou PostgreSQL CLI e execute:

```sql
-- Copie e cole em uma conexão PostgreSQL

-- Criar usuário
CREATE USER clinica_user WITH PASSWORD 'clinica123';

-- Criar banco
CREATE DATABASE clinica OWNER clinica_user ENCODING 'UTF8';

-- Conectar ao banco
\c clinica clinica_user

-- Executar schema (copie todo conteúdo de database/schema.sql aqui)
-- OU use: psql -U clinica_user -d clinica -f database/schema.sql
```

## PASSO 2: Configurar Backend

```bash
# 1. Abrir pasta do projeto
cd C:\Users\Weyffer\Desktop\Clinica

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env
copy .env.example .env

# 4. Editar .env com credenciais PostgreSQL
#    DB_HOST=localhost
#    DB_PORT=5432
#    DB_USER=clinica_user
#    DB_PASSWORD=clinica123
#    DB_NAME=clinica
#    PORT=3000

# 5. Iniciar servidor
npm run dev
```

## PASSO 3: Testar API

Abra o navegador ou Postman:

```
GET  http://localhost:3000/health
GET  http://localhost:3000/

POST http://localhost:3000/api/pacientes/emitir-senha
{
  "nome": "João Silva",
  "cpf": "12345678901"
}

GET  http://localhost:3000/api/pacientes/fila
POST http://localhost:3000/api/recepcao/chamar-proximo
```

## ============================================
## ESTRUTURA DE PASTAS
## ============================================

```
Clinica/
├── database/
│   ├── schema.sql              # Schema do PostgreSQL
│   └── [seu-backup.sql]        # Backups (opcional)
├── src/
│   ├── config/
│   │   └── database.js         # Conexão PostgreSQL
│   ├── controllers/
│   │   ├── pacienteController.js
│   │   └── recepcaoController.js
│   ├── models/
│   │   ├── pacienteModel.js
│   │   └── recepcaoModel.js
│   ├── routes/
│   │   ├── pacientes.js        # GET status, fila, próximo
│   │   └── recepcao.js         # POST chamar, atender, finalizar
│   └── server.js               # Servidor principal
├── scripts/
│   └── initDb.js               # Script de inicialização
├── .env.example                # Template de variáveis
├── .env                        # Suas credenciais (não versionar!)
├── package.json
├── README.md                   # Documentação completa
├── EXEMPLOS_API.js             # Exemplos de requisições
├── SETUP_POSTGRES.sql          # Guia PostgreSQL
└── QUICKSTART.md               # Este arquivo
```

## ============================================
## RESUMO DO FLUXO
## ============================================

```
1️⃣  EMITIR SENHA
    POST /api/pacientes/emitir-senha
    ↓
    Paciente recebe: "Sua senha é 0047"
    
2️⃣  ACOMPANHAR
    GET /api/pacientes/status/0047
    ↓
    Mostra: "Você é o 3º da fila"
    
3️⃣  CHAMAR PACIENTE
    POST /api/recepcao/chamar-proximo
    ↓
    Painel exibe: "SENHA 0047 - RECEPÇÃO"
    
4️⃣  INICIAR ATENDIMENTO
    POST /api/recepcao/iniciar/0047
    ↓
    Status: EM_ATENDIMENTO
    
5️⃣  FINALIZAR ATENDIMENTO
    POST /api/recepcao/finalizar/0047
    ↓
    Status: ATENDIDO
    Próximo paciente é chamado
```

## ============================================
## TROUBLESHOOTING
## ============================================

### Erro: "ECONNREFUSED - Conexão recusada"
→ PostgreSQL não está rodando
→ Solução: Inicie o PostgreSQL

### Erro: "FATAL: database does not exist"
→ Banco não foi criado
→ Solução: Execute schema.sql conforme PASSO 1

### Erro: "Cannot find module 'express'"
→ Dependências não foram instaladas
→ Solução: npm install

### Erro: "Port 3000 already in use"
→ Outra aplicação está usando porta 3000
→ Solução: npm run dev com PORT=3001 no .env

### Erro: "Invalid CPF format"
→ CPF deve ter exatamente 11 dígitos
→ Exemplo: "12345678901" (sem pontos ou traços)

## ============================================
## PRÓXIMAS ETAPAS (OPCIONAL)
## ============================================

- [ ] Criar frontend em React/Vue para exibir fila
- [ ] Criar painel de TV para mostrar senha e sala
- [ ] Integrar QR Code no totem
- [ ] Enviar SMS com número da senha
- [ ] Autenticação de usuários
- [ ] Dashboard de estatísticas
- [ ] Backup automático do banco

## ============================================
## SUPORTE
## ============================================

Documentação: README.md
Exemplos: EXEMPLOS_API.js
Setup PostgreSQL: SETUP_POSTGRES.sql
