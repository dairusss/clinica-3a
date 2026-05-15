# 📋 GUIA COMPLETO DE IMPLANTAÇÃO NA CLÍNICA

## 📱 FASE 1: PLANEJAMENTO (1-2 semanas)

### 1.1 - Reunião com Gerência
- [ ] Definir quais consultórios participam
- [ ] Escolher pessoa para gerenciar sistema
- [ ] Definir horários de funcionamento
- [ ] Backup de dados atuais

### 1.2 - Hardware Necessário

#### **Opção 1: Infraestrutura Pequena (Até 3 consultórios)**
```
✓ 1 Servidor (pode ser um notebook velho)
  • Windows/Linux/Mac
  • 4GB RAM mínimo
  • 50GB disco
  • Ligado 24h (ou só durante expediente)

✓ 1 Computador Recepção
  • Navegador Chrome/Firefox
  • Acesso ao servidor

✓ 1 Monitor grande (55" recomendado)
  • Conectado ao servidor
  • Para exibir fila

✓ 1 Impressora (térmica recomendada)
  • Para imprimir senhas
```

#### **Opção 2: Infraestrutura Média (4+ consultórios)**
```
✓ 1 Servidor dedicado (não é notebook)
  • Windows Server OU Linux
  • 8GB RAM
  • 200GB SSD
  • Fonte ininterrupta (UPS)

✓ Computadores em cada consultório
  • Acesso ao sistema

✓ 2 Monitores grandes
  • Recepção + área de espera

✓ Roteador WiFi
  • Para consultórios conectarem sem fio

✓ Backup externo
  • Disco rígido externo 1TB
```

#### **Opção 3: Nuvem (Escalável)**
```
✓ Contratar Azure/AWS/DigitalOcean
  • $10-50/mês
  • Sem preocupação com servidor
  • Acesso de qualquer lugar
  • Backup automático
```

---

## 🖥️ FASE 2: INSTALAÇÃO DO SERVIDOR (1 dia)

### 2.1 - Escolher o Servidor

#### **Se usar Windows:**
```powershell
# 1. Baixar Node.js
https://nodejs.org/

# 2. Instalar Node.js
# Executar instalador e deixar padrão

# 3. Verificar instalação
node --version
npm --version
```

#### **Se usar Linux (Recomendado):**
```bash
# 1. Ubuntu 22.04 LTS (grátis)
sudo apt update
sudo apt install nodejs npm

# 2. PostgreSQL
sudo apt install postgresql postgresql-contrib

# 3. Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2.2 - Clonar o Projeto
```bash
# Crie uma pasta
mkdir /clinica
cd /clinica

# Clone o projeto (ou copie os arquivos)
# Se tiver Git:
git clone <seu-repositorio>

# Senão, copie manualmente
```

### 2.3 - Instalar Dependências
```bash
cd /clinica
npm install
```

### 2.4 - Configurar Banco de Dados
```bash
# Criar usuário e banco
createuser clinica_user
createdb clinica -O clinica_user

# Ou via psql
psql -U postgres
CREATE USER clinica_user WITH PASSWORD 'senha_super_segura';
CREATE DATABASE clinica OWNER clinica_user;
GRANT ALL PRIVILEGES ON DATABASE clinica TO clinica_user;
\q
```

### 2.5 - Editar .env
```bash
nano .env
# Ou abrir com editor de texto

# Configurar:
DB_HOST=localhost
DB_PORT=5432
DB_USER=clinica_user
DB_PASSWORD=senha_super_segura
DB_NAME=clinica
PORT=3000
NODE_ENV=production
```

### 2.6 - Inicializar Banco
```bash
npm run db:init
```

---

## 🚀 FASE 3: COLOCAR EM PRODUÇÃO

### Opção A: Usar PM2 (Gerenciador de Processos)

```bash
# 1. Instalar PM2 globalmente
npm install -g pm2

# 2. Iniciar aplicação
pm2 start src/server.js --name "clinica-sistema"

# 3. Fazer iniciar automaticamente ao ligar PC
pm2 startup
pm2 save

# 4. Monitorar
pm2 logs clinica-sistema
pm2 status
```

### Opção B: Usar Docker (Mais profissional)

```dockerfile
# Criar arquivo: Dockerfile

FROM node:18-alpine

WORKDIR /clinica

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

```bash
# Construir imagem
docker build -t clinica-app .

# Rodar container
docker run -d -p 3000:3000 --name clinica clinica-app
```

### Opção C: Serviço Windows (Mais simples)

```powershell
# Instalar NSSM (Non-Sucking Service Manager)
# Baixar: https://nssm.cc/download

# Colocar em C:\Program Files\nssm

# Abrir PowerShell como admin:
cd "C:\Program Files\nssm\win64"
.\nssm install ClínicaSistema "C:\Node\node.exe" "C:\clinica\src\server.js"
.\nssm start ClínicaSistema

# Verificar se está rodando:
Get-Service ClínicaSistema
```

---

## 🔒 FASE 4: SEGURANÇA

### 4.1 - Firewall
```
✓ Bloquear acesso externo à porta 3000
✓ Abrir apenas dentro da clínica (rede local)
✓ Se usar nuvem: abrir só para IP da clínica
```

### 4.2 - Senhas
```
✓ Banco de dados: senha forte
✓ Servidor: usuário admin com senha
✓ .env nunca compartilhar
✓ Não colocar em GitHub público
```

### 4.3 - Certificado SSL (HTTPS)
```bash
# Se for expor na internet:
npm install express-letsencrypt

# Ou usar nginx como proxy reverso
```

### 4.4 - Backup Automático
```bash
# Script backup PostgreSQL (executar diariamente)

#!/bin/bash
DATA=$(date +%Y%m%d_%H%M%S)
pg_dump -U clinica_user clinica > /backup/clinica_$DATA.sql

# Agendar com cron (Linux):
0 22 * * * /clinica/backup.sh
```

---

## 📊 FASE 5: TESTES ANTES DE ATIVAR

### 5.1 - Testes Funcionais
```bash
# Terminal 1: Verificar servidor
curl http://localhost:3000
# Deve retornar: {"message": "Sistema de Clínica - API", ...}

# Terminal 2: Testar emitir senha
curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Silva",
    "cpf": "12345678901",
    "telefone": "11987654321"
  }'

# Deve retornar senha com número

# Terminal 3: Ver fila
curl http://localhost:3000/api/pacientes/fila

# Terminal 4: Chamar próximo
curl -X POST http://localhost:3000/api/recepcao/chamar-proximo
```

### 5.2 - Teste com Pessoas
```
1. Tester emite 5 senhas
2. Ver número no monitor
3. Chamar próximo
4. Iniciar atendimento
5. Finalizar
6. Próximo chamado automaticamente

✓ Tudo funcionando? Liberar!
```

### 5.3 - Teste de Carga
```bash
# Simular 100 senhas emitidas
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/pacientes/emitir-senha \
    -H "Content-Type: application/json" \
    -d "{\"nome\": \"Paciente $i\", \"cpf\": \"${i:0:11}\"}"
done
```

---

## 👥 FASE 6: TREINAMENTO DE PESSOAL

### 6.1 - Treinamento Recepcionista (30 min)
```
1. Abrir navegador → localhost:3000
2. Clicar em "Emitir Senha"
3. Preencher dados paciente
4. Clicar "Gerar Senha"
5. Imprimir comprovante
6. Entregar ao paciente

PRONTO! Resto é automático
```

### 6.2 - Treinamento Médico/Dentista (15 min)
```
1. Abrir navegador → localhost:3000/docs
2. Esperar paciente chegar
3. Clicar "Iniciar Atendimento"
4. Consultar/Tratar
5. Clicar "Finalizar"

PRONTO! Próximo paciente chamado
```

### 6.3 - Treinamento Gerência (1h)
```
1. Ver dashboard: localhost:3000/docs
2. Relatórios: /api/recepcao/estatisticas
3. Consultar histórico: /api/recepcao/historico
4. Fazer backup manual
5. Troubleshooting básico
```

---

## 📱 FASE 7: INTERFACE DO MONITOR (Painel Eletrônico)

### Criar página simples para exibir fila:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Painel Fila - Clínica</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: #fff;
            font-family: Arial;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .titulo {
            font-size: 48px;
            text-align: center;
            margin-bottom: 40px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .box {
            background: #333;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
        }
        .label {
            font-size: 24px;
            color: #aaa;
            margin-bottom: 10px;
        }
        .numero {
            font-size: 120px;
            font-weight: bold;
            color: #4CAF50;
        }
        .atendendo {
            background: #4CAF50;
        }
        .proximo {
            background: #2196F3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="titulo">CLÍNICA - PAINEL DE FILA</div>
        
        <div class="grid">
            <div class="box atendendo">
                <div class="label">ATENDENDO</div>
                <div class="numero" id="atendendo">---</div>
            </div>
            <div class="box proximo">
                <div class="label">PRÓXIMO</div>
                <div class="numero" id="proximo">---</div>
            </div>
        </div>
    </div>

    <script>
        // Atualizar a cada 2 segundos
        setInterval(async () => {
            try {
                const res = await fetch('/api/pacientes/proximo');
                const data = await res.json();
                
                document.getElementById('proximo').textContent = 
                    data.data?.numero_senha || '---';
                    
                // Atendendo (você pode adicionar via API)
                document.getElementById('atendendo').textContent = '0041';
                
            } catch (e) {
                console.error('Erro:', e);
            }
        }, 2000);
    </script>
</body>
</html>
```

---

## 🔧 FASE 8: MANUTENÇÃO

### 8.1 - Diário
- [ ] Conferir se sistema está rodando
- [ ] Verificar se impressora tem papel

### 8.2 - Semanal
- [ ] Verificar logs de erro
- [ ] Conferir se senhas estão sendo emitidas
- [ ] Fazer backup manual

### 8.3 - Mensal
- [ ] Limpar dados antigos (senhas de 30 dias atrás)
- [ ] Gerar relatório de atendimentos
- [ ] Atualizar senhas de acesso

---

## 📞 SUPORTE E TROUBLESHOOTING

### Problema: Sistema não abre
```bash
# Verificar se está rodando
ps aux | grep node    # Linux
tasklist | find "node"  # Windows

# Se não estiver, reiniciar
pm2 start src/server.js
```

### Problema: Banco não conecta
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql  # Linux

# Testar conexão
psql -U clinica_user -d clinica

# Se password error:
# Editar .env com senha correta
```

### Problema: Senhas não imprimem
```
1. Verificar se impressora está ligada
2. Testar impressora em outro programa
3. Reiniciar impressora
4. Atualizar driver
```

### Problema: Muito lento
```
1. Verificar RAM disponível
2. Verificar disco cheio
3. Aumentar hardware
4. Ou migrar para nuvem
```

---

## 💰 CUSTOS ESTIMADOS

### Opção Barata (1-3 consultórios)
```
Hardware:     R$ 1.500 (notebook velho)
Software:     R$ 0 (open source)
Instalação:   R$ 0 (você faz)
TOTAL:        R$ 1.500
```

### Opção Média (4-10 consultórios)
```
Servidor:     R$ 3.000
Monitores:    R$ 2.000
Rede:         R$ 500
Instalação:   R$ 1.000
TOTAL:        R$ 6.500
```

### Opção Nuvem
```
Hosting:      R$ 50/mês
Domínio:      R$ 30/ano
Suporte:      R$ 0
TOTAL:        R$ 50/mês
```

---

## 📋 CHECKLIST FINAL

### Antes de Ativar
- [ ] Hardware instalado e testado
- [ ] Banco de dados funcionando
- [ ] Sistema rodando em produção (PM2/Docker)
- [ ] Backup automático configurado
- [ ] WiFi funcionando
- [ ] Monitor exibindo fila corretamente
- [ ] Impressora testada
- [ ] 3 pessoas treinadas
- [ ] Testes com 10 senhas rodados com sucesso
- [ ] Segurança configurada (firewall)

### Dia 1 de Operação
- [ ] Começar com poucos pacientes (5-10)
- [ ] Monitor de perto
- [ ] Ter técnico disponível por telefone
- [ ] Documentar problemas encontrados
- [ ] Realizar ajustes necessários

### Semana 1
- [ ] Aumentar para volume normal
- [ ] Coletar feedback de usuários
- [ ] Treinar mais pessoas se necessário
- [ ] Otimizar conforme necessário

---

## 🎓 PRÓXIMOS PASSOS

1. **Criar Interface Web** para Recepcionista
2. **Criar App Mobile** para Pacientes (consultar fila remotamente)
3. **SMS Notificações** ("Sua senha foi chamada")
4. **QR Code** na senha para rastrear
5. **Estatísticas avançadas** (tempo de espera, lotação)
6. **Integração com Prontuário Eletrônico**

---

## 📧 CONTATO PARA DÚVIDAS

Se tiver problemas:
1. Verificar este guia
2. Verificar logs: `pm2 logs clinica-sistema`
3. Testar API em: `http://localhost:3000/docs`
4. Chamar técnico

---

**SUCESSO NA IMPLANTAÇÃO! 🚀**
