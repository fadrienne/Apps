---
description: "Generate review brief (manager or peers version) from vault data"
---

# Generate Review Brief

Audience: $ARGUMENTS (manager | peers)
Period: current review cycle (infer from brag notes if not specified)

## Invoke `review-prep` subagent

The subagent aggregates all evidence and produces a structured brief in `perf/<cycle>/`.

## Manager Version

Non-technical, outcome-focused. Structure:
- **Narrative Arc** — 2–3 sentences: what you worked on, what changed, what you drove
- **Impact Summary** — table: Project | Outcome | Evidence
- **Project Details** — 3–5 key projects with business impact (not implementation detail)
- **Competency Assessment** — each competency with level and strongest evidence
- **Documentation** — links to work notes, incidents, PRs

Format: Markdown + HTML (blue professional theme).

## Peers Version

Technical, project-focused. Structure:
- **Projects** — what we worked on together, your contributions
- **Collaboration** — how you worked with them specifically
- **Observations** — technical strengths, communication, reliability
- Casual framing to "jog their memory"
- No competency sections

Format: Markdown only.

## Critical Restrictions

**Never include** in shared versions:
- Sensitive interpersonal details from 1:1s
- Peer selection strategy
- Personal strategic notes
- Anything marked private in vault notes

Both private and shared versions must be maintained separately.
