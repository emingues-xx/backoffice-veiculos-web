# Deploy no Railway - Backoffice Veículos Web

## 🚀 Guia de Deploy

### 1. Preparação do Projeto

O projeto já está configurado com:
- ✅ `railway.json` - Configuração do Railway
- ✅ `Dockerfile` - Container otimizado
- ✅ `next.config.js` - Configurado para standalone
- ✅ `.dockerignore` - Otimização do build

### 2. Deploy no Railway

#### Opção A: Via Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login no Railway
railway login

# Inicializar projeto
railway init

# Deploy
railway up
```

#### Opção B: Via GitHub (Recomendado)

1. **Conectar Repositório**:
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório

2. **Configurar Variáveis de Ambiente**:
   ```env
   NODE_ENV=production
   BFF_BASE_URL=https://seu-bff-url.railway.app
   NEXT_TELEMETRY_DISABLED=1
   ```

### 3. Configuração de Variáveis de Ambiente

No painel do Railway, adicione:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NODE_ENV` | `production` | Ambiente de produção |
| `BFF_BASE_URL` | `https://seu-bff.railway.app` | URL do seu BFF |
| `NEXT_TELEMETRY_DISABLED` | `1` | Desabilitar telemetria |
| `PORT` | `3000` | Porta (Railway define automaticamente) |

### 4. Domínio Personalizado (Opcional)

1. No painel do Railway
2. Vá em "Settings" → "Domains"
3. Adicione seu domínio personalizado
4. Configure DNS conforme instruções

### 5. Monitoramento

- **Logs**: Disponível no painel do Railway
- **Métricas**: CPU, RAM, Network
- **Health Check**: `/health` endpoint

### 6. Comandos Úteis

```bash
# Ver logs em tempo real
railway logs

# Conectar ao container
railway shell

# Ver status do deploy
railway status

# Rollback
railway rollback
```

### 7. Troubleshooting

#### Build Falha
- Verifique se todas as dependências estão no `package.json`
- Confirme se o `Dockerfile` está correto

#### Erro de CORS
- Verifique se `BFF_BASE_URL` está correto
- Confirme se o BFF está rodando

#### Erro 500
- Verifique os logs: `railway logs`
- Confirme variáveis de ambiente

### 8. Estrutura de Arquivos

```
├── railway.json          # Configuração Railway
├── Dockerfile            # Container config
├── .dockerignore         # Ignore files
├── next.config.js        # Next.js config
├── package.json          # Dependencies
└── src/                  # Source code
```

### 9. URLs de Exemplo

- **Frontend**: `https://backoffice-veiculos-web.railway.app`
- **BFF**: `https://backoffice-veiculos-bff.railway.app`

### 10. Próximos Passos

1. ✅ Deploy do Frontend
2. 🔄 Deploy do BFF (se necessário)
3. 🔄 Configurar domínio personalizado
4. 🔄 Configurar CI/CD
5. 🔄 Monitoramento e alertas

## 📞 Suporte

- [Railway Docs](https://docs.railway.app)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Docker Docs](https://docs.docker.com)
