# 🚀 DEPLOYMENT E PRODUÇÃO

## ================================================
## ANTES DE FAZER DEPLOY
## ================================================

### Checklist de Produção

- [ ] Testou todas as APIs em desenvolvimento?
- [ ] Frontend está pronto?
- [ ] Backup do banco foi feito?
- [ ] Variáveis de ambiente estão configuradas?
- [ ] SSL/HTTPS está habilitado?
- [ ] Logs estão configurados?
- [ ] Rate limiting está ativo?
- [ ] CORS está configurado corretamente?

---

## ================================================
## OPÇÃO 1: HEROKU
## ================================================

### Pré-requisitos
- Conta Heroku (https://www.heroku.com)
- Heroku CLI instalado

### Passos

1. Login no Heroku
```bash
heroku login
```

2. Criar app no Heroku
```bash
heroku create seu-nome-clinica
```

3. Adicionar PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. Configurar variáveis de ambiente
```bash
heroku config:set DB_HOST=seu-database-host
heroku config:set DB_USER=seu-usuario
heroku config:set DB_PASSWORD=sua-senha
heroku config:set DB_NAME=clinica
heroku config:set NODE_ENV=production
```

5. Deploy via Git
```bash
git add .
git commit -m "Deploy para produção"
git push heroku main
```

6. Verificar logs
```bash
heroku logs --tail
```

### Custo: A partir de $7/mês

---

## ================================================
## OPÇÃO 2: AWS (EC2 + RDS)
## ================================================

### Criar servidor EC2 (Ubuntu)

1. Criar instância EC2
   - AMI: Ubuntu 20.04 LTS
   - Instance Type: t3.micro (free tier)
   - Security Group: Abrir portas 22, 80, 443, 3000

2. SSH na máquina
```bash
ssh -i seu-key.pem ubuntu@seu-ip
```

3. Instalar dependências
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql-client

# Verificar instalação
node --version
npm --version
```

4. Clonar código
```bash
git clone seu-repositorio
cd Clinica
npm install
```

5. Criar arquivo .env
```bash
nano .env
# Configure seu DATABASE_URL do RDS
```

6. Iniciar servidor
```bash
npm start
```

### Criar RDS PostgreSQL

1. Console AWS → RDS → Create Database
2. PostgreSQL → Free tier
3. Configurar:
   - DB Instance Identifier: clinica-db
   - Master username: admin
   - Password: sua-senha-forte
   
4. Aguardar criação (5-10 min)

5. Notar Endpoint (ex: clinica-db.xxxx.us-east-1.rds.amazonaws.com)

6. Conectar via psql
```bash
psql -h clinica-db.xxxx.us-east-1.rds.amazonaws.com -U admin -d clinica
# Colar SQL_COMPLETO.sql
```

7. Usar URL no backend
```env
DB_HOST=clinica-db.xxxx.us-east-1.rds.amazonaws.com
```

### Custo: $0-10/mês (free tier)

---

## ================================================
## OPÇÃO 3: AZURE APP SERVICE + AZURE DATABASE
## ================================================

### Criar App Service

1. Azure Portal → App Services → Create
2. Configurar:
   - Resource Group: novo
   - Name: seu-nome-clinica
   - Publish: Code
   - Runtime stack: Node 18 LTS
   - OS: Linux

3. Deploy via GitHub
```bash
# Vincular repositório GitHub
# Azure faz deploy automático
```

### Criar Azure Database for PostgreSQL

1. Portal → Database for PostgreSQL → Create
2. Configurar:
   - Server name: clinica-server
   - Admin username: admin
   - Password: forte

3. Executar schema
```bash
psql -h clinica-server.postgres.database.azure.com -U admin@clinica-server -d clinica
# Colar SQL_COMPLETO.sql
```

4. Configurar variáveis de ambiente
```bash
# App Service → Configuration → Application settings
DB_HOST=clinica-server.postgres.database.azure.com
DB_USER=admin@clinica-server
DB_PASSWORD=sua-senha
```

### Custo: $0-50/mês

---

## ================================================
## OPÇÃO 4: DOCKER + VPS
## ================================================

### Criar Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Criar docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_USER: clinica_user
      DB_PASSWORD: clinica123
      DB_NAME: clinica
    depends_on:
      - postgres

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: clinica_user
      POSTGRES_PASSWORD: clinica123
      POSTGRES_DB: clinica
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  postgres_data:
```

### Build e Run

```bash
docker-compose up
```

### Deploy em VPS (Linode, DigitalOcean, AWS)

1. Criar VPS Ubuntu 20.04
2. Instalar Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

3. Clonar repo e executar
```bash
git clone seu-repo
cd Clinica
docker-compose up -d
```

4. Usar nginx como proxy reverso
```bash
# /etc/nginx/sites-available/default
upstream clinica_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://clinica_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Instalar SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

### Custo: $5-10/mês

---

## ================================================
## OTIMIZAÇÕES PARA PRODUÇÃO
## ================================================

### 1. Variáveis de Ambiente

Criar arquivo `.env.production`
```env
NODE_ENV=production
DEBUG=false
PORT=3000
DB_HOST=seu-host-production
DB_USER=seu-usuario-production
DB_PASSWORD=sua-senha-forte
```

### 2. Compressão de Respostas

Adicionar no `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

Adicionar no `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requisições por windowMs
});

app.use('/api/', limiter);
```

### 4. Logs em Produção

```bash
npm install winston
```

Criar `src/config/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
```

### 5. Health Checks

```javascript
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date(),
        uptime: process.uptime()
    });
});
```

### 6. Monitoramento

Integrar com Sentry:
```bash
npm install @sentry/node
```

---

## ================================================
## BACKUP E RECUPERAÇÃO
## ================================================

### Backup Automático (cron)

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/clinica_$DATE.sql"

pg_dump -U clinica_user -d clinica -f $BACKUP_FILE

# Comprimir
gzip $BACKUP_FILE

# Upload para S3 (opcional)
# aws s3 cp $BACKUP_FILE.gz s3://seu-bucket/backups/
```

Adicionar ao crontab:
```bash
crontab -e

# Rodar backup diariamente às 2 AM
0 2 * * * /root/backup.sh
```

### Restaurar Backup

```bash
gunzip clinica_20240508.sql.gz
psql -U clinica_user -d clinica -f clinica_20240508.sql
```

---

## ================================================
## MONITORAMENTO E ALERTAS
## ================================================

### Status do Servidor

```bash
# Instalar PM2 para gerenciar processo
npm install -g pm2

# Iniciar com PM2
pm2 start src/server.js --name clinica

# Logs em tempo real
pm2 logs clinica

# Dashboard
pm2 monit

# Salvar configuração
pm2 save
```

### Alertas com New Relic

```bash
npm install newrelic
```

### Monitoramento com Datadog

```bash
npm install dd-trace
```

---

## ================================================
## CHECKLIST DE DEPLOY
## ================================================

### Antes do Deploy
- [ ] Todas as dependências instaladas?
- [ ] Variáveis de ambiente configuradas?
- [ ] Banco de dados criado?
- [ ] Migrations/schema executado?
- [ ] Testes passando?
- [ ] Build testado localmente?
- [ ] SSL/TLS configurado?

### Durante o Deploy
- [ ] Backup do banco feito?
- [ ] Processo deployado com sucesso?
- [ ] Saúde da aplicação OK?
- [ ] Logs mostrando sem erros?
- [ ] Endpoints respondendo?

### Depois do Deploy
- [ ] Testar endpoints principais?
- [ ] Verificar logs para erros?
- [ ] Performance OK?
- [ ] Backup está funcionando?
- [ ] Monitoramento ativo?

---

## ================================================
## SEGURANÇA
## ================================================

### 1. HTTPS/SSL
- Use certificado SSL válido
- Redirecionar HTTP → HTTPS

### 2. Senhas
- Usar senhas fortes para BD
- Nunca comitar .env
- Usar secrets manager (AWS Secrets, Azure Key Vault)

### 3. CORS
```javascript
const cors = require('cors');
app.use(cors({
    origin: 'https://seu-dominio.com',
    credentials: true
}));
```

### 4. Headers de Segurança
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 5. Validação de Input
- Sempre validar entrada do usuário
- Usar express-validator
- Prepared statements (já faz isso com pg)

---

## ================================================
## TROUBLESHOOTING DE PRODUÇÃO
## ================================================

### Aplicação lenta
1. Verificar logs
2. Monitorar CPU/RAM
3. Otimizar queries
4. Adicionar índices no BD

### BD caiu
1. Verificar status
2. Restaurar backup
3. Verificar espaço em disco

### Erro 500
1. Verificar logs
2. Reiniciar aplicação
3. Ligar monitoramento

### Muitas requisições
1. Aumentar rate limiting
2. Escalar horizontalmente
3. Usar cache

---

## ================================================
## PRÓXIMOS PASSOS
## ================================================

1. Escolher plataforma de deployment
2. Configurar domínio e DNS
3. Instalar SSL
4. Fazer deploy
5. Testar em produção
6. Ativar monitoramento
7. Configurar backups
8. Documentar processo

---

Boa sorte com o deploy! 🚀
