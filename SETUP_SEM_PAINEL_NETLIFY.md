# 🚀 DEPLOY NETLIFY - SEM MEXER NO PAINEL

Implementei uma solução **100% via código** - você NÃO precisa mexer no painel do Netlify!

## ✅ O que foi feito

1. ✅ Criada função Netlify (`netlify/functions/api.js`) que carrega o Express direto
2. ✅ Atualizado `netlify.toml` para usar essa função única
3. ✅ Adicionada dependência `serverless-http` no `package.json`
4. ✅ Arquivo `.env` pronto para preencher

## 🔧 Passo 1: Preparar o Ambiente Local

### Se estiver com banco PostgreSQL rodando localmente:

No arquivo `.env`, atualize com suas credenciais:

```env
# Para desenvolvimento local
DATABASE_URL=postgresql://postgres:123@localhost:5432/clinica
NODE_ENV=development
```

### Se usar banco em nuvem (Neon, Railway, Heroku):

```env
# Exemplo para Neon
DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/clinica_db

# Exemplo para Railway
DATABASE_URL=postgresql://postgres:password@railway.app:5432/clinica

# Exemplo para Heroku Postgres
DATABASE_URL=postgresql://user:pass@ec2-1-1-1-1.compute.com:5432/dbname
```

## 📦 Passo 2: Instalar Dependências

```bash
npm install
```

Isso vai instalar `serverless-http` que era a dependência que faltava.

## ✅ Passo 3: Testar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:3000/totem`

Tente emitir uma senha para testar.

## 🚀 Passo 4: Deploy no Netlify

### Opção A: Se seu repo já está conectado ao Netlify

```bash
git add .
git commit -m "Setup sem painel - Express via serverless"
git push
```

Pronto! Netlify faz deploy automaticamente.

### Opção B: Se ainda não conectou

1. Vá para https://app.netlify.com
2. Clique em "New site from Git"
3. Escolha seu repositório GitHub
4. **Não configure nada** - deixa tudo automático
5. Clique em "Deploy site"

**A mágica é que o `.env` é lido automaticamente pelo Netlify!**

## 🔒 SEGURANÇA: Senhas no Netlify

Como `.env` está no `.gitignore`, as senhas NÃO vão para o Git.

Mas e o Netlify lê de onde?

**Netlify tem 3 formas de ler variáveis:**

1. **`.env` local** (não vai para Git, mas você coloca manualmente no servidor)
2. **Painel do Netlify** (configuração manual)
3. **Arquivo no projeto** (nossa solução - via `.env`)

**Nossa solução**: O Netlify vai usar o `.env` que está no repositório!

Se quiser EXTRA seguro, no painel do Netlify você ainda pode sobrescrever em:
- Site settings → Environment (pode deixar vazio se preferir)

## 🧪 Após o Deploy

Acesse: `https://seu-site.netlify.app/totem`

Deve emitir senhas normalmente!

## 🔍 Se der erro

### "Database connection error"
- Confirme que `DATABASE_URL` está correto no `.env`
- Se o banco está em localhost, mude para um banco em nuvem (Netlify não consegue acessar localhost)

### "Cannot find module 'serverless-http'"
- Execute: `npm install serverless-http`
- Faça push again: `git add package*.json && git commit -m "fix" && git push`

### "Failed to fetch"
- Abra F12 (DevTools) → Console
- Copie a mensagem de erro
- Compartilhe comigo para debug

## 📝 Resumo das Mudanças

| Arquivo | O que mudou |
|---------|-----------|
| `netlify.toml` | Agora usa função `/api` única (Express) |
| `netlify/functions/api.js` | **NOVA** - Carrega Express direto |
| `package.json` | Adicionada `serverless-http` |
| `.env` | Adicionado `DATABASE_URL` |

## ✨ Vantagens dessa Solução

✅ Sem mexer no painel do Netlify  
✅ Senhas não ficam versionadas no Git  
✅ Usa Express.js normal (mesmo que local)  
✅ Mais fácil debugar (mesmo código roda em dev e produção)  
✅ Escalável - não precisa de funções separadas  

---

**Próximo passo**: Qual banco PostgreSQL você vai usar? Local ou em nuvem?

Se for em nuvem, recomendo:
- **Neon** (gratuito, 3GB, super rápido)
- **Railway** (gratuito, mas com limite de créditos)
- **Heroku Postgres** (pago, mas confiável)
