# Deploy no Netlify

Este projeto foi configurado para deploy no Netlify com arquitetura serverless.

## Arquitetura

- **Frontend**: Páginas HTML servidas estaticamente
- **Backend**: APIs implementadas como Netlify Functions (serverless)
- **Banco**: PostgreSQL na nuvem

## Pré-requisitos

1. Conta no Netlify (netlify.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. Banco PostgreSQL na nuvem (Neon.tech, Supabase, ElephantSQL, etc.)

## Configuração do Banco

1. Crie uma conta em um provedor PostgreSQL na nuvem (recomendo Neon.tech por ser gratuito)
2. Crie um novo banco de dados
3. Execute o script SQL localizado em `database/schema.sql` no seu banco
4. Copie a connection string (DATABASE_URL)

## Deploy no Netlify

1. **Push para Git**:
   ```bash
   git add .
   git commit -m "Configurado para Netlify"
   git push origin main
   ```

2. **Conectar ao Netlify**:
   - Acesse netlify.com e faça login
   - Clique em "Add new site" > "Import an existing project"
   - Conecte seu repositório Git

3. **Configurar Build**:
   - Branch: `main` (ou sua branch principal)
   - Build command: `npm install` (Netlify detecta automaticamente)
   - Publish directory: `.` (raiz do projeto)

4. **Variáveis de Ambiente**:
   - Adicione `DATABASE_URL` com sua connection string PostgreSQL
   - Adicione outras variáveis se necessário (TAMANHO_SENHA, etc.)

5. **Deploy**:
   - Clique em "Deploy site"
   - Aguarde o build completar

## URLs após Deploy

Após o deploy, você terá:
- **Site principal**: `https://seusite.netlify.app`
- **API Pacientes**: `https://seusite.netlify.app/api/pacientes/emitir-senha`
- **API Recepção**: `https://seusite.netlify.app/api/recepcao/chamar-proximo`
- **Documentação API**: `https://seusite.netlify.app/docs`

## Páginas Disponíveis

- `/` - Página inicial
- `/totem` - Totem de senhas
- `/cliente-mobile` - App mobile para pacientes
- `/painel` - Painel eletrônico
- `/medico` - Interface médica

## Testando o Deploy

1. Acesse o site principal
2. Teste emitir uma senha via API ou interface
3. Verifique se o banco está funcionando

## Troubleshooting

- **Erro de conexão DB**: Verifique se DATABASE_URL está correta e o banco permite conexões externas
- **Funções não funcionam**: Verifique os logs do build no Netlify
- **SSL issues**: Adicione `?sslmode=require` na DATABASE_URL se necessário

## Custos

- Netlify: Plano gratuito inclui 100GB bandwidth/mês
- Banco PostgreSQL: Neon.tech oferece 512MB gratuito