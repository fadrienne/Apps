---
description: "Move completed project from work/active/ to work/archive/YYYY/, update all indexes"
---

# Project Archive

Project: $ARGUMENTS

## Workflow

1. **Locate the note** — find `Obsidian Mind/work/active/<project>.md`. If ambiguous, list matches and ask user to confirm.

2. **Verify it's done** — check `status` field. If not `completed`, ask for confirmation before archiving.

3. **Determine year** — use the note's `date` field or today's date for the archive folder.

4. **Move** — copy to `Obsidian Mind/work/archive/<YYYY>/<project>.md`, update `status: archived`.

5. **Update indexes**:
   - `Obsidian Mind/work/Index.md` — move from Active to Completed (under correct quarter), update status
   - Check `Obsidian Mind/perf/Brag Doc.md` — if project had wins, ensure they're still linked

6. **Check related notes** — find all notes that link to this project. Update any that reference it as "active" work.

7. **Git commit** — stage the move and index updates together.

8. **Confirm** — report: what moved, where it landed, what was updated.

## Safety

- Never delete the source note before confirming the archive copy exists
- Never archive without user confirmation if status is not `completed`
- If wikilinks break due to the path change, flag them (Obsidian resolves by filename, not path, so links usually survive)
