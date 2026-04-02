# CC-Outreach - Dev Launcher
# Automates the monorepo dev server startup

Write-Host "CC-Outreach - Demarrage du systeme..." -ForegroundColor Cyan

# Ensure dependencies are sync'd
if (!(Test-Path "node_modules")) {
    Write-Host "Installation des dependances (pnpm install)..." -ForegroundColor Yellow
    pnpm install
}

# Launch Turbo dev
Write-Host "Lancement des serveurs (API et Dashboard)..." -ForegroundColor Green
pnpm dev
