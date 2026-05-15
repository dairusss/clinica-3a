/**
 * ARQUIVO DE TESTES - SISTEMA DE CLÍNICA
 * 
 * Use este arquivo para testar todos os endpoints
 * Execute: node test.js
 * 
 * Requisitos:
 * - Servidor rodando: npm run dev
 * - PostgreSQL rodando e banco criado
 */

const BASE_URL = 'http://localhost:3000/api';

// ================================================
// UTILITÁRIOS
// ================================================

async function fazerRequisicao(metodo, endpoint, corpo = null) {
    try {
        const opcoes = {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (corpo) {
            opcoes.body = JSON.stringify(corpo);
        }

        const resposta = await fetch(BASE_URL + endpoint, opcoes);
        const dados = await resposta.json();

        if (resposta.ok) {
            console.log(`✅ ${metodo} ${endpoint}`);
            console.log('Resposta:', JSON.stringify(dados, null, 2));
        } else {
            console.log(`❌ ${metodo} ${endpoint}`);
            console.log('Erro:', JSON.stringify(dados, null, 2));
        }

        console.log('---\n');
        return dados;
    } catch (erro) {
        console.error(`❌ Erro ao chamar ${endpoint}:`, erro.message);
        return null;
    }
}

// ================================================
// TESTES
// ================================================

async function executarTestes() {
    console.log('🧪 INICIANDO TESTES DO SISTEMA\n');
    console.log('BASE_URL:', BASE_URL);
    console.log('='.repeat(50) + '\n');

    // 1. EMITIR SENHAS
    console.log('1️⃣  EMITINDO SENHAS\n');

    const senha1 = await fazerRequisicao('POST', '/pacientes/emitir-senha', {
        nome: 'João Silva',
        cpf: '12345678901',
        telefone: '11987654321',
        email: 'joao@email.com',
        prioridade: 0
    });

    const senha2 = await fazerRequisicao('POST', '/pacientes/emitir-senha', {
        nome: 'Maria Santos',
        cpf: '12345678902',
        telefone: '11987654322',
        email: 'maria@email.com',
        prioridade: 1  // Idosa (maior prioridade)
    });

    const senha3 = await fazerRequisicao('POST', '/pacientes/emitir-senha', {
        nome: 'Pedro Costa',
        cpf: '12345678903',
        telefone: '11987654323',
        prioridade: 0
    });

    // Guardar números de senha para usar depois
    const numeroSenha1 = senha1?.data?.numero_senha;
    const numeroSenha2 = senha2?.data?.numero_senha;
    const numeroSenha3 = senha3?.data?.numero_senha;

    if (!numeroSenha1 || !numeroSenha2 || !numeroSenha3) {
        console.error('❌ Erro ao gerar senhas. Aborte.');
        return;
    }

    // 2. VERIFICAR STATUS
    console.log('2️⃣  VERIFICANDO STATUS DAS SENHAS\n');

    await fazerRequisicao('GET', `/pacientes/status/${numeroSenha1}`);
    await fazerRequisicao('GET', `/pacientes/status/${numeroSenha2}`);
    await fazerRequisicao('GET', `/pacientes/status/${numeroSenha3}`);

    // 3. VER FILA COMPLETA
    console.log('3️⃣  OBTENDO FILA COMPLETA\n');

    const fila = await fazerRequisicao('GET', '/pacientes/fila');

    // 4. OBTER PRÓXIMO
    console.log('4️⃣  OBTENDO PRÓXIMO PACIENTE\n');

    const proximo = await fazerRequisicao('GET', '/pacientes/proximo');

    // 5. CHAMAR PACIENTES
    console.log('5️⃣  CHAMANDO PACIENTES\n');

    // Chamar o próximo
    await fazerRequisicao('POST', '/recepcao/chamar-proximo');

    // Chamar um específico
    await fazerRequisicao('POST', `/recepcao/chamar/${numeroSenha2}`);

    // 6. INICIAR ATENDIMENTO
    console.log('6️⃣  INICIANDO ATENDIMENTO\n');

    await fazerRequisicao('POST', `/recepcao/iniciar/${numeroSenha1}`, {
        local_atendimento: 'Sala de Recepção',
        profissional: 'Ana Silva',
        descricao: 'Preenchimento de ficha'
    });

    // 7. VERIFICAR STATUS APÓS CHAMADA
    console.log('7️⃣  VERIFICANDO STATUS APÓS CHAMADA\n');

    await fazerRequisicao('GET', `/pacientes/status/${numeroSenha1}`);
    await fazerRequisicao('GET', `/pacientes/fila`);

    // 8. FINALIZAR ATENDIMENTO
    console.log('8️⃣  FINALIZANDO ATENDIMENTO\n');

    await fazerRequisicao('POST', `/recepcao/finalizar/${numeroSenha1}`);

    // 9. HISTORICO
    console.log('9️⃣  OBTENDO HISTÓRICO DE CHAMADAS\n');

    await fazerRequisicao('GET', '/recepcao/historico?limite=10');

    // 10. ESTATÍSTICAS
    console.log('🔟 OBTENDO ESTATÍSTICAS\n');

    await fazerRequisicao('GET', '/recepcao/estatisticas');

    // 11. VERIFICAR FILA ATUALIZADA
    console.log('1️⃣1️⃣  FILA APÓS PRIMEIRO ATENDIMENTO\n');

    await fazerRequisicao('GET', '/pacientes/fila');

    console.log('='.repeat(50));
    console.log('✅ TESTES CONCLUÍDOS!');
}

// ================================================
// EXECUTAR TESTES (para Node.js)
// ================================================

// Verificar se está em ambiente Node.js
if (typeof window === 'undefined') {
    // Node.js - usar fetch do node-fetch ou built-in
    executarTestes().catch(console.error);
} else {
    // Navegador - executar direto
    executarTestes();
}

// ================================================
// TESTES MANUAIS (para copiar e colar)
// ================================================

/*

// No console do navegador ou Node.js REPL:

// 1. Emitir senha
fetch('http://localhost:3000/api/pacientes/emitir-senha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: 'Teste', cpf: '99999999999' })
})
.then(r => r.json())
.then(d => console.log(d));

// 2. Ver fila
fetch('http://localhost:3000/api/pacientes/fila')
    .then(r => r.json())
    .then(d => console.log(d));

// 3. Chamar próximo
fetch('http://localhost:3000/api/recepcao/chamar-proximo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => console.log(d));

// 4. Estatísticas
fetch('http://localhost:3000/api/recepcao/estatisticas')
    .then(r => r.json())
    .then(d => console.log(d));

*/

// ================================================
// SCRIPT PARA POPULAR DADOS
// ================================================

async function popularDados() {
    console.log('📦 Populando dados de teste...\n');

    const pacientes = [
        { nome: 'Alice Johnson', cpf: '11111111111', telefone: '11911111111' },
        { nome: 'Bob Smith', cpf: '22222222222', telefone: '11922222222' },
        { nome: 'Carol White', cpf: '33333333333', telefone: '11933333333' },
        { nome: 'David Brown', cpf: '44444444444', telefone: '11944444444' },
        { nome: 'Eve Davis', cpf: '55555555555', telefone: '11955555555' }
    ];

    for (const paciente of pacientes) {
        await fazerRequisicao('POST', '/pacientes/emitir-senha', paciente);
        // Pequeno delay para não sobrecarregar
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n✅ Dados populados com sucesso!');
}

// Para executar: popularDados()

module.exports = {
    fazerRequisicao,
    executarTestes,
    popularDados
};
