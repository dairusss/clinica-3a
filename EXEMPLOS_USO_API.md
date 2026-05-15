# 🔌 EXEMPLOS PRÁTICOS DE USO DA API

## Entendimento Rápido

O sistema tem 2 fluxos principais:

**FLUXO 1: Emitir Senha**
- Recepcionista → Paciente chega → Emite senha

**FLUXO 2: Chamar e Atender**
- Chamar próximo → Iniciar atendimento → Finalizar

---

## 📋 EXEMPLOS COM cURL

### 1. EMITIR SENHA (Recepção)

```bash
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "telefone": "11987654321",
    "email": "joao@email.com"
  }'

# Resposta esperada:
{
  "success": true,
  "message": "Senha emitida com sucesso",
  "data": {
    "id": 6,
    "numero_senha": "0042",
    "paciente_id": 6,
    "status": "EMITIDA",
    "posicao_fila": 1,
    "data_emissao": "2026-05-10T15:50:00Z"
  }
}
```

---

### 2. OBTER STATUS DA SENHA (Paciente consulta)

```bash
curl http://localhost:3000/api/pacientes/status/0042

# Resposta:
{
  "success": true,
  "data": {
    "numero_senha": "0042",
    "status": "EMITIDA",
    "posicao_fila": 1,
    "paciente_nome": "João Silva",
    "data_emissao": "2026-05-10T15:50:00Z"
  }
}
```

---

### 3. VER FILA ATUAL (Painel eletrônico)

```bash
curl http://localhost:3000/api/pacientes/fila

# Resposta:
{
  "success": true,
  "total": 5,
  "data": [
    {
      "numero_senha": "0040",
      "paciente_nome": "Maria Santos",
      "status": "CHAMADA",
      "posicao_fila": 1
    },
    {
      "numero_senha": "0041",
      "paciente_nome": "Pedro Costa",
      "status": "EMITIDA",
      "posicao_fila": 2
    },
    {
      "numero_senha": "0042",
      "paciente_nome": "João Silva",
      "status": "EMITIDA",
      "posicao_fila": 3
    }
  ]
}
```

---

### 4. OBTER PRÓXIMO PACIENTE A CHAMAR

```bash
curl http://localhost:3000/api/pacientes/proximo

# Resposta:
{
  "success": true,
  "data": {
    "numero_senha": "0041",
    "paciente_nome": "Pedro Costa",
    "posicao_fila": 1
  }
}
```

---

### 5. CHAMAR PRÓXIMO PACIENTE (Recepção)

```bash
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo

# Resposta:
{
  "success": true,
  "message": "Paciente chamado com sucesso",
  "data": {
    "numero_senha": "0041",
    "paciente_nome": "Pedro Costa",
    "status": "CHAMADA",
    "data_chamada": "2026-05-10T15:52:00Z"
  }
}
```

---

### 6. INICIAR ATENDIMENTO (Consultório)

```bash
curl -X POST http://localhost:3000/api/recepcao/iniciar/0041 \
  -H "Content-Type: application/json" \
  -d '{
    "local_atendimento": "Consultório 1",
    "profissional": "Dr. Carlos"
  }'

# Resposta:
{
  "success": true,
  "message": "Atendimento iniciado com sucesso",
  "data": {
    "numero_senha": "0041",
    "paciente_nome": "Pedro Costa",
    "status": "EM_ATENDIMENTO",
    "atendimento_iniciado_em": "2026-05-10T15:53:00Z"
  }
}
```

---

### 7. FINALIZAR ATENDIMENTO (Consultório)

```bash
curl -X POST http://localhost:3000/api/recepcao/finalizar/0041

# Resposta:
{
  "success": true,
  "message": "Atendimento finalizado com sucesso",
  "data": {
    "numero_senha": "0041",
    "paciente_nome": "Pedro Costa",
    "status": "ATENDIDO",
    "atendimento_finalizado_em": "2026-05-10T15:55:00Z"
  }
}
```

---

### 8. OBTER HISTÓRICO DE CHAMADAS

```bash
curl "http://localhost:3000/api/recepcao/historico?limite=10"

# Resposta:
{
  "success": true,
  "data": [
    {
      "numero_senha": "0041",
      "paciente_nome": "Pedro Costa",
      "data_chamada": "2026-05-10T15:52:00Z",
      "data_resposta": "2026-05-10T15:53:00Z",
      "respondida": true
    }
  ]
}
```

---

### 9. OBTER ESTATÍSTICAS DO DIA

```bash
curl http://localhost:3000/api/recepcao/estatisticas

# Resposta:
{
  "success": true,
  "data": {
    "total_pacientes_hoje": 42,
    "atendidos": 40,
    "em_espera": 2,
    "tempo_medio_espera_minutos": 12,
    "tempo_medio_atendimento_minutos": 25,
    "horario_pico": "14:00-15:00"
  }
}
```

---

## 🧪 CENÁRIO COMPLETO DE TESTE

### 1. Paciente chega (09:00)
```bash
# Emitir senha
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Oliveira",
    "cpf": "98765432100",
    "telefone": "11987654324"
  }'

# Obtém: número_senha = 0050
```

### 2. Painel exibe fila (continuamente)
```bash
# A cada 2 segundos
curl http://localhost:3000/api/pacientes/fila
```

### 3. Consultório fica livre (09:15)
```bash
# Chamar próximo
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo
# Retorna: 0050 (Ana Oliveira)
```

### 4. Monitor exibe "PRÓXIMO: 0050"
```bash
# Painel eletrônico mostra número
curl http://localhost:3000/api/pacientes/proximo
```

### 5. Paciente entra no consultório
```bash
# Iniciar atendimento
curl -X POST http://localhost:3000/api/recepcao/iniciar/0050 \
  -H "Content-Type: application/json" \
  -d '{
    "local_atendimento": "Consultório 2",
    "profissional": "Dra. Alice"
  }'
```

### 6. Consultório termina (09:40)
```bash
# Finalizar atendimento
curl -X POST http://localhost:3000/api/recepcao/finalizar/0050
```

### 7. Sistema chama próximo automaticamente
```bash
# Volta ao passo 3
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo
```

---

## 💻 COMO TESTAR VIA POSTMAN

1. Baixar Postman: https://www.postman.com/downloads/
2. Criar Nova Requisição
3. Escolher tipo: **POST** ou **GET**
4. Digitar URL (ex: http://localhost:3000/api/pacientes/emitir-senha)
5. Ir na aba **Body** → **raw** → **JSON**
6. Colar dados (confira exemplos acima)
7. Clicar **Send**

---

## 🌐 USANDO VIA NAVEGADOR

### Opção 1: Interface Swagger (Recomendado)
```
http://localhost:3000/docs
```
- Clique no endpoint
- "Try it out"
- Preencha dados
- "Execute"

### Opção 2: Teste simples (apenas GET)
```
http://localhost:3000/api/pacientes/fila
http://localhost:3000/api/pacientes/proximo
```

---

## 📱 USANDO JAVASCRIPT (Front-End)

```javascript
// Emitir senha
async function emitirSenha() {
  const response = await fetch('http://localhost:3000/api/pacientes/emitir-senha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: 'João Silva',
      cpf: '12345678901',
      telefone: '11987654321'
    })
  });
  
  const data = await response.json();
  console.log('Número da senha:', data.data.numero_senha);
}

// Obter próximo
async function obterProximo() {
  const response = await fetch('http://localhost:3000/api/pacientes/proximo');
  const data = await response.json();
  console.log('Próximo:', data.data.numero_senha);
}

// Chamar próximo
async function chamarProximo() {
  const response = await fetch('http://localhost:3000/api/recepcao/chamar-proximo', {
    method: 'POST'
  });
  const data = await response.json();
  console.log('Chamado:', data.data.numero_senha);
}

// Iniciar atendimento
async function iniciarAtendimento(numeroSenha) {
  const response = await fetch(`http://localhost:3000/api/recepcao/iniciar/${numeroSenha}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      local_atendimento: 'Consultório 1',
      profissional: 'Dr. Carlos'
    })
  });
  const data = await response.json();
  console.log('Atendimento iniciado:', data.data);
}

// Finalizar atendimento
async function finalizarAtendimento(numeroSenha) {
  const response = await fetch(`http://localhost:3000/api/recepcao/finalizar/${numeroSenha}`, {
    method: 'POST'
  });
  const data = await response.json();
  console.log('Atendimento finalizado:', data.data);
}
```

---

## 🔄 FLUXO DE STATUS

```
EMITIDA (recepção gera)
  ↓
CHAMADA (recepção chama)
  ↓
EM_ATENDIMENTO (consultório começa)
  ↓
ATENDIDO (consultório termina)
```

Ou:

```
EMITIDA → CANCELADA (se não comparecer)
```

---

## ⏱️ TEMPOS TÍPICOS

| Ação | Tempo |
|------|-------|
| Emitir senha | <1 seg |
| Chamar próximo | <1 seg |
| Iniciar atendimento | <1 seg |
| Consulta/atendimento | 15-30 min |
| Finalizar | <1 seg |
| **Total por paciente** | **20-40 min** |

---

## 🚨 ERROS COMUNS

### 400 - Bad Request
```
Significado: Dados inválidos
Solução: Verificar formato JSON, campos obrigatórios
```

### 404 - Not Found
```
Significado: Senha não existe
Solução: Verificar número da senha digitado
```

### 500 - Internal Server Error
```
Significado: Erro no servidor
Solução: Ver logs no terminal, verificar banco de dados
```

---

**Teste tudo na documentação interativa: http://localhost:3000/docs**
