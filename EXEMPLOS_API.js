/**
 * Exemplos de uso da API
 *
 * Antes de usar:
 * 1. Iniciar o servidor: npm run dev
 * 2. O servidor estará em http://localhost:3000
 *
 * INTERFACES DISPONÍVEIS:
 * - Totem: http://localhost:3000/totem
 * - Mobile: http://localhost:3000/cliente-mobile
 * - Painel TV: http://localhost:3000/painel
 * - Médico/Recepção: http://localhost:3000/medico
 * - Documentação: http://localhost:3000/docs
 *
 * SEGURANÇA:
 * - CPF validado com algoritmo oficial brasileiro
 * - Prevenção de duplicatas e fraudes
 * - Validação em frontend e backend
// ============================================
// EXEMPLOS DE CPFs VÁLIDOS E INVÁLIDOS
// ============================================

// ✅ CPFs VÁLIDOS (para teste):
// 123.456.789-09  (CPF de teste válido)
// 111.444.777-35  (CPF válido)
// 529.982.247-25  (CPF válido)

// ❌ CPFs INVÁLIDOS (serão rejeitados):
// 111.111.111-11  (todos dígitos iguais)
// 123.456.789-10  (dígitos verificadores errados)
// 123.456.78      (menos de 11 dígitos)
// abc.def.ghi-jk  (caracteres não numéricos)

// Opção A: Usando Fetch API (JavaScript no navegador ou Node.js)
fetch('http://localhost:3000/api/pacientes/emitir-senha', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nome: 'João Silva',
        cpf: '12345678901',
        telefone: '11987654321',
        email: 'joao@email.com',
        data_nascimento: '1990-05-15',
        genero: 'M',
        endereco: 'Rua das Flores, 123',
        prioridade: 0  // 0=normal, 1=idoso, 2=gestante, etc
    })
})
.then(response => response.json())
.then(data => console.log('Senha emitida:', data))
.catch(error => console.error('Erro:', error));

// ============================================
// 2. OBTER STATUS DA SENHA
// ============================================

fetch('http://localhost:3000/api/pacientes/status/0047')
    .then(response => response.json())
    .then(data => console.log('Status:', data))
    .catch(error => console.error('Erro:', error));

// ============================================
// 3. OBTER FILA ATUAL
// ============================================

fetch('http://localhost:3000/api/pacientes/fila')
    .then(response => response.json())
    .then(data => console.log('Fila:', data))
    .catch(error => console.error('Erro:', error));

// ============================================
// 4. OBTER PRÓXIMO PACIENTE
// ============================================

fetch('http://localhost:3000/api/pacientes/proximo')
    .then(response => response.json())
    .then(data => console.log('Próximo:', data))
    .catch(error => console.error('Erro:', error));

// ============================================
// 5. CHAMAR PRÓXIMO PACIENTE (RECEPÇÃO)
// ============================================

fetch('http://localhost:3000/api/recepcao/chamar-proximo', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log('Chamada:', data))
.catch(error => console.error('Erro:', error));

// ============================================
// 6. CHAMAR PACIENTE ESPECÍFICO
// ============================================

fetch('http://localhost:3000/api/recepcao/chamar/0047', {
    method: 'POST'
})
.then(response => response.json())
.then(data => console.log('Chamada específica:', data))
.catch(error => console.error('Erro:', error));

// ============================================
// 7. INICIAR ATENDIMENTO
// ============================================

fetch('http://localhost:3000/api/recepcao/iniciar/0047', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        local_atendimento: 'Sala de Recepção',
        profissional: 'Ana Silva',
        descricao: 'Preenchimento de ficha de atendimento'
    })
})
.then(response => response.json())
.then(data => console.log('Atendimento iniciado:', data))
.catch(error => console.error('Erro:', error));

// ============================================
// 8. FINALIZAR ATENDIMENTO
// ============================================

fetch('http://localhost:3000/api/recepcao/finalizar/0047', {
    method: 'POST'
})
.then(response => response.json())
.then(data => console.log('Atendimento finalizado:', data))
.catch(error => console.error('Erro:', error));

// ============================================
// 9. OBTER HISTÓRICO DE CHAMADAS
// ============================================

fetch('http://localhost:3000/api/recepcao/historico?limite=10')
    .then(response => response.json())
    .then(data => console.log('Histórico:', data))
    .catch(error => console.error('Erro:', error));

// ============================================
// 10. OBTER ESTATÍSTICAS DO DIA
// ============================================

fetch('http://localhost:3000/api/recepcao/estatisticas')
    .then(response => response.json())
    .then(data => console.log('Estatísticas:', data))
    .catch(error => console.error('Erro:', error));

// ============================================
// USANDO cURL (Terminal)
// ============================================

/**

# 1. Emitir senha
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "telefone": "11987654321",
    "email": "joao@email.com"
  }'

# 2. Obter status
curl http://localhost:3000/api/pacientes/status/0047

# 3. Obter fila
curl http://localhost:3000/api/pacientes/fila

# 4. Obter próximo
curl http://localhost:3000/api/pacientes/proximo

# 5. Chamar próximo
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo

# 6. Chamar específico
curl -X POST http://localhost:3000/api/recepcao/chamar/0047

# 7. Iniciar atendimento
curl -X POST http://localhost:3000/api/recepcao/iniciar/0047 \
  -H "Content-Type: application/json" \
  -d '{
    "local_atendimento": "Sala de Recepção",
    "profissional": "Ana Silva"
  }'

# 8. Finalizar atendimento
curl -X POST http://localhost:3000/api/recepcao/finalizar/0047

# 9. Histórico
curl http://localhost:3000/api/recepcao/historico?limite=20

# 10. Estatísticas
curl http://localhost:3000/api/recepcao/estatisticas

*/
