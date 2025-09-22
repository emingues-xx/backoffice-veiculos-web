# Backoffice Veículos Web - Setup Script
Write-Host "🚀 Configurando Backoffice Veículos Web..." -ForegroundColor Green

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro." -ForegroundColor Red
    exit 1
}

# Verificar versão do Node.js
$versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($versionNumber -lt 18) {
    Write-Host "❌ Node.js versão 18+ é necessária. Versão atual: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Configurar variáveis de ambiente
if (-not (Test-Path ".env.local")) {
    Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env.local"
    Write-Host "✅ Arquivo .env.local criado" -ForegroundColor Green
    Write-Host "📝 Edite o arquivo .env.local se necessário" -ForegroundColor Cyan
}
else {
    Write-Host "✅ Arquivo .env.local já existe" -ForegroundColor Green
}

# Verificar se o BFF está rodando
Write-Host "🔍 Verificando conexão com BFF..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ BFF está rodando em http://localhost:3002" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ BFF não está rodando em http://localhost:3002" -ForegroundColor Yellow
    Write-Host "   Certifique-se de que o BFF está iniciado antes de executar o frontend" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o projeto:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "O sistema estará disponível em:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Para mais informações, consulte o README.md" -ForegroundColor Cyan
