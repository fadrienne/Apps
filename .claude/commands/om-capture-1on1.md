---
description: "Capture 1:1 transcript into a structured vault note with quotes, action items, DM context"
---

# Capture 1:1 Meeting

Participant: $ARGUMENTS

User will paste transcript, notes, or summary.

## Workflow

1. **Parse the input** — handle transcripts, raw notes, or summaries.

2. **Create work note** at `Obsidian Mind/work/1-1/<Participant> <YYYY-MM-DD>.md`:

```yaml
---
date: "<meeting date>"
description: "<one-line summary of key topics discussed>"
tags:
  - work-note
  - 1-1
status: completed
quarter: "<current quarter>"
---
```

3. **Structure the note**:
   - **Key Takeaways** — bullet points grouped by topic
   - **Decisions Made** — anything agreed upon
   - **Action Items** — checkboxes, with owner for each
   - **Quotes Worth Noting** — direct quotes in blockquotes (max 125 chars each)
   - **What Went Well** — what landed, what resonated
   - **What to Watch** — concerns, ambiguous signals to monitor
   - **Context From DMs** — color from DMs before/after (ask for channel IDs if needed)
   - **Related** — wikilinks to relevant notes, people, projects, competencies

4. **Update related notes**:
   - `Obsidian Mind/org/people/<participant>.md` — add or update 1:1 section
   - `Obsidian Mind/work/Index.md` — add to appropriate section
   - `Obsidian Mind/brain/Memories.md` if any context changed (manager dynamics, priorities)

5. **Check for stale context** — if the meeting contradicts existing vault notes, flag and update.

Preserve the conversational tone. Separate what was SAID from what it MEANS — interpretation goes in "What to Watch".
