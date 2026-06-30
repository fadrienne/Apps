---
description: "Write peer review from vault data — projects, principles, performance summary"
---

# Peer Review Writer

Peer: $ARGUMENTS

## Process

1. **Load evidence** — read `Obsidian Mind/perf/evidence/<peer>-*.md`, any `Obsidian Mind/work/1-1/` notes with this person, `Obsidian Mind/org/people/<peer>.md`, and relevant work notes where they're mentioned.

2. **Structure by projects** — organize observations around shared work:
   - What the project was
   - Their specific contributions
   - Impact and quality of their work
   - How they collaborated

3. **Principles/values** — concrete examples of how they demonstrated company values. Specific, behavioral.

4. **Performance narrative** — overall assessment with 2–3 strengths backed by evidence and 1 growth area framed constructively.

5. **Calibration** — be honest and specific. Vague praise is useless in calibration. Specific evidence is what managers use.

6. **Invoke `review-fact-checker`** — verify all claims against vault sources before submitting.

## Tone Rules

- Casual framing to "jog their memory" is fine for context-setting
- Specific > general: "she caught the N+1 query in the payment service PR" > "she gives good reviews"
- Frame growth areas as opportunities, not criticisms
- First person: "I observed...", "In our work on..."

## Never Include

- Sensitive information from 1:1 conversations
- Interpersonal conflict details
- Comparisons to other peers
- Anything that could identify the reviewer

Save draft to `perf/<cycle>/peer-review-<peer>.md`.
