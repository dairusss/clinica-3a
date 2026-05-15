#!/bin/bash

# ================================================
# SCRIPT DE INICIALIZAÇÃO AUTOMÁTICA
# Sistema de Clínica - Setup Completo
# ================================================

echo "🏥 SISTEMA DE CLÍNICA - Setup Automático"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ================================================
# 1. Verificar Node.js
# ================================================

echo -e "${YELLOW}1. Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado${NC}"
    echo "Baixe em: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"

# ================================================
# 2. Verificar npm
# ================================================

echo ""
echo -e "${YELLOW}2. Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) encontrado${NC}"

# ================================================
# 3. Verificar PostgreSQL
# ================================================

echo ""
echo -e "${YELLOW}3. Verificando PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL não está instalado${NC}"
    echo "Baixe em: https://www.postgresql.org/download/"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL encontrado${NC}"

# ================================================
# 4. Instalar dependências
# ================================================

echo ""
echo -e "${YELLOW}4. Instalando dependências do projeto...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# ================================================
# 5. Criar arquivo .env
# ================================================

echo ""
echo -e "${YELLOW}5. Criando arquivo .env...${NC}"

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env criado${NC}"
else
    echo -e "${YELLOW}⚠️  .env já existe${NC}"
fi

# ================================================
# 6. Configurar PostgreSQL
# ================================================

echo ""
echo -e "${YELLOW}6. Configurando PostgreSQL...${NC}"
echo "Execute os seguintes comandos no PostgreSQL:"
echo ""
echo "  psql -U postgres"
echo "  CREATE USER clinica_user WITH PASSWORD 'clinica123';"
echo "  CREATE DATABASE clinica OWNER clinica_user;"
echo "  \\c clinica clinica_user"
echo "  \\i SQL_COMPLETO.sql"
echo ""
read -p "Já executou os comandos acima? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${GREEN}✅ PostgreSQL configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Configure manualmente PostgreSQL${NC}"
fi

# ================================================
# 7. Testar conexão
# ================================================

echo ""
echo -e "${YELLOW}7. Testando conexão com banco...${NC}"
npm start &
PID=$!
sleep 3
kill $PID 2>/dev/null

# ================================================
# RESUMO
# ================================================

echo ""
echo "========================================"
echo -e "${GREEN}✅ SETUP CONCLUÍDO!${NC}"
echo "========================================"
echo ""
echo "Próximos passos:"
echo "1. npm run dev    (iniciar servidor)"
echo "2. Acesse http://localhost:3000"
echo ""
echo "Documentação:"
echo "- README.md (documentação completa)"
echo "- QUICKSTART.md (guia rápido)"
echo ""
