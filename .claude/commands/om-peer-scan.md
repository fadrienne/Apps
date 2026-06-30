---
description: "Deep scan a peer's GitHub PRs for review prep — structured analysis saved to perf/evidence/"
---

# Peer PR Scan

Peer: $ARGUMENTS

Provide GitHub username and optionally a date range (e.g. `@alice since:2026-01-01`).

## Workflow

1. **Fetch PR list** — use GitHub API or gh CLI to list all PRs authored or reviewed by this peer in the specified period.

2. **For each PR, analyze**:
   - **Scope and complexity** — size, files changed, systems touched
   - **Technical quality** — architecture decisions, patterns used, edge cases handled
   - **Review behavior** (if they reviewed) — depth of feedback, issues caught, communication style
   - **Collaboration signals** — responsiveness, iteration speed, how they handled pushback
   - **Impact** — what shipped, what broke, what they unblocked

3. **Map to competencies** — for each observation, note which competency it demonstrates.

4. **Look for leadership signals** — did they mentor others in PR comments? Did they push back on risky changes? Did they go beyond the task?

5. **Save evidence** to `Obsidian Mind/perf/evidence/<peer>-prs-<YYYY-MM-DD>.md` with:
   - PR links as sources
   - Direct quotes from PR descriptions/comments (max 125 chars)
   - Competency mapping table

6. **Summary**: top 3 strengths with evidence, 1–2 growth areas, overall assessment.

Best run in parallel: one `/om-peer-scan` per person, then `/om-slack-scan` to add communication evidence.
