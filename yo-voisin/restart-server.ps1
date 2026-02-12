# Script de redémarrage complet avec nettoyage du cache

Write-Host "🧹 Nettoyage et redémarrage du serveur..." -ForegroundColor Cyan

# 1. Arrêter tous les processus Node.js
Write-Host "`n1️⃣ Arrêt des processus Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.Id -Force
    Write-Host "   ✅ Processus $($_.Id) arrêté" -ForegroundColor Green
}
Start-Sleep -Seconds 2

# 2. Supprimer le cache Next.js
Write-Host "`n2️⃣ Suppression du cache Next.js..." -ForegroundColor Yellow
$cachePath = ".next"
if (Test-Path $cachePath) {
    Remove-Item -Recurse -Force $cachePath
    Write-Host "   ✅ Cache .next supprimé" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Pas de cache .next trouvé" -ForegroundColor Gray
}

# 3. Vérifier le NODE_ENV
Write-Host "`n3️⃣ Vérification de NODE_ENV..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    $nodeEnv = Select-String -Path .env.local -Pattern "NODE_ENV=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    Write-Host "   📋 NODE_ENV actuel: $nodeEnv" -ForegroundColor Cyan
    
    if ($nodeEnv -eq "production") {
        Write-Host "   ✅ Mode PRODUCTION activé (envoi WhatsApp réel)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Mode DEVELOPMENT (popup de debug)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Fichier .env.local introuvable!" -ForegroundColor Red
    exit 1
}

# 4. Redémarrer le serveur
Write-Host "`n4️⃣ Démarrage du serveur..." -ForegroundColor Yellow
Write-Host "   🚀 Lancement de 'npm run dev'..." -ForegroundColor Cyan
Write-Host "`n" -NoNewline

npm run dev
