# Obsidian Mind — Operating Manual

This vault gives you persistent memory across AI coding agent sessions. Read this file to understand how the vault works, then use the commands and hooks to make it yours.

## Repository Layout

```
Obsidian Mind/  — the personal knowledge vault (open this folder in Obsidian)
  brain/        — persistent knowledge (North Star, Memories, Decisions, Patterns, Gotchas)
  work/         — active projects, archive (by year), incidents, 1:1 notes
  org/          — people directory, team notes, org context
  perf/         — brag doc, quarterly evidence, competency notes
  reference/    — reference docs, runbooks, architecture notes
  thinking/     — Claude's scratchpad (drafts, reasoning, session logs)
  templates/    — note templates for consistent structure
  bases/        — Obsidian Bases (database views)
  .obsidian/    — Obsidian app config

autosci/                — agentic scientific research system
gstack/                 — AI-powered software factory (gstack)
notebooklm/             — Google NotebookLM Python automation
scientific-agent-skills/ — 24 Claude Code skills for research
thrive-hub/             — business metrics dashboard (React/Vite)

.claude/        — Claude Code config: commands, agents, scripts, settings
```

> **Obsidian tip**: open `Obsidian Mind/` as your vault root, not the repo root.

## Core Principles

**Graph-first**: folders enable browsing, wikilinks drive discovery. Every note must link to at least one existing note.

**Frontmatter required**: every vault note needs `date`, `description`, and `tags`. Work notes also need `status` and `quarter`. The PostToolUse hook enforces this.

**Atomic notes**: one concept per note. If a note covers two unrelated things, split it.

**Evidence nodes vs concept nodes**: work notes and incident docs link outward to competencies. Competency notes receive backlinks passively — don't maintain manual evidence lists in them.

## Note Conventions

```yaml
---
date: "YYYY-MM-DD"
description: "One-line summary for search and index display"
tags:
  - work-note   # or: brain, org, perf, incident, 1-1
status: active  # active | completed | archived | on-hold
quarter: "Q2 2026"
---
```

**Wikilinks**: use `[[Note Name]]` for all internal references. Never use markdown links for vault notes. Partial names work: `[[Alice]]` resolves to `Obsidian Mind/org/people/Alice Chen.md`.

**Annotations**: when linking to a competency, annotate: `[[Technical Leadership]] — led cross-team API migration`.

## Slash Commands

Run these from Claude Code or your agent platform:

| Command | What it does |
|---------|-------------|
| `/om-standup` | Morning kickoff — reads North Star, active work, git log, surfaces tasks |
| `/om-dump $ARGUMENTS` | Freeform capture — classifies and routes content to the right notes |
| `/om-wrap-up` | Session review — validates notes, updates indexes, runs brag-spotter |
| `/om-humanize $ARGUMENTS` | Edit a note to sound like you wrote it |
| `/om-weekly` | Weekly synthesis — patterns, North Star alignment, uncaptured wins |
| `/om-prep-1on1 $ARGUMENTS` | Prep brief for a 1:1 |
| `/om-capture-1on1 $ARGUMENTS` | Capture 1:1 transcript into vault |
| `/om-incident-capture $ARGUMENTS` | Capture incident from Slack into vault |
| `/om-slack-scan $ARGUMENTS` | Deep scan Slack channels for evidence |
| `/om-meeting $ARGUMENTS` | Prep brief for any meeting |
| `/om-intake` | Process raw meeting notes from `Obsidian Mind/work/meetings/` |
| `/om-peer-scan $ARGUMENTS` | Scan a peer's GitHub PRs for review evidence |
| `/om-review-brief $ARGUMENTS` | Generate review brief (manager or peers version) |
| `/om-self-review` | Write self-assessment from vault data |
| `/om-review-peer $ARGUMENTS` | Write peer review from vault data |
| `/om-vault-audit` | Structural audit — links, frontmatter, orphans, stale notes |
| `/om-vault-upgrade $ARGUMENTS` | Import content from an existing vault |
| `/om-project-archive $ARGUMENTS` | Move project from active/ to archive/YYYY/ |

## Hooks

Hooks run automatically — no action needed.

| Hook | Trigger | What happens |
|------|---------|-------------|
| **SessionStart** | Startup/resume/clear/compact | Injects date, North Star excerpt, brain topics, recent git changes, open tasks, active work listing, vault file listing |
| **UserPromptSubmit** | Every message | Classifies content (decision / incident / 1:1 / win / architecture / person / project) and injects routing hints |
| **PostToolUse** | After Write/Edit on `.md` | Validates frontmatter completeness and checks for wikilinks |
| **PreCompact** | Before context compaction | Backs up session transcript to `Obsidian Mind/thinking/session-logs/` |
| **Stop** | End of session | Prints wrap-up checklist (archive check, index updates, orphan check) |

## Memory System

The `Obsidian Mind/brain/` folder is the primary memory store across sessions:

- **[[North Star]]** — living goals document. Read at session start, update when focus shifts.
- **[[Memories]]** — index of memory topics, links to Key Decisions, Patterns, Gotchas.
- **[[Key Decisions]]** — architectural and workflow decisions with dates and rationale.
- **[[Patterns]]** — recurring patterns discovered across work.
- **[[Gotchas]]** — things that have caused problems before.
- **[[Skills]]** — full reference for all commands, subagents, and hooks.

When you learn something worth remembering, write it to the relevant `Obsidian Mind/brain/` note with a wikilink back to the source work note.

## Semantic Search (QMD)

Optional. Install with `npm install -g @tobilu/qmd`, then bootstrap: `node --experimental-strip-types .claude/scripts/qmd-bootstrap.ts`.

Once installed, the SessionStart hook re-indexes automatically. Use `qmd --index obsidian-mind query "..."` for hybrid search, or let agents use the MCP server (`.mcp.json`).

## Index Maintenance

These index notes need active curation — update them when you create or complete work:

- `Obsidian Mind/work/Index.md` — all work notes
- `Obsidian Mind/brain/Memories.md` — topic index for brain notes
- `Obsidian Mind/org/People & Context.md` — people and org context
- `Obsidian Mind/perf/Brag Doc.md` — quarterly brag index

`/om-vault-audit` and `/om-wrap-up` catch drift and suggest fixes.

## Folder Placement Rules

| Content type | Folder |
|-------------|--------|
| Active project | `Obsidian Mind/work/active/` |
| Completed project | `Obsidian Mind/work/archive/YYYY/` |
| Incident doc | `Obsidian Mind/work/incidents/` |
| 1:1 meeting note | `Obsidian Mind/work/1-1/` |
| Person profile | `Obsidian Mind/org/people/` |
| Team note | `Obsidian Mind/org/teams/` |
| Quarterly brag | `Obsidian Mind/perf/brag/` |
| PR / git evidence | `Obsidian Mind/perf/evidence/` |
| Competency note | `Obsidian Mind/perf/competencies/` |
| Reference / runbook | `Obsidian Mind/reference/` |
| Draft / reasoning | `Obsidian Mind/thinking/` |

## Skills

### NotebookLM

The notebooklm-py skill is installed at `.claude/skills/notebooklm.md`. It provides programmatic access to Google NotebookLM via the `notebooklm` CLI.

**Setup (one-time):**
```bash
pip install "notebooklm-py[browser]"
playwright install chromium
notebooklm login
```

See `.claude/skills/notebooklm.md` for the full command reference and workflow examples.
