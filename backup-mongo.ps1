
# backup-mongo.ps1
param (
    [string]$MONGO_URI = $env:MONGO_URI,
    [string]$OUT_DIR = "./backups/job_database-$(Get-Date -Format yyyy-MM-dd_HH-mm)"
)

Write-Host "===> Creating backup in $OUT_DIR"

# Делаем дамп
mongodump --uri="$MONGO_URI" --out="$OUT_DIR" --verbose

# Конвертируем BSON → JSON
$src = Join-Path $OUT_DIR "job_database"
$dst = "./backups"

foreach ($file in Get-ChildItem $src -Filter *.bson) {
    $jsonFile = Join-Path $dst ($file.BaseName + ".json")
    bsondump $file.FullName > $jsonFile
    Write-Host "Exported $($file.Name) to $jsonFile"
}

Write-Host "===> Backup finished!"


