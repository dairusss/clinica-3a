# Clínica 3A - Gerenciador de Fila

Sistema backend para gerenciar fila de atendimento em clínicas, seguindo o fluxo:
1. Paciente chega na clínica
2. Emite senha no totem ou QR Code
3. Acompanha pelo celular ou painel da TV
4. Recepção chama o paciente
5. Paciente é atendido na recepção

## 📋 Requisitos

- Node.js 14+
- PostgreSQL 12+
- npm ou yarn

## � Segurança

### Validações Implementadas

- **CPF**: Validação completa usando algoritmo oficial brasileiro
  - Verificação de dígitos verificadores
  - Prevenção de CPFs com todos dígitos iguais
  - Formatação automática (XXX.XXX.XXX-XX)
- **Dados Obrigatórios**: Nome e telefone são obrigatórios
- **Sanitização**: Remoção de caracteres especiais nos dados enviados
- **Backend Validation**: Validações duplicadas no servidor para segurança

### Prevenção de Fraudes

- CPF único por paciente (impede duplicatas)
- Validação em tempo real no frontend
- Validação rigorosa no backend
- Logs de todas as operações

### 1. Criar banco de dados no PostgreSQL

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE clinica;

# Conectar ao banco
\c clinica

# Executar o schema SQL
\i database/schema.sql

# Ou via linha de comando:
psql -U postgres -d clinica -f database/schema.sql
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais do PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=clinica
PORT=3000
```

### 4. Iniciar servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

## �️ Interfaces Disponíveis

Após iniciar o servidor (`npm run dev`), acesse:

### 1. **Totem de Senhas** - http://localhost:3000/totem
Interface para emissão de senhas com QR Code
- 📝 Formulário para dados do paciente
- 🔒 **Validação completa de CPF** (algoritmo oficial brasileiro)
- 🎫 Emissão de senha automática
- 🔲 QR Code gerado para acompanhamento
- 📱 Responsivo para touch screens
- **Para:** Recepção / Pacientes

### 2. **Acompanhamento Mobile** - http://localhost:3000/cliente-mobile
Interface responsiva para acompanhamento via celular
- 📍 Posição atual na fila
- ⏱️ Tempo estimado de espera
- 🔔 Notificação sonora ao ser chamado
- 🔄 Atualização automática a cada 3 segundos
- 📱 Funciona em qualquer smartphone
- **Para:** Pacientes

### 3. **Painel Eletrônico** - http://localhost:3000/painel
Painel para monitor de TV grande
- 📊 Mostra: Atendendo, Próximo, Fila
- 🔄 Atualiza automaticamente a cada 2 segundos
- 📺 Ideal para monitor grande na recepção
- ⚙️ 100% automático (sem intervenção)
- **Para:** Clínica / Monitores

### 4. **Painel Médico/Recepção** - http://localhost:3000/medico
Interface para controle do atendimento médico
- 📢 Chamar próximo paciente da fila
- ▶️ Iniciar atendimento do paciente chamado
- ✅ Finalizar atendimento
- 📊 Estatísticas da fila em tempo real
- 📝 Histórico de chamadas recentes
- 🔄 Atualização automática a cada 30 segundos
- **Para:** Médicos / Recepção

### 5. **Documentação API** - http://localhost:3000/docs
Interface Swagger interativa
- 🔗 Todos os endpoints disponíveis
- 🧪 Testar API direto do navegador
- 📚 Documentação completa
- 🔐 Testes de autorização
- **Para:** Desenvolvedores / Recepção avançada

---

## 🔄 Fluxo Completo

1. **Paciente chega na clínica**
   - Vai ao Totem: `http://localhost:3000/totem`

2. **Paciente emite senha**
   - Preenche: Nome, CPF, Telefone, Prioridade
   - Clica: "EMITIR SENHA"
   - Recebe: Número + QR Code

3. **Paciente acompanha fila**
   - Escaneia QR Code com celular
   - OU acessa: `http://localhost:3000/cliente-mobile`
   - Vê: Posição na fila e tempo estimado
   - Recebe: Som de notificação quando chamado

4. **Recepção chama paciente**
   - Acessa: `http://localhost:3000/docs`
   - Endpoint: `POST /api/recepcao/chamar-proximo`
   - Painel mostra número
   - Celular notifica paciente

5. **Monitor mostra fila**
   - Painel TV: `http://localhost:3000/painel`
   - Atualiza automaticamente
   - 100% sem intervenção

---

## �📡 Endpoints da API

### PACIENTES

#### 1. Emitir Senha
```http
POST /api/pacientes/emitir-senha
Content-Type: application/json

{
    "nome": "João Silva",
    "cpf": "12345678901",
    "telefone": "11999999999",
    "email": "joao@email.com",
    "data_nascimento": "1990-01-15",
    "genero": "M",
    "endereco": "Rua das Flores, 123",
    "prioridade": 0
}
```

**Resposta:**
```json
{
    "success": true,
    "message": "Senha emitida com sucesso",
    "data": {
        "id": 1,
        "numero_senha": "0047",
        "posicao_fila": 3,
        "data_emissao": "2024-05-08T10:30:00Z",
        "status": "EMITIDA"
    }
}
```

#### 2. Obter Status da Senha
```http
GET /api/pacientes/status/0047
```

**Resposta:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "numero_senha": "0047",
        "status": "CHAMADA",
        "data_emissao": "2024-05-08T10:30:00Z",
        "chamada_em": "2024-05-08T10:35:00Z",
        "paciente_nome": "João Silva",
        "posicao_fila": 1,
        "tempo_espera_minutos": 5
    }
}
```

#### 3. Obter Fila Atual
```http
GET /api/pacientes/fila
```

**Resposta:**
```json
{
    "success": true,
    "total": 3,
    "data": [
        {
            "id": 5,
            "posicao_fila": 1,
            "numero_senha": "0045",
            "paciente_nome": "Maria Santos",
            "status": "EMITIDA",
            "prioridade": 1,
            "tempo_espera_minutos": 8
        },
        {
            "id": 4,
            "posicao_fila": 2,
            "numero_senha": "0044",
            "paciente_nome": "Pedro Costa",
            "status": "EMITIDA",
            "prioridade": 0,
            "tempo_espera_minutos": 12
        }
    ]
}
```

#### 4. Obter Próximo Paciente
```http
GET /api/pacientes/proximo
```

---

### RECEPÇÃO

#### 1. Chamar Próximo Paciente
```http
POST /api/recepcao/chamar-proximo
```

**Resposta:**
```json
{
    "success": true,
    "message": "Paciente chamado com sucesso",
    "data": {
        "numero_senha": "0045",
        "paciente_nome": "Maria Santos",
        "posicao_fila": 1,
        "timestamp": "2024-05-08T10:37:00Z"
    }
}
```

#### 2. Chamar Paciente Específico
```http
POST /api/recepcao/chamar/0047
```

#### 3. Iniciar Atendimento
```http
POST /api/recepcao/iniciar/0047
Content-Type: application/json

{
    "local_atendimento": "Sala de Recepção",
    "profissional": "Ana Silva",
    "descricao": "Preenchimento de ficha de atendimento"
}
```

**Resposta:**
```json
{
    "success": true,
    "message": "Atendimento iniciado com sucesso",
    "data": {
        "numero_senha": "0047",
        "paciente_nome": "João Silva",
        "atendimento_id": 12,
        "status": "EM_ATENDIMENTO",
        "timestamp": "2024-05-08T10:38:00Z"
    }
}
```

#### 4. Finalizar Atendimento
```http
POST /api/recepcao/finalizar/0047
```

**Resposta:**
```json
{
    "success": true,
    "message": "Atendimento finalizado com sucesso",
    "data": {
        "numero_senha": "0047",
        "status": "ATENDIDO",
        "timestamp": "2024-05-08T10:45:00Z"
    }
}
```

#### 5. Obter Histórico de Chamadas
```http
GET /api/recepcao/historico?limite=20
```

**Resposta:**
```json
{
    "success": true,
    "total": 15,
    "data": [
        {
            "id": 8,
            "data_chamada": "2024-05-08T10:37:00Z",
            "numero_senha": "0045",
            "paciente_nome": "Maria Santos",
            "status": "ATENDIDO",
            "respondida": true,
            "tempo_espera_minutos": 8
        }
    ]
}
```

#### 6. Obter Estatísticas do Dia
```http
GET /api/recepcao/estatisticas
```

**Resposta:**
```json
{
    "success": true,
    "data": {
        "total_senhas": 45,
        "atendidos": 38,
        "em_atendimento": 2,
        "na_fila": 5,
        "tempo_medio_atendimento": 12.5
    }
}
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

**pacientes**
- id: Identificador único
- nome: Nome do paciente
- cpf: CPF (único)
- telefone: Telefone de contato
- email: Email
- data_nascimento: Data de nascimento
- genero: Gênero
- endereco: Endereço completo
- data_cadastro: Timestamp de criação
- ativo: Status ativo/inativo

**senhas**
- id: Identificador único
- numero_senha: Número da senha (único)
- paciente_id: Referência ao paciente
- data_emissao: Data de emissão
- status: EMITIDA, CHAMADA, EM_ATENDIMENTO, ATENDIDO, CANCELADA
- chamada_em: Timestamp da chamada
- atendimento_iniciado_em: Início do atendimento
- atendimento_finalizado_em: Fim do atendimento
- local_atendimento: Onde foi atendido
- observacoes: Observações gerais

**fila_atendimento**
- id: Identificador único
- senha_id: Referência à senha
- posicao_fila: Posição na fila
- data_entrada: Data de entrada na fila
- prioridade: Nível de prioridade

**chamadas**
- id: Identificador único
- senha_id: Referência à senha
- data_chamada: Data/hora da chamada
- local_chamada: De onde foi chamado (totem, painel, etc)
- respondida: Se foi respondida
- data_resposta: Quando respondeu

**atendimentos**
- id: Identificador único
- senha_id: Referência à senha
- paciente_id: Referência ao paciente
- data_inicio: Início do atendimento
- data_fim: Fim do atendimento
- tipo_atendimento: Tipo (recepção, consulta, etc)
- profissional: Quem atendeu
- descricao: Detalhes do atendimento

---

## 🔄 Fluxo de Atendimento

```
1. EMITIR SENHA
   POST /api/pacientes/emitir-senha
   → Status: EMITIDA
   → Paciente entra na fila

2. ACOMPANHAR
   GET /api/pacientes/status/:numeroSenha
   → Celular/Painel mostra posição na fila

3. CHAMAR PACIENTE
   POST /api/recepcao/chamar/:numeroSenha
   → Status: CHAMADA
   → Toca som/exibe nome no painel

4. INICIAR ATENDIMENTO
   POST /api/recepcao/iniciar/:numeroSenha
   → Status: EM_ATENDIMENTO
   → Recepcionista começa a atender

5. FINALIZAR ATENDIMENTO
   POST /api/recepcao/finalizar/:numeroSenha
   → Status: ATENDIDO
   → Próximo paciente pode ser chamado
```

---

## 🛠️ Troubleshooting

### Erro: "Conectado ao PostgreSQL"
Verifique as credenciais no arquivo `.env`

### Erro: "Tabelas não encontradas"
Execute novamente: `psql -U postgres -d clinica -f database/schema.sql`

### Porta 3000 já em uso
Altere no `.env`: `PORT=3001`

---

## 📄 Licença

MIT
