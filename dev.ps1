# Uprise Sales OS - Dev Launcher
# Automates the monorepo dev server startup

Write-Host "Uprise Sales OS - Demarrage du systeme..." -ForegroundColor Cyan

# Ensure dependencies are sync'd
if (!(Test-Path "node_modules")) {
    Write-Host "Installation des dependances (npx pnpm install)..." -ForegroundColor Yellow
    npx pnpm install
}

# Launch Turbo dev
Write-Host "Lancement des serveurs (API et Dashboard)..." -ForegroundColor Green
npx pnpm dev
