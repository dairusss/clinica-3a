# ⚡ IMPLANTAÇÃO RÁPIDA (30 minutos)

## RESUMO EXECUTIVO
Este é um sistema de fila para clínicas. Um computador funciona como servidor, e qualquer navegador acessa via http://localhost:3000.

---

## 📦 REQUISITOS MÍNIMOS

- [ ] **1 Computador** (qualquer um, até notebook velho)
  - Windows 10/11 OU Linux OU Mac
  - 4GB RAM
  - 50GB disco

- [ ] **Acesso a Internet** (para baixar programas)

- [ ] **Router WiFi** (para conectar outros computadores)

---

## 🚀 INSTALAÇÃO PASSO A PASSO

### PASSO 1: Instalar Node.js (5 min)

**Windows:**
1. Baixar: https://nodejs.org/
2. Executar instalador
3. Seguir padrão (next, next, finish)

**Linux (Ubuntu):**
```bash
sudo apt update && sudo apt install nodejs npm
```

### PASSO 2: Instalar PostgreSQL (5 min)

**Windows:**
1. Baixar: https://www.postgresql.org/download/windows/
2. Executar instalador
3. **Anotar a senha do usuário "postgres"** (você vai precisar)
4. Deixar porta padrão: 5432

**Linux (Ubuntu):**
```bash
sudo apt install postgresql postgresql-contrib
```

### PASSO 3: Copiar os Arquivos (2 min)

```bash
# Copiar pasta "Clinica" para: C:\clinica (Windows)
# Ou: /home/user/clinica (Linux)

cd C:\clinica    # Windows
# ou
cd ~/clinica     # Linux
```

### PASSO 4: Editar Arquivo .env (2 min)

Abrir arquivo `.env` e editar:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123        # ← Sua senha do PostgreSQL
DB_NAME=clinica

PORT=3000
NODE_ENV=production
```

Salvar e fechar.

### PASSO 5: Instalar Dependências (3 min)

```bash
npm install
```

### PASSO 6: Criar Banco de Dados (2 min)

```bash
npm run db:init
```

Deve aparecer:
```
✓ Schema criado com sucesso
✓ 5 pacientes adicionados
✅ Banco de dados inicializado com sucesso!
```

### PASSO 7: Iniciar Sistema (1 min)

```bash
npm run dev
```

Deve aparecer:
```
✓ Conectado ao PostgreSQL
✓ Servidor rodando na porta 3000
✓ Acesse: http://localhost:3000
```

---

## 📱 TESTANDO

### No Computador Servidor:
1. Abrir navegador (Chrome/Firefox)
2. Digitar: **http://localhost:3000**
3. Deve aparecer JSON com mensagem "Sistema de Clínica - API"

### Em Outro Computador (na clínica):
1. Abrir navegador
2. Digitar: **http://<IP_DO_SERVIDOR>:3000**
   - Exemplo: http://192.168.1.100:3000

Para descobrir IP do servidor:
```bash
# Windows
ipconfig
# Procure por "Endereço IPv4" (algo como 192.168.x.x)

# Linux
ifconfig
# Procure por "inet" na interface WiFi
```

---

## 🖥️ INTERFACE PARA RECEPCIONISTA

### Opção 1: Emitir Senha
```
URL: http://localhost:3000/api/pacientes/emitir-senha
Método: POST
Dados:
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "11987654321"
}
```

### Opção 2: Usar Terminal ou Postman
Teste via `http://localhost:3000/docs` (documentação interativa)

---

## 📺 PAINEL ELETRÔNICO

### Usar arquivo `painel-eletronico.html`:

1. Abrir arquivo em navegador
2. Conecta automaticamente ao sistema
3. Mostra: Atendendo agora, Próximo, Fila
4. Atualiza a cada 2 segundos

### Colocar em Monitor Grande:
1. Conectar monitor ao servidor
2. Abrir `painel-eletronico.html`
3. Pronto! Fica exibindo fila

---

## ⚙️ PARA USAR NA CLÍNICA

### 1. RECEPCIONISTA
```
1. Abre: http://localhost:3000/docs
2. Clica em: POST /api/pacientes/emitir-senha
3. Preenche: nome, cpf, telefone
4. Clica "Try it out"
5. Pega número retornado
6. Entrega ao paciente
```

### 2. MONITOR
```
1. Tela grande exibindo: painel-eletronico.html
2. Mostra número sendo chamado
3. Paciente vê e vai ao consultório
```

### 3. CONSULTÓRIO
```
1. Médico abre: http://localhost:3000/docs
2. Clica em: POST /api/recepcao/iniciar/{numeroSenha}
3. Preenche: local_atendimento, profissional
4. Consulta paciente
5. Clica em: POST /api/recepcao/finalizar/{numeroSenha}
6. Próximo paciente é chamado
```

---

## 🔒 SEGURANÇA BÁSICA

### Windows Defender:
```
1. Windows Defender → Firewall
2. Permitir app pelo firewall
3. Selecionar node.exe
4. OK
```

### Bloquear Acesso Externo:
```
1. Abrir Prompt de Comando (Admin)
2. Executar:
netsh advfirewall firewall add rule name="Clinica Block" dir=in action=block protocol=tcp localport=3000
3. Isso bloqueia acesso de fora da clínica
```

---

## 🐛 TROUBLESHOOTING

### "Porta 3000 já em uso"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Linux
lsof -i :3000
kill <PID>
```

### "Não conecta no banco"
```bash
# Verificar se PostgreSQL está rodando
# Windows: Services → postgresql deve estar "Running"
# Linux: sudo systemctl status postgresql
```

### "Erro de conexão no outro computador"
```
1. Verificar firewall (permitir porta 3000)
2. Verificar IP correto do servidor
3. Ambos devem estar na mesma rede WiFi
```

### "Página branca no painel eletrônico"
```
1. F12 (abrir console)
2. Ver se há erro de conexão
3. Verificar URL do servidor está correta
```

---

## 📊 PROXIMOS PASSOS OPCIONAIS

Depois de tudo funcionando:

1. **Criar interface de recepção** (em vez de digitar JSON)
2. **App mobile** para pacientes
3. **Relatórios** de atendimentos
4. **Backup automático**
5. **Colocar em nuvem** para acessar de qualquer lugar

---

## 📞 CHECKLIST DE IMPLANTAÇÃO

- [ ] Node.js instalado
- [ ] PostgreSQL instalado
- [ ] Arquivos copiados
- [ ] .env configurado
- [ ] `npm install` executado
- [ ] `npm run db:init` funcionou
- [ ] `npm run dev` iniciou
- [ ] Acesso local funciona (localhost:3000)
- [ ] Outro computador acessa (192.168.x.x:3000)
- [ ] Painel eletrônico carrega
- [ ] Recepcionista consegue emitir senha
- [ ] Médico consegue iniciar/finalizar

---

## 🎉 PRONTO!

Seu sistema de fila está funcionando!

**Para manter rodando:**
```bash
# Windows: Criar arquivo .bat
# Conteúdo:
@echo off
cd C:\clinica
npm run dev

# Clicar 2x e pronto!
```

```bash
# Linux: Usar PM2
npm install -g pm2
pm2 start npm --name "clinica" -- run dev
pm2 startup
pm2 save
```

---

**Sucesso na implantação! 🚀**
