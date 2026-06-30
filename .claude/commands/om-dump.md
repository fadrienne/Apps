---
description: "Freeform capture — classify and route content to the right vault notes"
---

# Freeform Dump

Process: $ARGUMENTS

For each piece of content:

1. **Classify** — decision / incident / 1:1 / win / architecture / project update / person context / work note
2. **Search** existing notes to avoid duplication (grep for key terms, check work/active/)
3. **Route** to the correct note and folder:
   - Decision → `Obsidian Mind/brain/Key Decisions.md` + source work note
   - Incident → `Obsidian Mind/work/incidents/` with full frontmatter
   - 1:1 → `Obsidian Mind/work/1-1/` with participant and date
   - Win → current quarter brag note in `Obsidian Mind/perf/brag/`
   - Architecture → `Obsidian Mind/reference/` or `Obsidian Mind/work/active/`
   - Project update → existing or new `Obsidian Mind/work/active/` note
   - Person context → `Obsidian Mind/org/people/` note
4. **Create or update** notes with proper YAML frontmatter, wikilinks, folder placement
5. **Update indexes** — `Obsidian Mind/work/Index.md`, `Obsidian Mind/brain/Memories.md`, `Obsidian Mind/perf/Brag Doc.md` as needed
6. **Summarize** — what was captured and where it landed

Follow all conventions in `CLAUDE.md`. Every note needs frontmatter and at least one `[[wikilink]]`.
