# Naming, catalog schema, and sources

## Filename label

Applied only to a copied file whose row has `prefix=yes` and whose name
does not already start with a date (`20YYMMDD`, `20YY-MM`, `20YY_`) or an
entity token. The original name is kept after `__`.

```
{entity}_{area}_{yyyy-mm-dd|yyyy-mm|undated}_{doc-type}__{original-file-name}
```

| Slot | Values |
|---|---|
| entity | short ASCII per legal entity or person, e.g. `acme-uk`, `acme-sg`, `personal` |
| area | `company`, `finance`, `product`, `client`, `site`, `tax`, `identity`, `job`, `family`, `inbox` |
| doc-type | `invoice`, `receipt`, `tax-return`, `payroll`, `contract`, `insurance`, `registration`, `lease`, `cv`, `seal`, `brand`, `plan`, `correspondence`, `statement`, `other` |
| date | from the filename, else the parent folder name, else `undated` |

Skip the prefix when the new full path would exceed the length cap
(default 200 characters). Windows tools misbehave near 260; a synced drive
adds its own folder depth on the other machine.

Never rename inside an app or build folder: `google-services.json`,
`assetlinks.json`, provisioning profiles, keystores are read by name.

## What is never copied (indexed in place)

| Reason | Rule |
|---|---|
| `secret` | path matches `credential`, `keystore`, `.p8`, `.p12`, `.pem`, `.key`, `.jks`, `mobileprovision`, `.cer`, `.der`, `certsigningrequest`, `.b64`, `service-account`, `client_secret`, `google-services.json`, `googleservice-info`, `oauth`, `private-key`, `backup_code`, `.env`, `play-publisher`, `apple-credentials`, `env-backups`, `アクセスキー` |
| `ext` | extension outside the document allowlist: `pdf doc docx xls xlsx xlsm ppt pptx csv txt md html htm xtx xml data zip jpg jpeg png heic svg gif webp rtf odt ods eml msg` |
| `size` | larger than the cap (default 200 MB) |

A second copy of a signing key is a second thing to rotate. A video is a
Drive upload the human did not ask for. Both still get a catalog line so
search finds where they already live.

## Catalog line (`_ai-catalog.jsonl`, one JSON object per line)

```json
{"run":"2026-01-15T03:40:12Z","entity":"acme-uk","area":"company","project":"","doc_type":"registration",
 "date":"undated","tags":["acme","companies-house","incorporation"],
 "original_path":"D:\\Drive\\Old Mixed Folder\\Form 9 - Certificate.pdf",
 "original_name":"Form 9 - Certificate.pdf",
 "canonical_path":"D:\\Drive\\Acme_UK\\00_company\\acme-uk_company_undated_registration__Form 9 - Certificate.pdf",
 "bytes":80123,"sha256":"…","persist":"copied-source-kept","reason":""}
```

`persist` ∈ `copied-source-kept` | `indexed-in-place` | `skipped-exists` |
`failed`. The catalog stores paths and labels only; never file contents,
account numbers, or key material.

`_SEARCH.md` at each root tells a later agent: grep `_ai-catalog.jsonl`
first, then the prefixed filename, then the original name after `__`.

## Verify report

`verify` fails on the first of: an inventory path missing or resized, a
copy whose SHA-256 differs from the inventory, an in-place row whose file
is gone, a count-only folder whose file count changed. The report lists
each check with its count and the first offending path.

## Sources

- Multi-entity bookkeeping keeps one set of books per legal entity —
  numetix.ai, "Multi-Entity Accounting for Service Firms".
- Drive structure two to three levels deep, date-first names, quarterly
  archive rather than delete — drdaveheath.com, "Google Drive folder
  structure best practices (2026 guide)".
- Johnny.Decimal caps each level at ten and freezes IDs — johnnydecimal.com
  documentation; its forum's official stance is not to mix it with PARA.
- Drive custom properties are API metadata capped at 124 bytes per
  property, not files — developers.google.com Drive API "Add custom file
  properties".
- Tags embedded in filenames survive Dropbox and Google Drive sync; hidden
  sidecar folders may not — docs.tagspaces.org "Organizing Files and
  Folders with Tags".
- Do not use robocopy `/MOV` or `/MIR` when avoiding data loss; robocopy
  does not verify the copy by hash — learn.microsoft.com "Use Robocopy to
  Preseed Files for DFS Replication".
- Moving a folder inside My Drive keeps the file ID and share links;
  inherited permissions change — Google Workspace Admin Help, "Moving
  content from Drive shared folders".
