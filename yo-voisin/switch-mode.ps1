# Script pour basculer entre mode DEV et PRODUCTION

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod")]
    [string]$Mode
)

Write-Host "🔧 Changement de mode..." -ForegroundColor Cyan

# Vérifier que .env.local existe
if (-not (Test-Path .env.local)) {
    Write-Host "❌ Fichier .env.local introuvable!" -ForegroundColor Red
    exit 1
}

# Lire le contenu actuel
$content = Get-Content .env.local

# Déterminer le nouveau mode
if ($Mode -eq "dev") {
    $newEnv = "development"
    $description = "DÉVELOPPEMENT (popup de debug)"
    $emoji = "🐛"
} else {
    $newEnv = "production"
    $description = "PRODUCTION (envoi WhatsApp réel)"
    $emoji = "🚀"
}

# Remplacer NODE_ENV
$newContent = $content -replace 'NODE_ENV=(development|production)', "NODE_ENV=$newEnv"
$newContent | Set-Content .env.local

Write-Host "`n✅ Mode changé vers: $emoji $description" -ForegroundColor Green
Write-Host "   📋 NODE_ENV=$newEnv" -ForegroundColor Cyan

Write-Host "`n⚠️  IMPORTANT: Redémarrez le serveur pour appliquer les changements:" -ForegroundColor Yellow
Write-Host "   .\restart-server.ps1" -ForegroundColor White

Write-Host "`n📖 Différences:" -ForegroundColor Cyan
if ($Mode -eq "dev") {
    Write-Host "   • Code OTP affiché dans un popup" -ForegroundColor Gray
    Write-Host "   • Logs détaillés dans la console" -ForegroundColor Gray
    Write-Host "   • Aucun message WhatsApp envoyé" -ForegroundColor Gray
} else {
    Write-Host "   • Pas de popup (code uniquement sur WhatsApp)" -ForegroundColor Gray
    Write-Host "   • Message WhatsApp envoyé via Twilio" -ForegroundColor Gray
    Write-Host "   • Nécessite d'avoir rejoint le sandbox" -ForegroundColor Gray
}
