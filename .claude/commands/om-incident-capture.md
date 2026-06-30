---
description: "Capture incident from Slack into structured vault notes — timeline, people, analysis, brag entry"
---

# Incident Capture

Incident: $ARGUMENTS

Provide Slack channel URLs, ticket links, or paste messages directly.

## Workflow

1. **Invoke `slack-archaeologist`** — reconstruct the full timeline from Slack. Every message, thread, reaction that's relevant. Produce unified timeline with attribution.

2. **Invoke `people-profiler`** — create or update `Obsidian Mind/org/people/` notes for everyone involved.

3. **Create incident note** at `Obsidian Mind/work/incidents/<ticket>-<slug>.md`:

```yaml
---
date: "<incident start date>"
description: "<one-line summary>"
tags:
  - work-note
  - incident
status: completed
quarter: "<quarter>"
ticket: "<ticket ID>"
severity: "<sev1|sev2|sev3>"
role: "<responder|lead|reviewer|communicator>"
---
```

4. **Structure the note**:
   - **Timeline** — chronological events with timestamps and actors
   - **Root Cause** — what actually happened
   - **Detection** — how was it found, how long until detection
   - **Response** — what was done, in what order
   - **Impact** — user/revenue/system impact
   - **Resolution** — what fixed it
   - **Action Items** — post-incident work with owners
   - **Lessons Learned** — what to do differently
   - **Related** — wikilinks to people, projects, competencies

5. **Create brag entry** — add to current quarter brag note with competency links (e.g. `[[Incident Response]]`, `[[Technical Leadership]]`).

6. **Update `Obsidian Mind/work/Index.md`** — add to Incidents section.
