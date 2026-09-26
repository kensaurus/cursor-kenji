<#
FILE: housekeep-files.ps1
PURPOSE: Copy-not-move document organizer with a hash inventory, dry run,
         labeled copies, a JSONL catalog, and a verify gate. Windows twin of
         housekeep-files.sh (same plan.tsv, same outputs).

OVERVIEW:
- inventory : sha256 + size of every source file in plan.tsv -> work\inventory.csv;
              file counts of count-only folders -> work\count-only.csv
- dry-run   : work\preview.tsv with the action per file; no disk change
- apply     : Copy-Item only when the destination is absent, hash the copy,
              append _ai-catalog.jsonl at each catalog_root and work\catalog.jsonl,
              write apply-log.tsv. Never deletes.
- verify    : every inventory path exists at the same size, every copy re-hashes
              equal, every in-place file exists, count-only counts unchanged.
              Exit 1 on the first failure. -> work\verify-report.txt

DEPENDENCIES: Windows PowerShell 5.1 or PowerShell 7. No modules.

USAGE:
  .\housekeep-files.ps1 -Mode inventory -Plan plan.tsv -Out work -CountOnly count-only.txt
  .\housekeep-files.ps1 -Mode dry-run   -Plan plan.tsv -Out work
  .\housekeep-files.ps1 -Mode apply     -Plan plan.tsv -Out work
  .\housekeep-files.ps1 -Mode verify    -Plan plan.tsv -Out work -CountOnly count-only.txt

plan.tsv header (tab-separated):
  source  destination  entity  area  project  doc_type  tags  prefix  catalog_root

NOTES:
- There is no Remove-Item, Move-Item, or robocopy in this file by design.
- -LiteralPath everywhere: folder names carry #, spaces, CJK, brackets.
- Output files are UTF-8 without BOM so other tools and the bash twin read them.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][ValidateSet('inventory', 'dry-run', 'apply', 'verify')][string]$Mode,
  [Parameter(Mandatory = $true)][string]$Plan,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$CountOnly = '',
  [int]$MaxMB = 200,
  [int]$MaxPath = 200
)

Set-StrictMode -Version 2
$ErrorActionPreference = 'Stop'
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$DocExt = @('.pdf', '.doc', '.docx', '.xls', '.xlsx', '.xlsm', '.ppt', '.pptx', '.csv', '.txt', '.md',
  '.html', '.htm', '.xtx', '.xml', '.data', '.zip', '.jpg', '.jpeg', '.png', '.heic', '.svg', '.gif',
  '.webp', '.rtf', '.odt', '.ods', '.eml', '.msg')
$SecretRe = 'credential|keystore|\.p8$|\.p12$|\.pem$|\.key$|\.jks$|mobileprovision|\.cer$|\.der$|certsigningrequest|\.b64$|service-account|client_secret|google-services\.json|googleservice-info|oauth|private-key|backup_code|\.env$|play-publisher|apple-credentials|env-backups|recovery|2fa|mfa|totp|アクセスキー'
$DatedNameRe = '^(20\d{6}|20\d{2}-\d{2}|20\d{2}_)'
$RunStamp = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')

function Write-Utf8Lines([string]$Path, [string[]]$Lines) {
  [System.IO.File]::WriteAllLines($Path, $Lines, $Utf8NoBom)
}
function Append-Utf8Lines([string]$Path, [string[]]$Lines) {
  [System.IO.File]::AppendAllLines($Path, [string[]]$Lines, $Utf8NoBom)
}
function Get-Sha256([string]$LiteralPath) {
  (Get-FileHash -LiteralPath $LiteralPath -Algorithm SHA256).Hash.ToLowerInvariant()
}
function Read-Tsv([string]$Path) {
  $lines = [System.IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8) | Where-Object { $_.Trim() -ne '' }
  $header = $lines[0].Split("`t")
  $rows = @()
  foreach ($line in $lines[1..($lines.Count - 1)]) {
    if ($line.TrimStart().StartsWith('#')) { continue }
    $cells = $line.Split("`t")
    $row = @{}
    for ($i = 0; $i -lt $header.Count; $i++) {
      $val = ''
      if ($i -lt $cells.Count) { $val = $cells[$i].Trim() }
      $row[$header[$i].Trim()] = $val
    }
    $rows += , $row
  }
  return $rows
}
function Get-DateToken([string]$Name, [string]$ParentName) {
  foreach ($candidate in @($Name, $ParentName)) {
    if ([string]::IsNullOrEmpty($candidate)) { continue }
    $m = [regex]::Match($candidate, '(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})(?!\d)')
    if ($m.Success) {
      $mo = [int]$m.Groups[2].Value; $d = [int]$m.Groups[3].Value
      if ($mo -ge 1 -and $mo -le 12 -and $d -ge 1 -and $d -le 31) { return ('{0}-{1:00}-{2:00}' -f $m.Groups[1].Value, $mo, $d) }
    }
    $m = [regex]::Match($candidate, '(20\d{2})[-_]?(\d{2})(?!\d)')
    if ($m.Success) {
      $mo = [int]$m.Groups[2].Value
      if ($mo -ge 1 -and $mo -le 12) { return ('{0}-{1:00}' -f $m.Groups[1].Value, $mo) }
    }
  }
  return 'undated'
}
function Json-Escape([string]$s) {
  if ($null -eq $s) { return '' }
  return $s.Replace('\', '\\').Replace('"', '\"').Replace("`r", '\r').Replace("`n", '\n').Replace("`t", '\t')
}
function To-CatalogLine($item) {
  $tags = @()
  foreach ($t in ($item.tags -split ',')) { if ($t.Trim() -ne '') { $tags += ('"' + (Json-Escape $t.Trim()) + '"') } }
  $fields = @(
    ('"run":"' + $RunStamp + '"'),
    ('"entity":"' + (Json-Escape $item.entity) + '"'),
    ('"area":"' + (Json-Escape $item.area) + '"'),
    ('"project":"' + (Json-Escape $item.project) + '"'),
    ('"doc_type":"' + (Json-Escape $item.doc_type) + '"'),
    ('"date":"' + $item.date + '"'),
    ('"tags":[' + ($tags -join ',') + ']'),
    ('"original_path":"' + (Json-Escape $item.source) + '"'),
    ('"original_name":"' + (Json-Escape $item.name) + '"'),
    ('"canonical_path":"' + (Json-Escape $item.canonical) + '"'),
    ('"bytes":' + $item.bytes),
    ('"sha256":"' + $item.sha256 + '"'),
    ('"persist":"' + $item.persist + '"'),
    ('"reason":"' + $item.reason + '"')
  )
  return '{' + ($fields -join ',') + '}'
}

# Expand plan rows into per-file items with a proposed action.
function Expand-Plan($rows) {
  $items = @()
  foreach ($row in $rows) {
    $src = $row['source']
    if (-not (Test-Path -LiteralPath $src)) { Write-Warning "plan source missing, skipped: $src"; continue }
    $srcItem = Get-Item -LiteralPath $src
    $files = @()
    if ($srcItem.PSIsContainer) {
      $files = Get-ChildItem -LiteralPath $src -Recurse -File -Force
    } else {
      $files = @($srcItem)
    }
    foreach ($f in $files) {
      $rel = $f.Name
      if ($srcItem.PSIsContainer) {
        $rel = $f.FullName.Substring($srcItem.FullName.Length).TrimStart('\')
      }
      $destDir = $row['destination']
      $relDir = [System.IO.Path]::GetDirectoryName($rel)
      if ($relDir) { $destDir = Join-Path $destDir $relDir }
      $lowerPath = $f.FullName.ToLowerInvariant()
      $ext = $f.Extension.ToLowerInvariant()
      $action = 'copy'; $reason = ''
      if ($lowerPath -match $SecretRe) { $action = 'indexed-in-place'; $reason = 'secret' }
      elseif ($DocExt -notcontains $ext) { $action = 'indexed-in-place'; $reason = 'ext' }
      elseif ($f.Length -gt ($MaxMB * 1MB)) { $action = 'indexed-in-place'; $reason = 'size' }

      $date = Get-DateToken $f.Name $f.Directory.Name
      $newName = $f.Name
      if ($action -eq 'copy' -and $row['prefix'] -eq 'yes') {
        $entityTok = $row['entity']
        if ($f.Name -notmatch $DatedNameRe -and -not $f.Name.StartsWith($entityTok + '_')) {
          $cand = '{0}_{1}_{2}_{3}__{4}' -f $entityTok, $row['area'], $date, $row['doc_type'], $f.Name
          if ((Join-Path $destDir $cand).Length -le $MaxPath) { $newName = $cand }
        }
      }
      $canonical = ''
      if ($action -eq 'copy') { $canonical = Join-Path $destDir $newName }
      $items += , @{
        source = $f.FullName; name = $f.Name; bytes = $f.Length; destDir = $destDir; newName = $newName
        canonical = $canonical; action = $action; reason = $reason; date = $date
        entity = $row['entity']; area = $row['area']; project = $row['project']; doc_type = $row['doc_type']
        tags = $row['tags']; catalog_root = $row['catalog_root']; sha256 = ''; persist = ''
      }
    }
  }
  return $items
}

function Read-CountOnly([string]$Path) {
  if ([string]::IsNullOrEmpty($Path)) { return @() }
  return [System.IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8) | Where-Object { $_.Trim() -ne '' -and -not $_.TrimStart().StartsWith('#') } | ForEach-Object { $_.Trim() }
}
function Count-Files([string]$Folder) {
  if (-not (Test-Path -LiteralPath $Folder)) { return -1 }
  return @(Get-ChildItem -LiteralPath $Folder -Recurse -File -Force).Count
}

New-Item -ItemType Directory -Force -Path $Out | Out-Null
$Out = (Resolve-Path -LiteralPath $Out).Path
$inventoryPath = Join-Path $Out 'inventory.csv'
$countPath = Join-Path $Out 'count-only.csv'
$previewPath = Join-Path $Out 'preview.tsv'
$catalogPath = Join-Path $Out 'catalog.jsonl'
$applyLogPath = Join-Path $Out 'apply-log.tsv'
$verifyPath = Join-Path $Out 'verify-report.txt'

$rows = Read-Tsv $Plan
Write-Host ("plan rows: {0}" -f $rows.Count)

switch ($Mode) {
  'inventory' {
    $items = Expand-Plan $rows
    $lines = @('path,bytes,sha256')
    $i = 0
    foreach ($it in $items) {
      $i++
      if ($i % 50 -eq 0) { Write-Host ("hashing {0}/{1}" -f $i, $items.Count) }
      # Hash only what will be copied; in-place items (media, secrets, installers) are size-checked
      # so a streaming cloud drive is not forced to download them.
      $h = ''
      if ($it.action -eq 'copy') { $h = Get-Sha256 $it.source }
      $lines += ('"' + $it.source.Replace('"', '""') + '",' + $it.bytes + ',' + $h)
    }
    Write-Utf8Lines $inventoryPath $lines
    $clines = @('folder,files')
    foreach ($folder in (Read-CountOnly $CountOnly)) {
      $clines += ('"' + $folder.Replace('"', '""') + '",' + (Count-Files $folder))
    }
    Write-Utf8Lines $countPath $clines
    Write-Host ("inventory: {0} files -> {1}; count-only folders: {2} -> {3}" -f $items.Count, $inventoryPath, ($clines.Count - 1), $countPath)
  }
  'dry-run' {
    $items = Expand-Plan $rows
    $lines = @("action`treason`tsource`tdestination`tnew_name`tentity`tarea`tproject`tdoc_type`tdate`ttags")
    $counts = @{}
    foreach ($it in $items) {
      $action = $it.action
      if ($action -eq 'copy' -and (Test-Path -LiteralPath $it.canonical)) { $action = 'skipped-exists' }
      $key = $action; if ($it.reason) { $key = $action + ':' + $it.reason }
      if (-not $counts.ContainsKey($key)) { $counts[$key] = 0 }
      $counts[$key]++
      $lines += ($action, $it.reason, $it.source, $it.destDir, $it.newName, $it.entity, $it.area, $it.project, $it.doc_type, $it.date, $it.tags) -join "`t"
    }
    Write-Utf8Lines $previewPath $lines
    Write-Host ("preview -> {0}" -f $previewPath)
    foreach ($k in ($counts.Keys | Sort-Object)) { Write-Host ("  {0,-24} {1}" -f $k, $counts[$k]) }
  }
  'apply' {
    if (-not (Test-Path -LiteralPath $inventoryPath)) { throw "inventory.csv missing under $Out — run -Mode inventory first" }
    $inv = @{}
    foreach ($r in (Import-Csv -LiteralPath $inventoryPath -Encoding UTF8)) { $inv[$r.path] = $r }
    $items = Expand-Plan $rows
    $log = @("action`tsource`tcanonical`tbytes`tsha256")
    $catalogLines = @()
    $perRoot = @{}
    $counts = @{ 'copied-source-kept' = 0; 'skipped-exists' = 0; 'indexed-in-place' = 0; 'failed' = 0 }
    $copiedBytes = [long]0
    $n = 0
    foreach ($it in $items) {
      $n++
      if ($n % 50 -eq 0) { Write-Host ("apply {0}/{1}" -f $n, $items.Count) }
      if (-not $inv.ContainsKey($it.source)) { throw "source not in inventory (plan changed after inventory?): $($it.source)" }
      $it.sha256 = $inv[$it.source].sha256
      if ($it.action -eq 'indexed-in-place') {
        $it.persist = 'indexed-in-place'; $it.canonical = $it.source
      }
      elseif (Test-Path -LiteralPath $it.canonical) {
        $it.persist = 'skipped-exists'
      }
      else {
        try {
          New-Item -ItemType Directory -Force -Path $it.destDir | Out-Null
          Copy-Item -LiteralPath $it.source -Destination $it.canonical
          $destHash = Get-Sha256 $it.canonical
          if ($destHash -eq $it.sha256) { $it.persist = 'copied-source-kept'; $copiedBytes += [long]$it.bytes }
          else { $it.persist = 'failed'; $it.reason = 'hash-mismatch' }
        } catch {
          $it.persist = 'failed'; $it.reason = ('copy-error: ' + $_.Exception.Message.Replace("`n", ' '))
        }
      }
      $counts[$it.persist]++
      $log += ($it.persist, $it.source, $it.canonical, $it.bytes, $it.sha256) -join "`t"
      $line = To-CatalogLine $it
      $catalogLines += $line
      if ($it.catalog_root) {
        if (-not $perRoot.ContainsKey($it.catalog_root)) { $perRoot[$it.catalog_root] = @() }
        $perRoot[$it.catalog_root] += $line
      }
    }
    Write-Utf8Lines $applyLogPath $log
    Append-Utf8Lines $catalogPath $catalogLines
    $searchMd = @(
      '# _SEARCH.md — how to find a file here',
      '',
      '1. grep `_ai-catalog.jsonl` in this folder: tags, entity, area, doc_type, date, original_name.',
      '2. Search the prefixed filename: `{entity}_{area}_{date}_{doc_type}__{original name}`.',
      '3. Search the original name after `__`; it is unchanged.',
      '',
      'persist values: copied-source-kept (original still at original_path), indexed-in-place (only copy is at original_path), skipped-exists, failed.',
      'Keys, credentials, videos, and installers are never copied here; the catalog points to where they already live.'
    )
    foreach ($root in $perRoot.Keys) {
      New-Item -ItemType Directory -Force -Path $root | Out-Null
      Append-Utf8Lines (Join-Path $root '_ai-catalog.jsonl') $perRoot[$root]
      $sp = Join-Path $root '_SEARCH.md'
      if (-not (Test-Path -LiteralPath $sp)) { Write-Utf8Lines $sp $searchMd }
    }
    Write-Host ("apply done: copied={0} skipped-exists={1} indexed-in-place={2} failed={3} copiedMB={4:N1}" -f $counts['copied-source-kept'], $counts['skipped-exists'], $counts['indexed-in-place'], $counts['failed'], ($copiedBytes / 1MB))
    Write-Host ("log -> {0}`ncatalog -> {1}" -f $applyLogPath, $catalogPath)
    if ($counts['failed'] -gt 0) { exit 2 }
  }
  'verify' {
    if (-not (Test-Path -LiteralPath $inventoryPath)) { throw "inventory.csv missing under $Out" }
    $report = @("verify run $RunStamp")
    $fail = 0
    $checked = 0
    foreach ($r in (Import-Csv -LiteralPath $inventoryPath -Encoding UTF8)) {
      $checked++
      if (-not (Test-Path -LiteralPath $r.path)) { $fail++; $report += "MISSING source: $($r.path)"; continue }
      $len = (Get-Item -LiteralPath $r.path -Force).Length
      if ([string]$len -ne [string]$r.bytes) { $fail++; $report += "RESIZED source: $($r.path) $($r.bytes) -> $len" }
    }
    $report += "sources checked: $checked"
    $copies = 0; $inplace = 0
    if (Test-Path -LiteralPath $catalogPath) {
      foreach ($line in [System.IO.File]::ReadAllLines($catalogPath, [System.Text.Encoding]::UTF8)) {
        if ($line.Trim() -eq '') { continue }
        $o = $line | ConvertFrom-Json
        if ($o.persist -eq 'copied-source-kept') {
          $copies++
          if (-not (Test-Path -LiteralPath $o.canonical_path)) { $fail++; $report += "MISSING copy: $($o.canonical_path)"; continue }
          $h = Get-Sha256 $o.canonical_path
          if ($h -ne $o.sha256) { $fail++; $report += "HASH MISMATCH copy: $($o.canonical_path)" }
        } elseif ($o.persist -eq 'indexed-in-place') {
          $inplace++
          if (-not (Test-Path -LiteralPath $o.original_path)) { $fail++; $report += "MISSING in-place: $($o.original_path)" }
        }
      }
    }
    $report += "copies re-hashed: $copies"
    $report += "in-place files present-checked: $inplace"
    if (Test-Path -LiteralPath $countPath) {
      $cc = 0
      foreach ($r in (Import-Csv -LiteralPath $countPath -Encoding UTF8)) {
        $cc++
        $now = Count-Files $r.folder
        if ([string]$now -ne [string]$r.files) { $fail++; $report += "COUNT CHANGED: $($r.folder) $($r.files) -> $now" }
      }
      $report += "count-only folders rechecked: $cc"
    }
    $report += "failures: $fail"
    $report += $(if ($fail -eq 0) { 'RESULT: PASS - every source present, every copy hash-equal, media counts unchanged' } else { 'RESULT: FAIL' })
    Write-Utf8Lines $verifyPath $report
    $report | ForEach-Object { Write-Host $_ }
    if ($fail -gt 0) { exit 1 }
  }
}
