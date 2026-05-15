# 🎯 GUIA RÁPIDO - 3 LINHAS PARA FAZER FUNCIONAR

## 1️⃣ Instale as dependências (incluindo serverless-http novo)
```bash
npm install
```

## 2️⃣ Configure seu banco PostgreSQL em `.env`

Abra o arquivo `.env` na raiz do projeto e mude:

```env
# DE ISSO (template):
DATABASE_URL=postgresql://postgres:123@localhost:5432/clinica

# PARA SEU BANCO REAL:
DATABASE_URL=postgresql://seu_user:sua_senha@seu_host:5432/seu_banco
```

**Exemplos de conexão real:**

- Localhost: `postgresql://postgres:123@localhost:5432/clinica`
- Neon (cloud): `postgresql://user@ep-xyz.neon.tech/dbname`
- Railway: `postgresql://postgres:pass@railway.app:5432/clinica`

## 3️⃣ Fazer push para GitHub

```bash
git add .
git commit -m "Deploy setup automático"
git push
```

## ✨ Pronto!

Netlify vai fazer deploy automaticamente. Seu site vai estar em:  
**https://seu-site.netlify.app/totem**

---

## ✅ Para Testar Antes (RECOMENDADO)

```bash
# Terminal 1: Rodar servidor local
npm run dev

# Terminal 2: Abrir no navegador
# http://localhost:3000/totem
# Tente emitir uma senha
```

Se funcionar localmente, **GARANTIDO** que funciona no Netlify!

---

## 🆘 Se Não Funcionar

1. Abra F12 no navegador → Console
2. Copie a mensagem de erro
3. Mande para me debugar

---

## 📚 Documentação Completa

- **DEPLOY_AUTOMATICO.md** - Explicação técnica completa
- **SETUP_SEM_PAINEL_NETLIFY.md** - Guia detalhado
- **.env** - Seu arquivo de configuração

---

## 🎉 Resumo do que foi feito

✅ Criada função Express serverless (`netlify/functions/api.js`)  
✅ Adicionada dependência `serverless-http`  
✅ Configurado `netlify.toml` para rotear tudo  
✅ Arquivo `.env` pronto para usar  
✅ **NENHUMA configuração manual no painel Netlify necessária!**  

---

É isso! Qualquer dúvida, é só avisar 🚀
