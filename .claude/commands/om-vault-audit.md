---
description: "Structural audit — links, frontmatter, orphans, stale notes, index consistency"
---

# Vault Audit

Run a comprehensive structural audit. Invoke two subagents:
- `vault-librarian` — orphans, broken links, frontmatter, stale active notes
- `cross-linker` — missing wikilinks, bidirectional link gaps

## Audit Areas

1. **Folder Structure** — notes in correct folders per `CLAUDE.md` rules?
2. **Index Files** — `work/Index.md`, `org/People & Context.md`, `perf/Brag Doc.md`, `brain/Memories.md` current?
3. **Frontmatter** — all required fields present per note type?
4. **Duplicate Tags** — repeated entries in tag arrays?
5. **Status Alignment** — `status: completed` notes still in `active/`?
6. **Orphan Detection** — notes with no incoming links?
7. **Link Validation** — broken `[[wikilinks]]`?
8. **Stale Context** — `work/active/` notes unchanged for 60+ days?
9. **Brain/Org Accuracy** — `brain/` and `org/` content still current?
10. **Conceptual Integrity** — notes mixing unrelated topics?

## Constraints

- Fix what can be fixed without risk (broken links, missing tags, duplicate entries)
- **Flag** anything requiring data changes or moves for user approval
- **Never delete** vault content without explicit user confirmation
- **Never create** new notes during audit — only fix existing ones

## Output

Timestamped audit report in `thinking/vault-audit-<YYYY-MM-DD>.md` with:
- Summary stats
- Action items by priority (Fix Now / Fix Later / Informational)
- Specific recommendations with file paths
