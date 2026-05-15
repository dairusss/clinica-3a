@echo off
REM 🧪 TESTE RÁPIDO - Sistema de Clínica (Windows)
REM Script para validar que tudo está funcionando

echo ============================================
echo 🧪 TESTE DO SISTEMA DE CLINICA
echo ============================================
echo.

REM Teste de conexão
echo 📡 Teste 1: Health Check
REM PowerShell one-liner para testar
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing; if ($response.Content -like '*OK*') { Write-Host '✅ Servidor respondendo'; exit 0 } else { Write-Host '❌ Resposta inesperada'; exit 1 } } catch { Write-Host '❌ Servidor não está respondendo'; Write-Host 'Execute: npm run dev'; exit 1 }"
if errorlevel 1 goto :error
echo.

REM Teste de acesso às interfaces
echo 🖥️ Teste 2: Interfaces Disponíveis
echo.

echo Verificando totem.html...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/totem' -UseBasicParsing; if ($response.Content -like '*EMITIR*') { Write-Host '✅ Totem acessível' } else { Write-Host '❌ Totem não encontrado' } } catch { Write-Host '❌ Erro ao acessar totem' }"

echo Verificando cliente-mobile.html...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/cliente-mobile' -UseBasicParsing; if ($response.Content -like '*Acompanhe*') { Write-Host '✅ Cliente mobile acessível' } else { Write-Host '❌ Cliente mobile não encontrado' } } catch { Write-Host '❌ Erro ao acessar cliente mobile' }"

echo Verificando painel-eletronico.html...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/painel' -UseBasicParsing; if ($response.Content -like '*painel*') { Write-Host '✅ Painel acessível' } else { Write-Host '❌ Painel não encontrado' } } catch { Write-Host '❌ Erro ao acessar painel' }"

echo Verificando documentação...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/docs' -UseBasicParsing; if ($response.Content -like '*swagger*') { Write-Host '✅ Documentação acessível' } else { Write-Host '❌ Documentação não encontrada' } } catch { Write-Host '❌ Erro ao acessar documentação' }"
echo.

REM Teste de API
echo 🔌 Teste 3: Endpoints da API
echo.

echo Testando: Emitir Senha
powershell -Command "try { $body = @{ nome='Teste Sistema'; cpf='12345678901'; telefone='11999999999'; prioridade=0 } | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/pacientes/emitir-senha' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing; if ($response.Content -like '*success*' -or $response.Content -like '*numero*') { Write-Host '✅ OK - Emitir senha funcionando'; } else { Write-Host '❌ Erro - Resposta inesperada' } } catch { Write-Host '❌ Erro ao emitir senha' }"

echo Testando: Obter Fila
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/pacientes/fila' -UseBasicParsing; if ($response.Content -like '*data*' -or $response.Content -like '*total*') { Write-Host '✅ OK - Fila acessível' } else { Write-Host '❌ Erro - Resposta inesperada' } } catch { Write-Host '❌ Erro ao obter fila' }"

echo Testando: Obter Próximo
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/pacientes/proximo' -UseBasicParsing; if ($response.Content -like '*data*' -or $response.Content -like '*numero*' -or $response.StatusCode -eq 200) { Write-Host '✅ OK - Próximo acessível' } else { Write-Host '⚠️ Aviso - Nenhum próximo na fila (normal)' } } catch { Write-Host '❌ Erro ao obter próximo' }"
echo.

echo ============================================
echo ✅ TESTES CONCLUÍDOS!
echo ============================================
echo.
echo 📝 Próximos passos:
echo 1. Abrir: http://localhost:3000/totem
echo 2. Emitir uma senha de teste
echo 3. Escanear QR Code com celular
echo 4. Acompanhar fila em: http://localhost:3000/cliente-mobile
echo 5. Chamar paciente em: http://localhost:3000/docs
echo.
echo Para mais informações, veja:
echo   - GUIA_RAPIDO.md
echo   - VERIFICACAO_FLUXOGRAMA.md
echo   - RESUMO_IMPLEMENTACAO.md
echo.
pause
goto :end

:error
echo.
echo ❌ Verificação falhou! Verifique se o servidor está rodando.
echo Execute: npm run dev
echo.
pause

:end
