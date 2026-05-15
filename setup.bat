@echo off
REM ================================================
REM SCRIPT DE INICIALIZAÇÃO PARA WINDOWS
REM Sistema de Clínica - Setup Completo
REM ================================================

setlocal enabledelayedexpansion

echo.
echo 🏥 SISTEMA DE CLINICA - Setup Automático (Windows)
echo ================================================
echo.

REM ================================================
REM 1. Verificar Node.js
REM ================================================

echo 1. Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não está instalado
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% encontrado
echo.

REM ================================================
REM 2. Verificar npm
REM ================================================

echo 2. Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não está instalado
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% encontrado
echo.

REM ================================================
REM 3. Verificar PostgreSQL
REM ================================================

echo 3. Verificando PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL não está instalado
    echo Baixe em: https://www.postgresql.org/download/
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('psql --version') do set PG_VERSION=%%i
echo ✅ %PG_VERSION% encontrado
echo.

REM ================================================
REM 4. Instalar dependências
REM ================================================

echo 4. Instalando dependências do projeto...
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✅ Dependências instaladas
echo.

REM ================================================
REM 5. Criar arquivo .env
REM ================================================

echo 5. Criando arquivo .env...

if not exist .env (
    copy .env.example .env
    echo ✅ .env criado
) else (
    echo ⚠️  .env já existe
)
echo.

REM ================================================
REM 6. Instruções para PostgreSQL
REM ================================================

echo 6. Configurando PostgreSQL...
echo.
echo Execute os seguintes comandos no PostgreSQL:
echo.
echo   psql -U postgres
echo   CREATE USER clinica_user WITH PASSWORD 'clinica123';
echo   CREATE DATABASE clinica OWNER clinica_user;
echo   \c clinica clinica_user
echo   \i SQL_COMPLETO.sql
echo.
set /p PGDONE=Já executou os comandos acima? (s/n): 
if /i "%PGDONE%"=="s" (
    echo ✅ PostgreSQL configurado
) else (
    echo ⚠️  Configure manualmente PostgreSQL
)
echo.

REM ================================================
REM RESUMO
REM ================================================

echo.
echo ================================================
echo ✅ SETUP CONCLUÍDO!
echo ================================================
echo.
echo Próximos passos:
echo 1. npm run dev    (iniciar servidor em desenvolvimento)
echo 2. npm start      (iniciar servidor em produção)
echo 3. Acesse http://localhost:3000
echo.
echo Documentação:
echo - README.md       (documentação completa)
echo - QUICKSTART.md   (guia rápido)
echo - EXEMPLOS_API.js (exemplos de requisições)
echo.
pause
