---
description: "Process meeting notes inbox — classify raw exports in work/meetings/ and route to vault notes"
---

# Meeting Notes Intake

Process all unprocessed files in `work/meetings/`.

## Workflow

1. **Discover** — glob `work/meetings/` for any `.md`, `.txt`, or `.json` files not yet processed.

2. **For each file**, classify:
   - **1:1** → route to `/om-capture-1on1 <participant>`
   - **Team meeting / standup** → create or update the relevant `work/active/` project note
   - **Incident review / postmortem** → route to `/om-incident-capture`
   - **Design review / RFC** → create note in `reference/` or `work/active/`
   - **All-hands / org update** → update `org/People & Context.md` or `org/teams/`
   - **Interview / hiring** → update relevant `org/people/` or create new

3. **Transform** each file:
   - Add proper frontmatter
   - Convert to wikilinks where people/projects are mentioned by name
   - Extract action items as `- [ ]` checkboxes
   - Extract decisions and route to `brain/Key Decisions.md`

4. **Archive** the source file to `work/meetings/processed/` after routing.

5. **Safety**: never delete source files — only copy/move to processed/. If classification is unclear, ask before routing.

6. **Summary**: report what was processed, where it landed, and any files needing manual review.
