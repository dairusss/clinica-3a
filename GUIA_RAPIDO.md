# 🚀 GUIA RÁPIDO - COMO USAR O SISTEMA

## ⚡ INICIAR O SISTEMA

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

---

## 📱 INTERFACES DISPONÍVEIS

### 1️⃣ TOTEM - Emitir Senhas
```
URL: http://localhost:3000/totem
Para: Recepção / Paciente
O que faz: Emite senhas com QR Code

Passo a passo:
1. Abrir a URL no navegador
2. Preencher: Nome, CPF, Telefone
3. Selecionar prioridade
4. Clicar "EMITIR SENHA"
5. Receber número + QR Code
```

### 2️⃣ CLIENTE MOBILE - Acompanhar Fila
```
URL: http://localhost:3000/cliente-mobile
Para: Paciente (Celular)
O que faz: Ver posição na fila em tempo real

Passo a passo:
1. Opção A: Escanear QR Code gerado no totem
2. Opção B: Abrir URL e digitar número manualmente
3. Ver posição na fila
4. Receber notificação quando chamado
5. Som toca automaticamente
```

### 3️⃣ PAINEL ELETRÔNICO - Monitor TV
```
URL: http://localhost:3000/painel
Para: Clínica (Monitor grande)
O que faz: Exibir fila em tempo real

Passo a passo:
1. Abrir em navegador do monitor
2. Deixar aberto em tela cheia
3. Atualiza automaticamente a cada 2 segundos
4. Mostra: Atendendo, Próximo, Fila total
```

### 4️⃣ DOCUMENTAÇÃO - API
```
URL: http://localhost:3000/docs
Para: Desenvolvedores / Recepção avançada
O que faz: Interface para chamar pacientes manualmente

Principais funções:
- POST /api/recepcao/chamar-proximo
- POST /api/recepcao/iniciar/{numeroSenha}
- POST /api/recepcao/finalizar/{numeroSenha}
- GET /api/pacientes/fila
```

---

## 🎯 FLUXO COMPLETO

### Cenário: Um paciente chegou na clínica

```
1. RECEPÇÃO abre TOTEM
   └─ http://localhost:3000/totem

2. PACIENTE preenche dados
   └─ Nome: João Silva
   └─ CPF: 123.456.789-00
   └─ Telefone: (11) 98765-4321
   └─ Prioridade: Normal

3. PACIENTE clica "EMITIR SENHA"
   └─ Recebe: SENHA 0042
   └─ Com: QR Code

4. PACIENTE escaneia QR Code com celular
   └─ Abre: cliente-mobile.html
   └─ Vê: Posição 5 de 10

5. RECEPÇÃO chama próximo
   └─ Abre: /docs
   └─ POST /api/recepcao/chamar-proximo
   └─ Painel mostra: 0042

6. PAINEL atualiza automaticamente
   └─ Mostra: Atendendo 0042
   └─ Próximo: 0043

7. CELULAR notifica paciente
   └─ Som toca
   └─ Tela pisca
   └─ "SUA VEZ!"

8. RECEPÇÃO inicia atendimento
   └─ POST /api/recepcao/iniciar/0042
   └─ Status: EM_ATENDIMENTO

9. RECEPÇÃO finaliza atendimento
   └─ POST /api/recepcao/finalizar/0042
   └─ Status: ATENDIDO

10. SISTEMA chama próximo automaticamente
    └─ Painel mostra 0043
    └─ Celular do próximo notifica
    └─ Fim do ciclo ✓
```

---

## 💡 DICAS IMPORTANTES

### Para PAINEL de TV
```
✓ Abrir em navegador em tela cheia (F11)
✓ Deixar ligado o dia todo
✓ Conexão com internet não é necessária (rede local)
✓ Pode usar TV velha + Raspberry Pi + navegador
✓ Atualiza automático, sem intervenção
```

### Para TOTEM
```
✓ Colocar em lugar visível na recepção
✓ Monitor grande (17"+) é ideal
✓ Botões são GRANDES, clique fácil
✓ Funciona com toque (touch screen)
✓ Não precisa de teclado
```

### Para CELULAR
```
✓ Funciona em qualquer smartphone
✓ Não precisa de app nativo
✓ Só abre no navegador
✓ Som funciona em qualquer celular
✓ Atualiza a cada 3 segundos
```

---

## 🔧 TROUBLESHOOTING

### Painel não atualiza
```
❌ Problema: Painel está "travado"
✓ Solução: Refresh página (F5) ou reabrir URL

❌ Problema: Não vê atualizações em tempo real
✓ Solução: Verificar conexão com internet/rede
```

### Celular não consegue acessar
```
❌ Problema: "Não consegue acessar localhost:3000"
✓ Solução: Usar IP da máquina instead:
   http://192.168.1.100:3000/cliente-mobile

Para descobrir IP:
   Windows: ipconfig (procure IPv4 Address)
   Linux: hostname -I
```

### QR Code não funciona
```
❌ Problema: Câmera não consegue ler QR
✓ Solução: Digitar número manualmente

❌ Problema: QR Code leva a endereço errado
✓ Solução: Editar URL no navegador do celular
```

### Som não toca
```
❌ Problema: Celular não emite som quando chamado
✓ Solução: Verificar volume do celular
✓ Verificar se navegador tem permissão de áudio
✓ Reabrir página no celular
```

---

## 📊 MONITORAMENTO

### Verificar se sistema está funcionando

```
1. Health Check:
   GET http://localhost:3000/health
   Resposta: { "status": "OK" }

2. Ver fila atual:
   GET http://localhost:3000/api/pacientes/fila
   Resposta: Lista de pacientes

3. Ver próximo:
   GET http://localhost:3000/api/pacientes/proximo
   Resposta: Próximo paciente a ser atendido
```

---

## 🎓 TREINAMENTO RÁPIDO

### Para RECEPCIONISTA
```
1. Abrir http://localhost:3000/totem
2. Paciente preenche dados
3. Clicar "EMITIR SENHA"
4. Pronto! Paciente recebe número

Depois:
1. Abrir http://localhost:3000/docs
2. Procurar POST /api/recepcao/chamar-proximo
3. Clicar "Try it out"
4. Clicar "Execute"
5. Próximo paciente é chamado
```

### Para PACIENTE
```
1. Recebe número no TOTEM (ex: 0042)
2. Escaneia QR Code com celular
3. OU digita número em: cliente-mobile.html
4. Vê sua posição na fila
5. Som toca quando sua vez chegar
6. Vai à recepção
```

### Para SUPERVISOR
```
1. Monitor TV mostra fila em tempo real
2. Pode monitorar de qualquer lugar (mesmo IP)
3. Não precisa fazer nada (automático)
4. Atualiza a cada 2 segundos
```

---

## 🚨 CASOS ESPECIAIS

### Paciente não compareceu
```
Na documentação (Swagger):
POST /api/recepcao/chamar/{numeroSenha}
Colocar status: "NAO_COMPARECEU"
Sistema chama próximo automaticamente
```

### Chamar paciente específico
```
Na documentação (Swagger):
POST /api/recepcao/chamar/{numeroSenha}
Específico a chamar: 0045
Chamar fora da ordem
```

### Ver estatísticas
```
Na documentação (Swagger):
GET /api/recepcao/estatisticas
Mostra: Tempo médio, pacientes atendidos, etc
```

---

## 📞 SUPORTE RÁPIDO

### Se a página não carrega
```
1. Verificar se npm run dev está rodando
2. Verificar erro no terminal
3. Tentar em outra aba/navegador
4. Limpar cache (Ctrl+Shift+Del)
5. Reiniciar npm run dev
```

### Se surgir erro de conexão com banco
```
1. Verificar se PostgreSQL está rodando
2. Verificar credenciais em .env
3. Verificar se banco existe
4. Rodar: npm run db:init
5. Tentar novamente
```

### Se sistema ficar lento
```
1. Pode ser muitos pacientes no banco
2. Limpar dados antigos (via database)
3. Reiniciar servidor: npm run dev
4. Verificar carga do servidor
```

---

## ✨ PRÓXIMOS PASSOS

Depois de usar e testar:

```
1. Adicionar SMS (Twilio opcional)
2. Criar app mobile nativo (opcional)
3. Integrar com ERP (opcional)
4. Relatórios avançados (opcional)
5. Impressão de tickets (opcional)
```

**Mas por enquanto, tudo funciona! Bora usar! 🚀**
