# Test Email Notification - Script PowerShell
# Appelle directement l'Edge Function depuis PowerShell

$url = "https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTI2NjksImV4cCI6MjA1NDQ4ODY2OX0.FBDgcNMo3RM9ZMRPekKjlI2BqgJnJqPXcZNmHDmYikg"
}

$body = @{
    type = "request_validated"
    userId = "8b8cb0f0-6712-445b-a9ed-a45aa78638d2"
    data = @{
        requestId = "test-powershell-$(Get-Date -Format 'HHmmss')"
        title = "Test PowerShell direct"
        category = "test"
        createdAt = (Get-Date).ToString("o")
    }
} | ConvertTo-Json

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST EMAIL NOTIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Envoi de la requete..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "SUCCES !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Reponse de l'API:" -ForegroundColor White
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Gray
    Write-Host ""
    Write-Host "Email envoye a: $($response.recipient)" -ForegroundColor Green
    Write-Host ""
    Write-Host "VERIFIEZ MAINTENANT:" -ForegroundColor Yellow
    Write-Host "  1. Votre boite mail coulmilourou@gmail.com" -ForegroundColor White
    Write-Host "  2. Le dossier SPAM" -ForegroundColor White
    Write-Host "  3. Cherchez Yo!Voiz dans l'expediteur" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "ERREUR !" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Details de l'erreur:" -ForegroundColor White
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Reponse du serveur:" -ForegroundColor White
        Write-Host $responseBody -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
