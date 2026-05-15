# ⚡ COMECE AGORA!

## 3️⃣ Passos para usar o sistema

### Passo 1: Iniciar o servidor
```bash
npm run dev
```

Aguarde a mensagem:
```
✓ Servidor rodando na porta 3000
✓ Acesse: http://localhost:3000
```

### Passo 2: Abrir o Totem (Emitir Senhas)
```
URL: http://localhost:3000/totem
```

1. Preencha os dados:
   - Nome: (qualquer nome)
   - CPF: (qualquer número com 11 dígitos)
   - Telefone: (qualquer número com dígitos)

2. Selecione prioridade

3. Clique no botão grande **"EMITIR SENHA"**

4. Você verá:
   - Um **número** (ex: 0042)
   - Um **QR Code**

### Passo 3: Acompanhar no Celular
Duas opções:

**Opção A - Escanear QR Code:**
1. Pegue um celular
2. Câmera ou app de QR Code
3. Aponte para o QR Code da tela
4. Clique no link gerado

**Opção B - Digitar manualmente:**
1. Abra no celular: http://localhost:3000/cliente-mobile
2. Veja a opção "Digite sua Senha"
3. Copie o número (ex: 0042)
4. Cole e clique "Buscar"

### Passo 4: Ver a Fila Atualizar
```
Você verá:
✓ Sua posição na fila
✓ Tempo estimado
✓ Status: Aguardando
✓ Atualiza a cada 3 segundos
```

### Passo 5: Chamar o Paciente
1. Abra: http://localhost:3000/docs
2. Procure por **POST /api/recepcao/chamar-proximo**
3. Clique em **"Try it out"**
4. Clique em **"Execute"**

Você verá:
```
✓ Próximo paciente é chamado
✓ Painel mostra o número
✓ Celular toca uma notificação
✓ Tela pisca "SUA VEZ!"
```

### Passo 6: Ver Monitor TV
```
URL: http://localhost:3000/painel
```

```
Mostra:
✓ Atendendo: 0042
✓ Próximo: 0043
✓ Fila: 5 pessoas
✓ Atualiza automático
```

---

## 🎯 Resumo do Fluxo

```
1. Totem:    http://localhost:3000/totem
   ↓
2. Celular:  http://localhost:3000/cliente-mobile
   ↓
3. API:      http://localhost:3000/docs
   ↓
4. Monitor:  http://localhost:3000/painel
```

---

## 📚 Mais informações

| Arquivo | Para quem | Conteúdo |
|---------|-----------|----------|
| GUIA_RAPIDO.md | Todos | Como usar cada interface |
| VERIFICACAO_FLUXOGRAMA.md | Supervisor | Status 100% completo |
| RESUMO_IMPLEMENTACAO.md | Desenvolvedor | Detalhes técnicos |
| README.md | Desenvolvedor | Instalação e API |

---

## ✅ Pronto!

Você tem tudo o que precisa. O sistema está **100% funcional**.

**Use agora! 🚀**
