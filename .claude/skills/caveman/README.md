# caveman (vendored)

Locally vendored copy of the `caveman` skill — an ultra-compressed
communication mode that cuts output tokens ~65% by responding in terse,
fragment-style language while keeping code, commands, and error strings
byte-for-byte exact.

## Provenance

- **Source:** https://github.com/JuliusBrussee/caveman (author: Julius Brussee)
- **File vendored:** `skills/caveman/SKILL.md` (copied verbatim into `SKILL.md`)
- **Vendored on:** 2026-07-30

## What was intentionally NOT installed

The upstream project ships an installer (`curl | bash` / `npx skills add`)
that installs **globally** into `~/.claude/`:

- writes 8 JS/shell files into `~/.claude/hooks/`
- edits `~/.claude/settings.json` to register an always-on `SessionStart`
  hook and a `UserPromptSubmit` hook, plus a custom statusline
- enables caveman mode by default, machine-wide

**None of that was done here.** Only the skill prompt (`SKILL.md`) was
vendored, scoped to this repo. There are no hooks, no global config changes,
and nothing auto-activates. The skill triggers only via the normal
description-based skill mechanism (e.g. when you ask for "caveman mode",
"be brief", or invoke it by name), and persists within a session until you
say "stop caveman" / "normal mode".

To pick up upstream changes, re-copy `skills/caveman/SKILL.md` from the
source repo.
