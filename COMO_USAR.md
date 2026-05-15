# 🎯 GUIA PRÁTICO - COMO USAR O SISTEMA

## ================================================
## PASSO 1: SETUP INICIAL (10 MINUTOS)
## ================================================

### 1.1 - Instalar dependências
```bash
cd C:\Users\Weyffer\Desktop\Clinica
npm install
```

### 1.2 - Configurar PostgreSQL
```sql
-- Copie TODO o conteúdo de: SQL_COMPLETO.sql
-- Cole no PostgreSQL e execute
```

### 1.3 - Verificar .env
```bash
# Arquivo .env já está pré-preenchido
# Se suas credenciais PostgreSQL são diferentes, altere:
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

### 1.4 - Iniciar servidor
```bash
npm run dev
```

Esperado:
```
✓ Conectado ao PostgreSQL
✓ Servidor rodando na porta 3000
✓ Acesse: http://localhost:3000
```

---

## ================================================
## PASSO 2: TESTAR A API (5 MINUTOS)
## ================================================

### Opção A: Navegador
1. Abra http://localhost:3000
2. Deve ver mensagem "Sistema de Clínica - API"

### Opção B: cURL (Terminal)
```bash
# Verificar se está rodando
curl http://localhost:3000/health

# Emitir senha
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","cpf":"12345678901"}'

# Ver fila
curl http://localhost:3000/api/pacientes/fila
```

### Opção C: Postman
1. Instale Postman (https://www.postman.com)
2. Importe exemplos de **EXEMPLOS_API.js**
3. Teste cada endpoint

### Opção D: Node.js
```bash
node test.js
```

---

## ================================================
## PASSO 3: USAR O SISTEMA (FLUXO COMPLETO)
## ================================================

### Cenário: Um paciente chega na clínica

#### ETAPA 1: Emitir Senha (TOTEM)
```bash
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "telefone": "11987654321",
    "email": "joao@email.com"
  }'

# Resposta:
# {
#   "numero_senha": "0042",
#   "posicao_fila": 1,
#   "status": "EMITIDA"
# }
```

#### ETAPA 2: Paciente Acompanha (CELULAR/TV)
```bash
# Paciente verifica status:
curl http://localhost:3000/api/pacientes/status/0042

# Resposta:
# {
#   "numero_senha": "0042",
#   "paciente_nome": "João Silva",
#   "posicao_fila": 1,
#   "tempo_espera_minutos": 2,
#   "status": "EMITIDA"
# }
```

#### ETAPA 3: Ver Fila (PAINEL TV/RECEPÇÃO)
```bash
curl http://localhost:3000/api/pacientes/fila

# Resposta: Lista todos na fila
# [
#   {
#     "posicao_fila": 1,
#     "numero_senha": "0042",
#     "paciente_nome": "João Silva",
#     "status": "EMITIDA"
#   },
#   ...
# ]
```

#### ETAPA 4: Chamar Paciente (RECEPÇÃO)
```bash
# Chamar próximo
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo

# Resposta:
# {
#   "numero_senha": "0042",
#   "paciente_nome": "João Silva",
#   "status": "CHAMADA"
# }
```

#### ETAPA 5: Iniciar Atendimento (RECEPÇÃO)
```bash
curl -X POST http://localhost:3000/api/recepcao/iniciar/0042 \
  -H "Content-Type: application/json" \
  -d '{
    "local_atendimento": "Sala de Recepção",
    "profissional": "Ana Silva"
  }'

# Resposta:
# {
#   "numero_senha": "0042",
#   "status": "EM_ATENDIMENTO",
#   "atendimento_id": 5
# }
```

#### ETAPA 6: Finalizar Atendimento (RECEPÇÃO)
```bash
curl -X POST http://localhost:3000/api/recepcao/finalizar/0042

# Resposta:
# {
#   "numero_senha": "0042",
#   "status": "ATENDIDO"
# }
```

#### ETAPA 7: Ver Estatísticas (GERENCIAMENTO)
```bash
curl http://localhost:3000/api/recepcao/estatisticas

# Resposta:
# {
#   "total_senhas": 42,
#   "atendidos": 40,
#   "em_atendimento": 1,
#   "na_fila": 1,
#   "tempo_medio_atendimento": 12.5
# }
```

---

## ================================================
## PASSO 4: CONSULTAR DADOS NO POSTGRESQL
## ================================================

### Conectar ao banco
```bash
psql -U clinica_user -d clinica
```

### Queries úteis

**Ver fila atual:**
```sql
SELECT * FROM fila_atual;
```

**Ver pacientes em atendimento:**
```sql
SELECT * FROM pacientes_em_atendimento;
```

**Ver histórico de um paciente:**
```sql
SELECT * FROM senhas 
WHERE paciente_id = 1 
ORDER BY data_emissao DESC;
```

**Ver estatísticas do dia:**
```sql
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'ATENDIDO' THEN 1 END) as atendidos,
  COUNT(CASE WHEN status IN ('EMITIDA', 'CHAMADA') THEN 1 END) as na_fila
FROM senhas
WHERE DATE(data_emissao) = CURRENT_DATE;
```

Use **FOLHA_DE_COLA_SQL.sql** para mais queries!

---

## ================================================
## PASSO 5: PARAR E REINICIAR
## ================================================

### Parar servidor
```bash
# Ctrl + C no terminal onde npm run dev está rodando
```

### Reiniciar servidor
```bash
npm run dev
```

### Modo produção
```bash
npm start
```

### Limpar dados (começar do zero)
```sql
-- No PostgreSQL:
TRUNCATE TABLE chamadas CASCADE;
TRUNCATE TABLE atendimentos CASCADE;
TRUNCATE TABLE fila_atendimento CASCADE;
TRUNCATE TABLE senhas CASCADE;
ALTER SEQUENCE senhas_id_seq RESTART WITH 1;
```

---

## ================================================
## TROUBLESHOOTING COMUM
## ================================================

### ❌ "Erro: Cannot find module 'express'"
**Solução:** Execute `npm install`

### ❌ "Erro: Connection refused - PostgreSQL"
**Solução:** 
1. Inicie o PostgreSQL
2. Verifique credenciais em .env
3. Verifique se banco existe: `psql -l`

### ❌ "Erro: database clinica does not exist"
**Solução:** Execute SQL_COMPLETO.sql no PostgreSQL

### ❌ "Port 3000 already in use"
**Solução:** Altere PORT no .env para 3001 (ou outra)

### ❌ "Invalid CPF format"
**Solução:** CPF deve ter 11 dígitos: "12345678901" (sem pontos)

### ❌ "Painel não está atualizando"
**Solução:** 
1. Verificar se GET /api/pacientes/fila está retornando dados
2. Implementar refresh automático (a cada 5 segundos)
3. Usar WebSocket para atualização em tempo real

---

## ================================================
## ESTRUTURA DO FLUXO VISUAL
## ================================================

```
┌─────────────────────────────────────┐
│   TOTEM / QR CODE                   │
│ Paciente escaneia ou toca           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ POST /emitir-senha                  │
│ Recebe: número "0042"               │
└────────────┬────────────────────────┘
             │
             ▼
┌──────────────────────────┬───────────────────────┐
│  CELULAR DO PACIENTE     │  PAINEL TV NA CLÍNICA │
│ GET /status/0042         │ GET /fila             │
│ "Você é o 3º"            │ Lista completa        │
└──────────────────────────┴───────────────────────┘
             │                      │
             └──────────┬───────────┘
                        ▼
        ┌───────────────────────────┐
        │ RECEPÇÃO VÊ FILA          │
        │ Próximo paciente é: 0042  │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │ POST /chamar-proximo      │
        │ Painel exibe:             │
        │ "SENHA 0042 - RECEPÇÃO"   │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │ Paciente vai à recepção   │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │ POST /iniciar/0042        │
        │ Recepcionista atende      │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │ POST /finalizar/0042      │
        │ Atendimento concluído     │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │ Próximo paciente chamado  │
        │ Volta para chamar         │
        └───────────────────────────┘
```

---

## ================================================
## EXEMPLOS DE INTEGRAÇÃO
## ================================================

### Frontend React (snippet)
```javascript
import React, { useState, useEffect } from 'react';

function Fila() {
  const [fila, setFila] = useState([]);

  useEffect(() => {
    // Atualizar a cada 5 segundos
    const interval = setInterval(() => {
      fetch('http://localhost:3000/api/pacientes/fila')
        .then(r => r.json())
        .then(d => setFila(d.data));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Fila de Atendimento</h1>
      {fila.map(item => (
        <div key={item.id}>
          <h2>Senha: {item.numero_senha}</h2>
          <p>{item.paciente_nome}</p>
          <p>Posição: {item.posicao_fila}</p>
        </div>
      ))}
    </div>
  );
}

export default Fila;
```

### Painel TV (HTML simples)
```html
<html>
<head>
  <style>
    .fila { font-size: 48px; text-align: center; }
    .numero { color: red; font-weight: bold; }
  </style>
</head>
<body>
  <div class="fila" id="fila">
    <div class="numero">Próximo: 0000</div>
  </div>
  
  <script>
    setInterval(() => {
      fetch('http://localhost:3000/api/pacientes/proximo')
        .then(r => r.json())
        .then(d => {
          document.querySelector('.numero').textContent = 
            'Próximo: ' + d.data.numero_senha;
        });
    }, 3000);
  </script>
</body>
</html>
```

---

## ================================================
## MONITORAMENTO DIÁRIO
## ================================================

### Para gerente/administrador

**Ver andamento do dia:**
```bash
# Abra terminal do servidor:
npm run dev

# Veja logs em tempo real
# Se algo errar, aparece no terminal
```

**Verificar estatísticas:**
```bash
curl http://localhost:3000/api/recepcao/estatisticas
```

**Fazer backup:**
```bash
pg_dump -U clinica_user -d clinica > backup_$(date +%Y%m%d).sql
```

---

## ================================================
## DICAS DE USO
## ================================================

1. **Deixe o servidor rodando**: `npm run dev` em um terminal dedicado
2. **Monitore em tempo real**: Use logs do servidor
3. **Backup regular**: Faça backup diário do banco
4. **Teste periodicamente**: Execute `test.js` para validar
5. **Documente mudanças**: Se alterar código, documente no README

---

## ✅ CHECKLIST DE FUNCIONAMENTO

- [ ] Server rodando em http://localhost:3000
- [ ] PostgreSQL conectado (log: "✓ Conectado ao PostgreSQL")
- [ ] GET /health retorna 200 OK
- [ ] Consegui emitir uma senha
- [ ] Consigo ver a fila
- [ ] Consigo chamar um paciente
- [ ] Consigo iniciar um atendimento
- [ ] Consigo finalizar um atendimento
- [ ] Estatísticas estão corretas

Se todos acima estão OK, seu sistema está **100% funcional**! ✅

---

## 🎓 PRÓXIMAS ETAPAS

1. **Criar Frontend**: React/Vue para visualizar
2. **Integrar QR Code**: Para totem
3. **Integrar SMS**: Notificação de senha
4. **Criar App Mobile**: Para paciente acompanhar
5. **Deploy**: Colocar em produção

Veja **DEPLOYMENT.md** quando estiver pronto!

---

Aproveite o sistema! 🚀
