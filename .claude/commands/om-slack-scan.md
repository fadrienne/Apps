---
description: "Deep scan Slack channels/DMs for evidence — extracts timestamped touchpoints, organizes by context"
---

# Slack Scan

Channels / context: $ARGUMENTS

Provide Slack channel URLs, DM links, or describe what to search for.

## Workflow

1. **Invoke `slack-archaeologist`** — read every message and thread in the specified channels. Full reconstruction, no summarization at this stage.

2. **Extract evidence by category**:
   - **Technical contributions** — PRs mentioned, designs proposed, reviews given, bugs fixed
   - **Leadership moments** — decisions made, people unblocked, cross-team coordination
   - **Communication** — incident comms, status updates, documentation
   - **Collaboration** — helping others, pair work, knowledge sharing
   - **Feedback received** — praise, criticism, recognition from peers/managers

3. **Organize by person** (for peer review) or by project/competency (for self-review).

4. **Produce structured output**:
   - Timestamped touchpoints with direct quotes (max 125 chars)
   - Evidence mapped to competencies
   - People involved with their contributions
   - Open questions or gaps to follow up on

5. **Save to** `thinking/slack-scan-<YYYY-MM-DD>-<context>.md` — transient, link to evidence notes.

Instruct: after running this, use `/om-peer-scan` for GitHub evidence, then merge both for a complete picture.
