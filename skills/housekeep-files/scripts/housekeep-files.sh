#!/usr/bin/env bash
#
# FILE: housekeep-files.sh
# PURPOSE: Copy-not-move document organizer with a hash inventory, dry run,
#          labeled copies, a JSONL catalog, and a verify gate. macOS/Linux twin
#          of housekeep-files.ps1 (same plan.tsv, same outputs).
#
# OVERVIEW:
# - inventory : sha256 + size of every source file -> work/inventory.csv;
#               file counts of count-only folders -> work/count-only.csv
# - dry-run   : work/preview.tsv with the action per file; no disk change
# - apply     : cp only when the destination is absent, hash the copy, append
#               _ai-catalog.jsonl at each catalog_root and work/catalog.jsonl,
#               write apply-log.tsv. Never deletes.
# - verify    : every inventory path exists at the same size, every copy
#               re-hashes equal, every in-place file exists, count-only counts
#               unchanged. Exit 1 on the first failure. -> work/verify-report.txt
#
# DEPENDENCIES: bash 3.2+, find, cp, stat, and shasum or sha256sum.
#
# USAGE:
#   housekeep-files.sh inventory plan.tsv work count-only.txt
#   housekeep-files.sh dry-run   plan.tsv work
#   housekeep-files.sh apply     plan.tsv work
#   housekeep-files.sh verify    plan.tsv work count-only.txt
#   MAX_MB=200 MAX_PATH=200 override the caps.
#
# NOTES:
# - No rm, mv, or rsync --delete anywhere in this file by design.
# - plan.tsv is tab-separated so paths may contain commas, spaces, and CJK.
#
set -u
MODE="${1:-}"; PLAN="${2:-}"; OUT="${3:-}"; COUNT_ONLY="${4:-}"
MAX_MB="${MAX_MB:-200}"; MAX_PATH="${MAX_PATH:-200}"
[ -n "$MODE" ] && [ -n "$PLAN" ] && [ -n "$OUT" ] || { echo "usage: $0 inventory|dry-run|apply|verify plan.tsv work [count-only.txt]" >&2; exit 64; }
case "$MODE" in inventory|dry-run|apply|verify) ;; *) echo "unknown mode $MODE" >&2; exit 64;; esac

mkdir -p "$OUT"
INV="$OUT/inventory.csv"; CNT="$OUT/count-only.csv"; PREVIEW="$OUT/preview.tsv"
CATALOG="$OUT/catalog.jsonl"; APPLYLOG="$OUT/apply-log.tsv"; VERIFY="$OUT/verify-report.txt"
RUN="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DOC_EXT=" pdf doc docx xls xlsx xlsm ppt pptx csv txt md html htm xtx xml data zip jpg jpeg png heic svg gif webp rtf odt ods eml msg "
SECRET_RE='credential|keystore|\.p8$|\.p12$|\.pem$|\.key$|\.jks$|mobileprovision|\.cer$|\.der$|certsigningrequest|\.b64$|service-account|client_secret|google-services\.json|googleservice-info|oauth|private-key|backup_code|\.env$|play-publisher|apple-credentials|env-backups|recovery|2fa|mfa|totp|アクセスキー'

if command -v sha256sum >/dev/null 2>&1; then sha() { sha256sum "$1" | awk '{print $1}'; }
elif command -v shasum >/dev/null 2>&1; then sha() { shasum -a 256 "$1" | awk '{print $1}'; }
else echo "need sha256sum or shasum" >&2; exit 69; fi
if stat -f%z / >/dev/null 2>&1; then fsize() { stat -f%z "$1"; }; else fsize() { stat -c%s "$1"; }; fi
lower() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]'; }
json_esc() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\t/\\t/g'; }
count_files() { [ -d "$1" ] || { echo -1; return; }; find "$1" -type f | wc -l | tr -d ' '; }

date_token() {  # $1 name, $2 parent name
  local c y m d
  for c in "$1" "$2"; do
    [ -n "$c" ] || continue
    if [[ "$c" =~ (20[0-9]{2})[-_.]?([0-9]{2})[-_.]?([0-9]{2}) ]]; then
      y="${BASH_REMATCH[1]}"; m="${BASH_REMATCH[2]}"; d="${BASH_REMATCH[3]}"
      if [ "$m" -ge 1 ] && [ "$m" -le 12 ] && [ "$d" -ge 1 ] && [ "$d" -le 31 ]; then echo "$y-$m-$d"; return; fi
    fi
    if [[ "$c" =~ (20[0-9]{2})[-_]?([0-9]{2}) ]]; then
      y="${BASH_REMATCH[1]}"; m="${BASH_REMATCH[2]}"
      if [ "$m" -ge 1 ] && [ "$m" -le 12 ]; then echo "$y-$m"; return; fi
    fi
  done
  echo undated
}

# Expand plan into per-file item lines:
# action|reason|source|destDir|newName|entity|area|project|doc_type|date|tags|catalog_root|bytes joined by \037 (unit separator).
# Tab is whitespace to read(1) and collapses empty columns, so plan.tsv is re-separated with \037 first.
expand_plan() {
  local header=1 source destination entity area project doc_type tags prefix catalog_root
  while IFS=$'\037' read -r source destination entity area project doc_type tags prefix catalog_root _rest; do
    if [ $header -eq 1 ]; then header=0; continue; fi
    [ -n "$source" ] || continue
    case "$source" in \#*) continue;; esac
    if [ ! -e "$source" ]; then echo "plan source missing, skipped: $source" >&2; continue; fi
    local files
    if [ -d "$source" ]; then files=$(find "$source" -type f); else files="$source"; fi
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      local name rel destDir relDir lp ext action reason bytes date newName cand
      name="$(basename "$f")"
      if [ -d "$source" ]; then rel="${f#"$source"/}"; else rel="$name"; fi
      destDir="$destination"; relDir="$(dirname "$rel")"
      [ "$relDir" != "." ] && destDir="$destination/$relDir"
      lp="$(lower "$f")"; ext="$(lower "${name##*.}")"; [ "$ext" = "$(lower "$name")" ] && ext=""
      bytes="$(fsize "$f")"
      action=copy; reason=""
      if printf '%s' "$lp" | grep -Eq "$SECRET_RE"; then action=indexed-in-place; reason=secret
      elif [[ "$DOC_EXT" != *" $ext "* ]]; then action=indexed-in-place; reason=ext
      elif [ "$bytes" -gt $((MAX_MB * 1024 * 1024)) ]; then action=indexed-in-place; reason=size; fi
      date="$(date_token "$name" "$(basename "$(dirname "$f")")")"
      newName="$name"
      if [ "$action" = copy ] && [ "$prefix" = yes ]; then
        if ! [[ "$name" =~ ^(20[0-9]{6}|20[0-9]{2}-[0-9]{2}|20[0-9]{2}_) ]] && [[ "$name" != "${entity}_"* ]]; then
          cand="${entity}_${area}_${date}_${doc_type}__${name}"
          [ ${#destDir} -le $((MAX_PATH - ${#cand} - 1)) ] && newName="$cand"
        fi
      fi
      printf '%s\037%s\037%s\037%s\037%s\037%s\037%s\037%s\037%s\037%s\037%s\037%s\037%s\n' \
        "$action" "$reason" "$f" "$destDir" "$newName" "$entity" "$area" "$project" "$doc_type" "$date" "$tags" "$catalog_root" "$bytes"
    done <<< "$files"
  done < <(tr -d '\r' < "$PLAN" | tr '\t' '\037')
}

catalog_line() { # args: entity area project doc_type date tags source name canonical bytes sha persist reason
  local t tags_json="" first=1
  IFS=',' read -ra _tags <<< "$6"
  for t in "${_tags[@]}"; do t="$(printf '%s' "$t" | sed 's/^ *//;s/ *$//')"; [ -n "$t" ] || continue
    [ $first -eq 1 ] || tags_json+=","; first=0; tags_json+="\"$(json_esc "$t")\""; done
  printf '{"run":"%s","entity":"%s","area":"%s","project":"%s","doc_type":"%s","date":"%s","tags":[%s],"original_path":"%s","original_name":"%s","canonical_path":"%s","bytes":%s,"sha256":"%s","persist":"%s","reason":"%s"}\n' \
    "$RUN" "$(json_esc "$1")" "$(json_esc "$2")" "$(json_esc "$3")" "$(json_esc "$4")" "$5" "$tags_json" \
    "$(json_esc "$7")" "$(json_esc "$8")" "$(json_esc "$9")" "${10}" "${11}" "${12}" "$(json_esc "${13}")"
}

read_count_only() { [ -n "$COUNT_ONLY" ] && [ -f "$COUNT_ONLY" ] && grep -v '^[[:space:]]*#' "$COUNT_ONLY" | grep -v '^[[:space:]]*$' || true; }

case "$MODE" in
inventory)
  echo "path,bytes,sha256" > "$INV"; n=0
  while IFS=$'\037' read -r action reason src destDir newName entity area project doc_type date tags croot bytes; do
    n=$((n+1)); [ $((n % 50)) -eq 0 ] && echo "hashing $n"
    # Hash only what will be copied; in-place items are size-checked so a streaming drive is not forced to download them.
    h=""; [ "$action" = copy ] && h="$(sha "$src")"
    printf '"%s",%s,%s\n' "${src//\"/\"\"}" "$bytes" "$h" >> "$INV"
  done < <(expand_plan)
  echo "folder,files" > "$CNT"
  while IFS= read -r folder; do printf '"%s",%s\n' "${folder//\"/\"\"}" "$(count_files "$folder")" >> "$CNT"; done < <(read_count_only)
  echo "inventory: $n files -> $INV; count-only -> $CNT"
  ;;
dry-run)
  printf 'action\treason\tsource\tdestination\tnew_name\tentity\tarea\tproject\tdoc_type\tdate\ttags\n' > "$PREVIEW"
  while IFS=$'\037' read -r action reason src destDir newName entity area project doc_type date tags croot bytes; do
    [ "$action" = copy ] && [ -e "$destDir/$newName" ] && action=skipped-exists
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$action" "$reason" "$src" "$destDir" "$newName" "$entity" "$area" "$project" "$doc_type" "$date" "$tags" >> "$PREVIEW"
  done < <(expand_plan)
  echo "preview -> $PREVIEW"; tail -n +2 "$PREVIEW" | awk -F'\t' '{k=$1; if($2!="")k=k":"$2; c[k]++} END{for(k in c) printf "  %-24s %d\n",k,c[k]}'
  ;;
apply)
  [ -f "$INV" ] || { echo "inventory.csv missing under $OUT — run inventory first" >&2; exit 65; }
  printf 'action\tsource\tcanonical\tbytes\tsha256\n' > "$APPLYLOG"
  copied=0 skipped=0 inplace=0 failed=0 copiedBytes=0 n=0
  while IFS=$'\037' read -r action reason src destDir newName entity area project doc_type date tags croot bytes; do
    n=$((n+1)); [ $((n % 50)) -eq 0 ] && echo "apply $n"
    esc="${src//\"/\"\"}"
    inv_line="$(grep -F -- "\"$esc\",$bytes," "$INV" | head -1)"
    [ -n "$inv_line" ] || { echo "source not in inventory (plan changed after inventory?): $src" >&2; exit 65; }
    sha_src="${inv_line##*,}"   # empty for in-place items, which are never hashed
    canonical="$destDir/$newName"; persist=""
    if [ "$action" = indexed-in-place ]; then persist=indexed-in-place; canonical="$src"; inplace=$((inplace+1))
    elif [ -e "$canonical" ]; then persist=skipped-exists; skipped=$((skipped+1))
    else
      mkdir -p "$destDir"
      if cp -p "$src" "$canonical" 2>/dev/null && [ "$(sha "$canonical")" = "$sha_src" ]; then
        persist=copied-source-kept; copied=$((copied+1)); copiedBytes=$((copiedBytes+bytes))
      else persist=failed; reason=copy-or-hash-error; failed=$((failed+1)); fi
    fi
    printf '%s\t%s\t%s\t%s\t%s\n' "$persist" "$src" "$canonical" "$bytes" "$sha_src" >> "$APPLYLOG"
    line="$(catalog_line "$entity" "$area" "$project" "$doc_type" "$date" "$tags" "$src" "$(basename "$src")" "$canonical" "$bytes" "$sha_src" "$persist" "$reason")"
    printf '%s\n' "$line" >> "$CATALOG"
    if [ -n "$croot" ]; then
      mkdir -p "$croot"; printf '%s\n' "$line" >> "$croot/_ai-catalog.jsonl"
      if [ ! -f "$croot/_SEARCH.md" ]; then cat > "$croot/_SEARCH.md" <<'EOF'
# _SEARCH.md — how to find a file here

1. grep `_ai-catalog.jsonl` in this folder: tags, entity, area, doc_type, date, original_name.
2. Search the prefixed filename: `{entity}_{area}_{date}_{doc_type}__{original name}`.
3. Search the original name after `__`; it is unchanged.

persist values: copied-source-kept (original still at original_path), indexed-in-place (only copy is at original_path), skipped-exists, failed.
Keys, credentials, videos, and installers are never copied here; the catalog points to where they already live.
EOF
      fi
    fi
  done < <(expand_plan)
  echo "apply done: copied=$copied skipped-exists=$skipped indexed-in-place=$inplace failed=$failed copiedMB=$((copiedBytes / 1048576))"
  echo "log -> $APPLYLOG"; echo "catalog -> $CATALOG"
  [ "$failed" -eq 0 ] || exit 2
  ;;
verify)
  [ -f "$INV" ] || { echo "inventory.csv missing under $OUT" >&2; exit 65; }
  : > "$VERIFY"; fail=0; checked=0; copies=0; inplace=0
  echo "verify run $RUN" >> "$VERIFY"
  while IFS= read -r row; do
    p="$(printf '%s' "$row" | sed -E 's/^"(.*)",[0-9]+,[0-9a-f]*$/\1/' | sed 's/""/"/g')"
    b="$(printf '%s' "$row" | sed -E 's/^".*",([0-9]+),[0-9a-f]*$/\1/')"
    checked=$((checked+1))
    if [ ! -e "$p" ]; then fail=$((fail+1)); echo "MISSING source: $p" >> "$VERIFY"
    elif [ "$(fsize "$p")" != "$b" ]; then fail=$((fail+1)); echo "RESIZED source: $p" >> "$VERIFY"; fi
  done < <(tail -n +2 "$INV")
  echo "sources checked: $checked" >> "$VERIFY"
  if [ -f "$CATALOG" ]; then
    while IFS= read -r line; do
      persist="$(printf '%s' "$line" | sed -E 's/.*"persist":"([^"]*)".*/\1/')"
      if [ "$persist" = copied-source-kept ]; then
        copies=$((copies+1))
        c="$(printf '%s' "$line" | sed -E 's/.*"canonical_path":"((\\"|[^"])*)".*/\1/' | sed 's/\\"/"/g;s/\\\\/\\/g')"
        h="$(printf '%s' "$line" | sed -E 's/.*"sha256":"([^"]*)".*/\1/')"
        if [ ! -e "$c" ]; then fail=$((fail+1)); echo "MISSING copy: $c" >> "$VERIFY"
        elif [ "$(sha "$c")" != "$h" ]; then fail=$((fail+1)); echo "HASH MISMATCH copy: $c" >> "$VERIFY"; fi
      elif [ "$persist" = indexed-in-place ]; then
        inplace=$((inplace+1))
        o="$(printf '%s' "$line" | sed -E 's/.*"original_path":"((\\"|[^"])*)".*/\1/' | sed 's/\\"/"/g;s/\\\\/\\/g')"
        [ -e "$o" ] || { fail=$((fail+1)); echo "MISSING in-place: $o" >> "$VERIFY"; }
      fi
    done < "$CATALOG"
  fi
  echo "copies re-hashed: $copies" >> "$VERIFY"; echo "in-place files present-checked: $inplace" >> "$VERIFY"
  if [ -f "$CNT" ]; then cc=0
    while IFS= read -r row; do
      folder="$(printf '%s' "$row" | sed -E 's/^"(.*)",-?[0-9]+$/\1/' | sed 's/""/"/g')"
      was="$(printf '%s' "$row" | sed -E 's/^".*",(-?[0-9]+)$/\1/')"
      cc=$((cc+1)); now="$(count_files "$folder")"
      [ "$now" = "$was" ] || { fail=$((fail+1)); echo "COUNT CHANGED: $folder $was -> $now" >> "$VERIFY"; }
    done < <(tail -n +2 "$CNT")
    echo "count-only folders rechecked: $cc" >> "$VERIFY"
  fi
  echo "failures: $fail" >> "$VERIFY"
  if [ "$fail" -eq 0 ]; then echo "RESULT: PASS - every source present, every copy hash-equal, media counts unchanged" >> "$VERIFY"; else echo "RESULT: FAIL" >> "$VERIFY"; fi
  cat "$VERIFY"; [ "$fail" -eq 0 ] || exit 1
  ;;
esac
