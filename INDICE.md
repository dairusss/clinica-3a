# 📑 ÍNDICE COMPLETO - SISTEMA DE CLÍNICA

## 🚀 COMECE AQUI

1. **RESUMO.txt** ← LEIA PRIMEIRO
   - Visão geral do sistema
   - Estrutura de arquivos
   - Como começar em 5 passos
   - Troubleshooting

2. **QUICKSTART.md**
   - Guia rápido passo a passo
   - Comandos para copiar e colar
   - Próximas etapas

3. **README.md**
   - Documentação completa
   - Todos os endpoints
   - Explicação de cada tabela
   - Fluxo de atendimento

---

## 📦 BANCO DE DADOS

### SQL
- **SQL_COMPLETO.sql** - Arquivo único com TUDO (copie e cole no PostgreSQL)
- **database/schema.sql** - Schema completo com comentários
- **SETUP_POSTGRES.sql** - Guia detalhado de setup do PostgreSQL
- **FOLHA_DE_COLA_SQL.sql** - Queries úteis para usar no dia a dia

### Passos:
1. Abra PostgreSQL
2. Copie conteúdo de `SQL_COMPLETO.sql`
3. Cole e execute

---

## 💻 BACKEND (Node.js/Express)

### Configuração
- **package.json** - Dependências do projeto
- **.env** - Variáveis de ambiente (PRÉ-PREENCHIDO)
- **.env.example** - Template de .env
- **.gitignore** - Arquivos a ignorar no Git

### Servidor
- **src/server.js** - Servidor principal Express

### Configuração
- **src/config/database.js** - Conexão com PostgreSQL

### Controllers (Lógica)
- **src/controllers/pacienteController.js** - Emissão de senhas
- **src/controllers/recepcaoController.js** - Chamadas e atendimentos

### Models (Banco de Dados)
- **src/models/pacienteModel.js** - Queries de pacientes
- **src/models/recepcaoModel.js** - Queries de recepção

### Routes (API)
- **src/routes/pacientes.js** - Endpoints de pacientes
- **src/routes/recepcao.js** - Endpoints de recepção

### Scripts
- **scripts/initDb.js** - Script de inicialização do BD

---

## 📋 DOCUMENTAÇÃO

### Guias
- **README.md** - Documentação técnica completa
- **QUICKSTART.md** - Guia rápido para começar
- **RESUMO.txt** - Visão geral executiva
- **DIAGRAMAS.txt** - Diagramas ASCII de arquitetura

### Exemplos
- **EXEMPLOS_API.js** - Exemplos de requisições HTTP
- **test.js** - Script de testes automatizados

### Referência
- **FOLHA_DE_COLA_SQL.sql** - Queries SQL prontas para usar
- **SETUP_POSTGRES.sql** - Guia PostgreSQL passo a passo

---

## 🔧 SETUP E INICIALIZAÇÃO

### Windows
- **setup.bat** - Script automático de setup

### Linux/Mac
- **setup.sh** - Script automático de setup

### Passo a passo
1. Execute `setup.bat` (Windows) ou `./setup.sh` (Linux/Mac)
2. Ou siga **QUICKSTART.md**
3. Ou siga **README.md**

---

## 📡 ENDPOINTS DA API

### PACIENTES (Emissão de Senhas)
```
POST   /api/pacientes/emitir-senha      ← Gerar nova senha
GET    /api/pacientes/status/:numero     ← Ver status
GET    /api/pacientes/fila               ← Ver fila completa
GET    /api/pacientes/proximo            ← Próximo da fila
```

### RECEPÇÃO (Chamadas e Atendimento)
```
POST   /api/recepcao/chamar-proximo      ← Chamar próximo paciente
POST   /api/recepcao/chamar/:numero      ← Chamar específico
POST   /api/recepcao/iniciar/:numero     ← Iniciar atendimento
POST   /api/recepcao/finalizar/:numero   ← Finalizar atendimento
GET    /api/recepcao/historico           ← Histórico de chamadas
GET    /api/recepcao/estatisticas        ← Estatísticas do dia
```

Veja **README.md** para exemplos de uso de cada endpoint.

---

## 🗄️ TABELAS DO BANCO

| Tabela | Descrição |
|--------|-----------|
| **pacientes** | Dados dos pacientes (CPF, nome, telefone, etc) |
| **senhas** | Senhas/tickets (numero, status, timestamps) |
| **fila_atendimento** | Posição na fila e prioridade |
| **chamadas** | Histórico de chamadas dos pacientes |
| **atendimentos** | Detalhes de cada atendimento |
| **configuracoes** | Configurações do sistema |

Veja **database/schema.sql** para campos detalhados.

---

## 🔄 FLUXO DE ATENDIMENTO

```
1. Paciente chega na clínica
   ↓
2. Emite senha no totem
   POST /pacientes/emitir-senha → "0047"
   ↓
3. Acompanha na fila
   GET /pacientes/status/0047 → "Você é 3º"
   ↓
4. Painel TV mostra fila
   GET /pacientes/fila
   ↓
5. Recepção chama paciente
   POST /recepcao/chamar-proximo
   ↓
6. Paciente vai à recepção
   ↓
7. Inicia atendimento
   POST /recepcao/iniciar/0047
   ↓
8. Finaliza atendimento
   POST /recepcao/finalizar/0047
   ↓
9. Próximo paciente é chamado
```

---

## 🧪 TESTANDO

### Com cURL (Terminal)
```bash
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","cpf":"12345678901"}'
```

### Com Postman
Importe e teste os exemplos de **README.md**

### Automatizado
```bash
node test.js
```

Veja **test.js** para mais exemplos.

---

## 🚀 QUICK START (5 MINUTOS)

### 1. Setup PostgreSQL
```bash
# Copie todo conteúdo de SQL_COMPLETO.sql
# Cole no PostgreSQL e execute
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar .env
```bash
# Arquivo .env já vem pré-preenchido
# Ajuste se necessário
```

### 4. Iniciar servidor
```bash
npm run dev
```

### 5. Testar
```bash
# Abra navegador: http://localhost:3000
# Ou execute: node test.js
```

Veja **QUICKSTART.md** para detalhes.

---

## 📊 ESTRUTURA DE PASTAS

```
Clinica/
├── database/               ← Banco de dados
│   └── schema.sql
├── src/                    ← Código do servidor
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── scripts/                ← Scripts auxiliares
├── node_modules/           ← Dependências (gerado)
├── package.json            ← Definição de dependências
├── .env                    ← Configurações (não versionar!)
├── .gitignore              ← Arquivos a ignorar
│
├── README.md               ← Documentação técnica
├── QUICKSTART.md           ← Guia rápido
├── RESUMO.txt              ← Visão geral
├── DIAGRAMAS.txt           ← Arquitetura
│
├── EXEMPLOS_API.js         ← Exemplos de requisições
├── test.js                 ← Testes automatizados
│
├── SQL_COMPLETO.sql        ← SQL pronto para usar
├── FOLHA_DE_COLA_SQL.sql   ← Queries úteis
├── SETUP_POSTGRES.sql      ← Guia PostgreSQL
│
├── setup.bat               ← Setup automático (Windows)
└── setup.sh                ← Setup automático (Linux/Mac)
```

---

## 📚 DOCUMENTAÇÃO POR TÓPICO

### Para iniciantes
1. **RESUMO.txt** - Entender o que foi criado
2. **QUICKSTART.md** - Começar a rodar
3. **DIAGRAMAS.txt** - Visualizar arquitetura

### Para desenvolvedores
1. **README.md** - Documentação técnica completa
2. **EXEMPLOS_API.js** - Como chamar cada API
3. **FOLHA_DE_COLA_SQL.sql** - Queries SQL úteis

### Para DevOps
1. **setup.bat** / **setup.sh** - Automatizar setup
2. **SQL_COMPLETO.sql** - Reproduzir banco
3. **.env.example** - Variáveis de ambiente

### Para DBA
1. **SETUP_POSTGRES.sql** - Guia PostgreSQL detalhado
2. **FOLHA_DE_COLA_SQL.sql** - Queries de manutenção
3. **database/schema.sql** - Estrutura completa

---

## 🆘 AJUDA

### Erro: "Não consigo conectar ao banco"
→ Veja: **SETUP_POSTGRES.sql** seção "TROUBLESHOOTING"

### Erro: "Porta 3000 já em uso"
→ Altere em **.env**: `PORT=3001`

### Erro: "Não sei qual API usar"
→ Leia: **README.md** seção "Endpoints"

### Erro: "Como faço deploy?"
→ Veja: **README.md** seção "Próximos Passos"

---

## 🎯 PRÓXIMAS ETAPAS

Depois de rodar o sistema, considere:

1. **Frontend** - React/Vue para painel de chamadas
2. **Segurança** - Autenticação de usuários
3. **Notificações** - SMS/WhatsApp para pacientes
4. **Relatórios** - Dashboard de estatísticas
5. **Deploy** - Produção (AWS, Azure, Heroku)

Veja **README.md** "Próximos Passos" para mais ideias.

---

## ✨ RESUMO

Você tem:
- ✅ Backend Node.js/Express completo
- ✅ API RESTful com 10 endpoints
- ✅ Banco PostgreSQL com 6 tabelas
- ✅ Documentação completa
- ✅ Exemplos de uso
- ✅ Scripts de setup automático
- ✅ Testes prontos

Está pronto para usar! 🚀

---

## 📞 CONTATO

Dúvidas? Consulte:
- **README.md** - Documentação
- **EXEMPLOS_API.js** - Exemplos
- **FOLHA_DE_COLA_SQL.sql** - Queries
- **test.js** - Testes

Bom trabalho! 🏥
