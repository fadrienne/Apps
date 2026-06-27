---
description: "Freeform capture — classify and route content to the right vault notes"
---

# Freeform Dump

Process: $ARGUMENTS

For each piece of content:

1. **Classify** — decision / incident / 1:1 / win / architecture / project update / person context / work note
2. **Search** existing notes to avoid duplication (grep for key terms, check work/active/)
3. **Route** to the correct note and folder:
   - Decision → `brain/Key Decisions.md` + source work note
   - Incident → `work/incidents/` with full frontmatter
   - 1:1 → `work/1-1/` with participant and date
   - Win → current quarter brag note in `perf/brag/`
   - Architecture → `reference/` or `work/active/`
   - Project update → existing or new `work/active/` note
   - Person context → `org/people/` note
4. **Create or update** notes with proper YAML frontmatter, wikilinks, folder placement
5. **Update indexes** — `work/Index.md`, `brain/Memories.md`, `perf/Brag Doc.md` as needed
6. **Summarize** — what was captured and where it landed

Follow all conventions in `CLAUDE.md`. Every note needs frontmatter and at least one `[[wikilink]]`.
