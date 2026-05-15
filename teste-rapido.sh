#!/bin/bash

# 🧪 TESTE RÁPIDO - Sistema de Clínica
# Script para validar que tudo está funcionando

echo "============================================"
echo "🧪 TESTE DO SISTEMA DE CLÍNICA"
echo "============================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo "🔍 Testando: $description"
    echo "   URL: http://localhost:3000$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -X GET "http://localhost:3000$endpoint" -H "Content-Type: application/json")
    else
        response=$(curl -s -X POST "http://localhost:3000$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if echo "$response" | grep -q "success\|status\|message"; then
        echo -e "   ✅ ${GREEN}OK${NC}"
        echo "   Resposta: ${response:0:100}..."
    else
        echo -e "   ❌ ${RED}ERRO${NC}"
        echo "   Resposta: $response"
    fi
    echo ""
}

# Aguardar servidor
echo "⏳ Aguardando servidor iniciar..."
echo "Verifique se npm run dev está rodando"
echo ""

# Teste de conexão
echo "📡 Teste 1: Health Check"
if curl -s http://localhost:3000/health | grep -q "OK"; then
    echo -e "✅ ${GREEN}Servidor respondendo${NC}"
else
    echo -e "❌ ${RED}Servidor não está respondendo${NC}"
    echo "Execute: npm run dev"
    exit 1
fi
echo ""

# Teste de acesso às interfaces
echo "🖥️ Teste 2: Interfaces Disponíveis"
echo ""

echo "Verificando totem.html..."
if curl -s http://localhost:3000/totem | grep -q "EMITIR SENHA"; then
    echo -e "✅ ${GREEN}Totem acessível${NC}"
else
    echo -e "❌ ${RED}Totem não encontrado${NC}"
fi

echo "Verificando cliente-mobile.html..."
if curl -s http://localhost:3000/cliente-mobile | grep -q "Acompanhe sua Fila"; then
    echo -e "✅ ${GREEN}Cliente mobile acessível${NC}"
else
    echo -e "❌ ${RED}Cliente mobile não encontrado${NC}"
fi

echo "Verificando painel-eletronico.html..."
if curl -s http://localhost:3000/painel | grep -q "painel"; then
    echo -e "✅ ${GREEN}Painel acessível${NC}"
else
    echo -e "❌ ${RED}Painel não encontrado${NC}"
fi

echo "Verificando documentação..."
if curl -s http://localhost:3000/docs | grep -q "swagger"; then
    echo -e "✅ ${GREEN}Documentação acessível${NC}"
else
    echo -e "❌ ${RED}Documentação não encontrada${NC}"
fi
echo ""

# Teste de API
echo "🔌 Teste 3: Endpoints da API"
echo ""

# Teste emitir senha
test_endpoint "POST" "/api/pacientes/emitir-senha" \
    '{
        "nome": "Teste Sistema",
        "cpf": "12345678901",
        "telefone": "11999999999",
        "prioridade": 0
    }' \
    "Emitir Senha"

# Teste obter fila
test_endpoint "GET" "/api/pacientes/fila" "" "Obter Fila"

# Teste obter próximo
test_endpoint "GET" "/api/pacientes/proximo" "" "Obter Próximo"

echo ""
echo "============================================"
echo "✅ TESTES CONCLUÍDOS!"
echo "============================================"
echo ""
echo "📝 Próximos passos:"
echo "1. Abrir: http://localhost:3000/totem"
echo "2. Emitir uma senha de teste"
echo "3. Escanear QR Code com celular"
echo "4. Acompanhar fila em: http://localhost:3000/cliente-mobile"
echo "5. Chamar paciente em: http://localhost:3000/docs"
echo ""
echo "Para mais informações, veja:"
echo "  - GUIA_RAPIDO.md"
echo "  - VERIFICACAO_FLUXOGRAMA.md"
echo "  - RESUMO_IMPLEMENTACAO.md"
echo ""
