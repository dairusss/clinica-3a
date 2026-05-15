# 📚 ÍNDICE DE DOCUMENTAÇÃO - SISTEMA DE CLÍNICA

## 🎯 COMECE AQUI

Se você está implantando o sistema, siga nesta ordem:

### 1️⃣ **[IMPLANTACAO_RAPIDA.md](IMPLANTACAO_RAPIDA.md)** ⭐ COMECE AQUI
- ✅ Passo a passo simplificado (30 minutos)
- ✅ Instalação básica
- ✅ Teste rápido
- ✅ Troubleshooting comum

### 2️⃣ **[GUIA_IMPLANTACAO_CLINICA.md](GUIA_IMPLANTACAO_CLINICA.md)**
- ✅ Planejamento detalhado
- ✅ Hardware necessário
- ✅ Segurança e backup
- ✅ Treinamento de pessoal
- ✅ Custos estimados
- ✅ Manutenção pós-implantação

### 3️⃣ **[EXEMPLOS_USO_API.md](EXEMPLOS_USO_API.md)**
- ✅ Como usar cada endpoint
- ✅ Exemplos com cURL
- ✅ Exemplos com JavaScript
- ✅ Cenários completos
- ✅ Testes com Postman

### 4️⃣ **[USAR_NUVEM_OU_DATABASE.md](USAR_NUVEM_OU_DATABASE.md)** ☁️ NOVO
- ✅ Usar servidor na nuvem (em vez de PC local)
- ✅ Opções: Heroku, Azure, DigitalOcean
- ✅ Passo a passo para cada serviço
- ✅ Comparação de custos
- ✅ Migração de local para nuvem

### 5️⃣ **[COMPARATIVO_OPCOES_SERVIDOR.md](COMPARATIVO_OPCOES_SERVIDOR.md)** 🔄 NOVO
- ✅ Tabela comparativa: Local vs Nuvem
- ✅ Vantagens/desvantagens
- ✅ Matriz de decisão
- ✅ Casos reais e recomendações
- ✅ Fluxo de decisão

---

## 📋 DOCUMENTAÇÃO POR ÁREA

### 👥 **Para Recepcionista**
- Arquivo: [IMPLANTACAO_RAPIDA.md - Seção "Interface para Recepcionista"](IMPLANTACAO_RAPIDA.md#-interface-para-recepcionista)
- Ver também: [EXEMPLOS_USO_API.md - Emitir Senha](EXEMPLOS_USO_API.md#1-emitir-senha-recepção)

### 👨‍⚕️ **Para Médico/Dentista**
- Arquivo: [IMPLANTACAO_RAPIDA.md - Seção "Consultório"](IMPLANTACAO_RAPIDA.md#3-consultório)
- Ver também: [EXEMPLOS_USO_API.md - Iniciar/Finalizar Atendimento](EXEMPLOS_USO_API.md#6-iniciar-atendimento-consultório)

### 🖥️ **Para Monitor (Painel Eletrônico)**
- Arquivo: **painel-eletronico.html** (abrir em navegador)
- Documentação: [IMPLANTACAO_RAPIDA.md - Seção "Painel Eletrônico"](IMPLANTACAO_RAPIDA.md#-painel-eletrônico)

### 👨‍💼 **Para Gerente/Admin**
- Arquivo: [GUIA_IMPLANTACAO_CLINICA.md - Fase 8](GUIA_IMPLANTACAO_CLINICA.md#-fase-8-manutenção)
- Relatórios: [EXEMPLOS_USO_API.md - Estatísticas](EXEMPLOS_USO_API.md#9-obter-estatísticas-do-dia)

### 🔧 **Para Técnico/TI**
- Arquivo: [GUIA_IMPLANTACAO_CLINICA.md - Completo](GUIA_IMPLANTACAO_CLINICA.md)
- Troubleshooting: [IMPLANTACAO_RAPIDA.md - Seção "Troubleshooting"](IMPLANTACAO_RAPIDA.md#-troubleshooting)

---

## 🚀 FLUXO RÁPIDO

```
1. Ler: IMPLANTACAO_RAPIDA.md
   ↓
2. Instalar: Node.js + PostgreSQL
   ↓
3. Executar: npm install && npm run db:init && npm run dev
   ↓
4. Testar: http://localhost:3000
   ↓
5. Usar: Acessar http://localhost:3000/docs
   ↓
6. Monitor: Abrir painel-eletronico.html
   ↓
7. Consultar: EXEMPLOS_USO_API.md conforme necessário
   ↓
8. Problemas: Ver GUIA_IMPLANTACAO_CLINICA.md - Troubleshooting
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
Clinica/
├── IMPLANTACAO_RAPIDA.md              ← Comece aqui! (LOCAL)
├── GUIA_IMPLANTACAO_CLINICA.md        ← Guia completo
├── EXEMPLOS_USO_API.md                ← Como usar API
├── USAR_NUVEM_OU_DATABASE.md          ← Usar servidor na NUVEM ☁️
├── COMPARATIVO_OPCOES_SERVIDOR.md     ← Comparar opções
├── RESUMO_VISUAL.md                   ← Resumo em figuras
├── painel-eletronico.html             ← Monitor fila
├── package.json                       ← Dependências
├── .env                               ← Configuração banco
├── src/
│   ├── server.js                      ← Servidor principal
│   ├── config/database.js             ← Conexão PostgreSQL
│   ├── controllers/
│   │   ├── pacienteController.js      ← Lógica pacientes
│   │   └── recepcaoController.js      ← Lógica recepção
│   ├── models/
│   │   ├── pacienteModel.js           ← BD pacientes
│   │   └── recepcaoModel.js           ← BD recepção
│   └── routes/
│       ├── pacientes.js               ← API pacientes
│       └── recepcao.js                ← API recepção
├── database/
│   └── schema.sql                     ← Estrutura BD
└── scripts/
    └── initDb.js                      ← Inicializar BD
```

---

## 🎓 CENÁRIOS DE USO

### Cenário 1: Primeira Vez Instalando
```
1. Ler: IMPLANTACAO_RAPIDA.md
2. Seguir passo a passo
3. Testar endpoints em http://localhost:3000/docs
4. Dúvidas: Consultar EXEMPLOS_USO_API.md
```

### Cenário 2: Já Instalado, Quer Usar
```
1. Abrir: http://localhost:3000/docs
2. Emitir senha: POST /pacientes/emitir-senha
3. Ver fila: GET /pacientes/fila
4. Chamar próximo: POST /recepcao/chamar-proximo
5. Monitor: Abrir painel-eletronico.html
```

### Cenário 3: Problema no Sistema
```
1. Ler: IMPLANTACAO_RAPIDA.md - Troubleshooting
2. Se não resolver: GUIA_IMPLANTACAO_CLINICA.md - Troubleshooting
3. Se ainda não: Verificar logs com: npm run dev
```

### Cenário 4: Quer Expandir
```
1. Estudar: EXEMPLOS_USO_API.md
2. Aprender: JavaScript examples
3. Criar: Interface customizada
4. Integrar: Com seu sistema existente
```

---

## ✅ CHECKLIST DE LEITURA

- [ ] Ler IMPLANTACAO_RAPIDA.md
- [ ] Ler EXEMPLOS_USO_API.md (seção do seu perfil)
- [ ] Ter acesso ao painel-eletronico.html
- [ ] Conhecer http://localhost:3000/docs (documentação interativa)
- [ ] Ter anotado:
  - [ ] Senha do PostgreSQL
  - [ ] IP do servidor (para outros acessarem)
  - [ ] Porta do servidor (3000)

---

## 💡 DICAS IMPORTANTES

### Para Recepcionista
- 🔑 Use a documentação interativa: `http://localhost:3000/docs`
- 📱 Pode usar de qualquer computador na clínica
- 🖨️ Imprima as senhas para entregar ao paciente

### Para Médico/Dentista
- ⏱️ Atualiza automaticamente quando novo paciente é chamado
- 📋 Não precisa fazer nada além de chamar "Iniciar" e "Finalizar"
- 🎯 Foque no paciente, sistema cuida do resto

### Para Gerencia
- 📊 Relatórios em: `http://localhost:3000/api/recepcao/estatisticas`
- 📈 Use para melhorar atendimento
- 🔄 Faça backup regularmente

### Para TI
- 🔐 Proteja acesso ao servidor
- 💾 Faça backup diário do banco
- 📡 Configure firewall para bloquear acesso externo
- 🚀 Use PM2 para manter rodando 24h

---

## 🔗 LINKS ÚTEIS

| Recurso | Link |
|---------|------|
| API Interativa | http://localhost:3000/docs |
| Raiz da API | http://localhost:3000 |
| Painel Eletrônico | file:///path/to/painel-eletronico.html |
| PostgreSQL | https://www.postgresql.org |
| Node.js | https://nodejs.org |
| Postman | https://www.postman.com |

---

## 📞 SUPORTE RÁPIDO

| Dúvida | Resposta |
|--------|----------|
| Como emitir senha? | Ver EXEMPLOS_USO_API.md - Exemplo 1 |
| Como chamar próximo? | Ver EXEMPLOS_USO_API.md - Exemplo 5 |
| Monitor não funciona? | Ver IMPLANTACAO_RAPIDA.md - Troubleshooting |
| Não conecta no banco? | Ver IMPLANTACAO_RAPIDA.md - Troubleshooting |
| Quer expandir? | Ver GUIA_IMPLANTACAO_CLINICA.md - Próximos Passos |

---

## 🎯 META

Você deve ser capaz de:

✅ Instalar o sistema em 30 minutos
✅ Usar a API sem código em 5 minutos
✅ Treinar pessoal em 1 hora
✅ Resolver 90% dos problemas sozinho
✅ Expandir conforme necessário

---

## 📝 NOTAS

- Sistema funciona **totalmente offline** (sem internet necessária)
- Dados ficam **no seu computador** (não é nuvem)
- Pode ser expandido a qualquer momento
- Código é **aberto** (você pode modificar)
- Sem custos mensais

---

**Bem-vindo ao Sistema de Clínica! 🏥**

**Comece por: [IMPLANTACAO_RAPIDA.md](IMPLANTACAO_RAPIDA.md)**
