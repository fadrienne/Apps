---
description: "Import content from an existing vault — detect version, classify, transform, rebuild indexes"
---

# Vault Upgrade / Import

Source: $ARGUMENTS

Provide path to source vault or `--dry-run` to preview without changes.

## Detection

Read source vault structure. Check `vault-manifest.json` version fingerprints to detect obsidian-mind version (v1–v6). If no manifest, treat as arbitrary Obsidian vault.

## Classification

For each source file, determine action:
- **COPY** — user content that doesn't exist in target
- **REPLACE** — scaffold files (North Star, Memories, etc.) if source has real content
- **MERGE** — index files (work/Index.md, Brag Doc) — append source entries
- **SKIP** — infrastructure files (CLAUDE.md stays as target's version)
- **CONFIG** — .claude/, .codex/, .gemini/ — show diff, user decides
- **CLASSIFY** — ambiguous files — present for user to route manually

## Plan Presentation

Before executing: show file counts by action type, list conflicts, estimate impact. User approves.

## Execution (via `vault-migrator` subagent)

- Transform frontmatter to match current schema
- Convert markdown links `[text](path)` to wikilinks `[[Note Name]]`
- Move files to correct folders per `CLAUDE.md` placement rules
- Rebuild `Obsidian Mind/work/Index.md`, `Obsidian Mind/brain/Memories.md`, `Obsidian Mind/perf/Brag Doc.md`
- Generate migration log at `Obsidian Mind/thinking/migration-<YYYY-MM-DD>.md`

## Constraints

- Source vault is **never modified** — all operations are read-only on source
- Binary files (images, PDFs) are copied to preserve embedded references
- `CLAUDE.md` from source is never copied — target's version is authoritative
- Run `/om-vault-audit` after migration to catch any remaining issues
