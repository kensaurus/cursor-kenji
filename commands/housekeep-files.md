---
description: "Organize a document tree by copy-not-move: hash inventory, dry run, labeled copies, search catalog, verify every source survived"
argument-hint: "[source folders] [destination root]"
disable-model-invocation: true
---

# Housekeep Files

Run the **`housekeep-files`** skill on the folders named in the argument
(default: ask which Downloads / cloud-drive folders are in scope).

1. Inventory the top two levels and offer the layout options (root per
   owner, one root with owners inside, PARA-lite); wait for the choice.
2. Write `plan.tsv` and `count-only.txt`; run `inventory`, then `dry-run`;
   show the preview counts and any `indexed-in-place:secret` rows.
3. On approval run `apply`, then `verify`; report the verify exit code and
   the storage added.

Copies only. Nothing is moved or deleted; retiring the originals is a
later, human-run step. Repository cleanup stays on `workflow-housekeep`.

The full playbook lives in the **`housekeep-files`** skill.
