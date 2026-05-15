# 📡 REFERÊNCIA RÁPIDA - TODOS OS ENDPOINTS

## ================================================
## APIS PACIENTES
## ================================================

### 1️⃣ EMITIR SENHA
```http
POST /api/pacientes/emitir-senha
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "11987654321",
  "email": "joao@email.com",
  "data_nascimento": "1990-01-15",
  "genero": "M",
  "endereco": "Rua das Flores, 123",
  "prioridade": 0
}
```

**Resposta (201):**
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

**Campos obrigatórios:** nome, cpf
**Status HTTP:** 201 (sucesso), 400 (erro validação)

---

### 2️⃣ OBTER STATUS DA SENHA
```http
GET /api/pacientes/status/0047
```

**Resposta (200):**
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
    "tempo_espera_minutos": 5,
    "local_atendimento": "Recepção"
  }
}
```

**Parâmetros:**
- `numeroSenha` (path): Número da senha (obrigatório)

**Status HTTP:** 200 (OK), 404 (não encontrado)

---

### 3️⃣ OBTER FILA COMPLETA
```http
GET /api/pacientes/fila
```

**Resposta (200):**
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

**Status HTTP:** 200

---

### 4️⃣ OBTER PRÓXIMO PACIENTE
```http
GET /api/pacientes/proximo
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "posicao_fila": 1,
    "senha_id": 101,
    "numero_senha": "0045",
    "paciente_nome": "Maria Santos",
    "prioridade": 1
  }
}
```

**Resposta (404) - Se fila vazia:**
```json
{
  "success": false,
  "message": "Nenhum paciente na fila"
}
```

**Status HTTP:** 200 (OK), 404 (fila vazia)

---

## ================================================
## APIS RECEPÇÃO
## ================================================

### 5️⃣ CHAMAR PRÓXIMO PACIENTE
```http
POST /api/recepcao/chamar-proximo
```

**Resposta (200):**
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

**Resposta (404) - Se fila vazia:**
```json
{
  "success": false,
  "error": "Nenhum paciente na fila"
}
```

**Status HTTP:** 200 (OK), 404 (fila vazia)

---

### 6️⃣ CHAMAR PACIENTE ESPECÍFICO
```http
POST /api/recepcao/chamar/0047
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Paciente chamado com sucesso",
  "data": {
    "numero_senha": "0047",
    "paciente_nome": "João Silva",
    "chamado_em": "2024-05-08T10:38:00Z"
  }
}
```

**Parâmetros:**
- `numeroSenha` (path): Número da senha (obrigatório)

**Status HTTP:** 200 (OK), 404 (senha não encontrada)

---

### 7️⃣ INICIAR ATENDIMENTO
```http
POST /api/recepcao/iniciar/0047
Content-Type: application/json

{
  "local_atendimento": "Sala de Recepção",
  "profissional": "Ana Silva",
  "descricao": "Preenchimento de ficha de atendimento"
}
```

**Resposta (200):**
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

**Parâmetros:**
- `numeroSenha` (path): Número da senha (obrigatório)
- `local_atendimento` (body): Onde será atendido (opcional)
- `profissional` (body): Nome do profissional (opcional)
- `descricao` (body): Descrição do atendimento (opcional)

**Status HTTP:** 200 (OK), 404 (senha não encontrada)

---

### 8️⃣ FINALIZAR ATENDIMENTO
```http
POST /api/recepcao/finalizar/0047
```

**Resposta (200):**
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

**Parâmetros:**
- `numeroSenha` (path): Número da senha (obrigatório)

**Status HTTP:** 200 (OK), 404 (senha não encontrada)

---

### 9️⃣ OBTER HISTÓRICO DE CHAMADAS
```http
GET /api/recepcao/historico?limite=20
```

**Resposta (200):**
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
    },
    {
      "id": 7,
      "data_chamada": "2024-05-08T10:32:00Z",
      "numero_senha": "0044",
      "paciente_nome": "Pedro Costa",
      "status": "ATENDIDO",
      "respondida": true,
      "tempo_espera_minutos": 12
    }
  ]
}
```

**Parâmetros Query:**
- `limite` (query): Número máximo de registros (default: 20, max: 100)

**Status HTTP:** 200

---

### 🔟 OBTER ESTATÍSTICAS DO DIA
```http
GET /api/recepcao/estatisticas
```

**Resposta (200):**
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

**Campos:**
- `total_senhas`: Total de senhas emitidas hoje
- `atendidos`: Total de atendimentos finalizados
- `em_atendimento`: Atendimentos em progresso
- `na_fila`: Pacientes aguardando
- `tempo_medio_atendimento`: Tempo médio em minutos

**Status HTTP:** 200

---

## ================================================
## TABELA DE REFERÊNCIA
## ================================================

| Endpoint | Método | Descrição | Status OK |
|----------|--------|-----------|-----------|
| `/api/pacientes/emitir-senha` | POST | Gerar nova senha | 201 |
| `/api/pacientes/status/:numero` | GET | Ver status da senha | 200 |
| `/api/pacientes/fila` | GET | Ver fila completa | 200 |
| `/api/pacientes/proximo` | GET | Próximo da fila | 200 |
| `/api/recepcao/chamar-proximo` | POST | Chamar próximo | 200 |
| `/api/recepcao/chamar/:numero` | POST | Chamar específico | 200 |
| `/api/recepcao/iniciar/:numero` | POST | Iniciar atendimento | 200 |
| `/api/recepcao/finalizar/:numero` | POST | Finalizar atendimento | 200 |
| `/api/recepcao/historico` | GET | Ver histórico | 200 |
| `/api/recepcao/estatisticas` | GET | Estatísticas do dia | 200 |

---

## ================================================
## CÓDIGOS HTTP
## ================================================

| Código | Significado |
|--------|-------------|
| **200** | OK - Requisição bem sucedida |
| **201** | Created - Recurso criado com sucesso |
| **400** | Bad Request - Erro na validação |
| **404** | Not Found - Recurso não encontrado |
| **500** | Internal Server Error - Erro do servidor |

---

## ================================================
## STATUS DE SENHA
## ================================================

| Status | Significado | Próximo Status |
|--------|-------------|----------------|
| `EMITIDA` | Senha gerada, aguardando | CHAMADA |
| `CHAMADA` | Paciente foi chamado | EM_ATENDIMENTO |
| `EM_ATENDIMENTO` | Atendimento em progresso | ATENDIDO |
| `ATENDIDO` | Atendimento finalizado | ❌ Final |
| `CANCELADA` | Senha cancelada | ❌ Final |

---

## ================================================
## PRIORIDADES
## ================================================

| Valor | Descrição |
|-------|-----------|
| `0` | Normal (atendimento comum) |
| `1` | Idoso (maior prioridade) |
| `2` | Gestante (máxima prioridade) |

Quanto **maior o número**, **maior a prioridade**.

---

## ================================================
## FORMATOS DE DATA
## ================================================

Todas as datas usam formato ISO 8601:
```
2024-05-08T10:30:00Z
```

No PostgreSQL:
```sql
data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## ================================================
## ERROS COMUNS
## ================================================

### CPF Inválido
```json
{
  "errors": [
    {
      "msg": "CPF deve ter 11 dígitos",
      "param": "cpf"
    }
  ]
}
```
**Solução:** Use 11 dígitos sem pontos: "12345678901"

### Campo Obrigatório Faltando
```json
{
  "errors": [
    {
      "msg": "Nome é obrigatório",
      "param": "nome"
    }
  ]
}
```
**Solução:** Sempre envie "nome" e "cpf"

### Senha Não Encontrada
```json
{
  "success": false,
  "error": "Senha não encontrada"
}
```
**Solução:** Verifique se o número da senha está correto

### Nenhum Paciente na Fila
```json
{
  "success": false,
  "message": "Nenhum paciente na fila"
}
```
**Solução:** Primeiro, emita algumas senhas antes de chamar

---

## ================================================
## EXEMPLOS RÁPIDOS
## ================================================

### cURL - Emitir Senha
```bash
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","cpf":"12345678901"}'
```

### cURL - Ver Fila
```bash
curl http://localhost:3000/api/pacientes/fila
```

### cURL - Chamar Próximo
```bash
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo
```

### JavaScript - Emitir Senha
```javascript
fetch('http://localhost:3000/api/pacientes/emitir-senha', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    nome: 'João Silva',
    cpf: '12345678901'
  })
})
.then(r => r.json())
.then(d => console.log(d.data.numero_senha));
```

### Python - Ver Status
```python
import requests

response = requests.get('http://localhost:3000/api/pacientes/status/0047')
data = response.json()
print(data['data']['posicao_fila'])
```

---

## ================================================
## CASOS DE USO
## ================================================

### Caso 1: Emitir Senha e Verificar Status
```bash
# 1. Emitir
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","cpf":"98765432100"}'
# Retorna: numero_senha = "0050"

# 2. Verificar
curl http://localhost:3000/api/pacientes/status/0050
# Mostra posição na fila
```

### Caso 2: Chamar Próximo e Atender
```bash
# 1. Chamar
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo

# 2. Iniciar
curl -X POST http://localhost:3000/api/recepcao/iniciar/0050 \
  -H "Content-Type: application/json" \
  -d '{"local_atendimento":"Sala 1"}'

# 3. Finalizar
curl -X POST http://localhost:3000/api/recepcao/finalizar/0050
```

### Caso 3: Ver Andamento do Dia
```bash
# Estatísticas
curl http://localhost:3000/api/recepcao/estatisticas

# Histórico
curl http://localhost:3000/api/recepcao/historico?limite=50
```

---

## 💡 DICAS

1. **CPF**: Sempre 11 dígitos sem formatação
2. **Nome**: Campo obrigatório
3. **Status**: Muda automaticamente conforme fluxo
4. **Prioridade**: Maior número = maior prioridade
5. **Timestamps**: Sempre em UTC (Z no final)
6. **Limite**: Máximo 100 registros por query

---

**Referência Rápida - Criada em 8 de Maio de 2026**
