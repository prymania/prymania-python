# Back up EVERYTHING (including private/ = lesson sources with answers + passwords)
# to the PRIVATE repo prymania-python-backup. Run from VS Code terminal:  .\backup.ps1
# Uses a separate git folder (.git-backup), so private/ never enters the public repo.
Set-Location $PSScriptRoot
$backupUrl = "https://github.com/prymania/prymania-python-backup.git"
$g = @("--git-dir=.git-backup", "--work-tree=.")

if (-not (Test-Path ".git-backup")) {
    Write-Host "Missing .git-backup folder - see README section 'Set up a new computer'." -ForegroundColor Red
    exit 1
}

# Safety 1: backup remote must be the -backup repo
$url = git @g remote get-url origin
if ($url -ne $backupUrl) {
    Write-Host "STOP: backup remote is '$url' (expected $backupUrl)" -ForegroundColor Red
    exit 1
}

# Safety 2: the public repo must never track private/
if (git ls-files private) {
    Write-Host "STOP: private/ is tracked by the PUBLIC repo. Ask for help before pushing anything." -ForegroundColor Red
    exit 1
}

git @g add -A
git @g add -f private
if (git @g status --porcelain) {
    git @g commit -q -m ("backup " + (Get-Date -Format "yyyy-MM-dd HH:mm"))
}
git @g push -q origin HEAD:main
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup done -> prymania-python-backup (private)" -ForegroundColor Green
} else {
    Write-Host "Backup push failed (see message above)" -ForegroundColor Red
    exit 1
}
