# Obsidian Mind Vault Overview

This knowledge management system is designed for Claude Code and other AI agents, with comprehensive documentation in `CLAUDE.md`.

## Core Architecture

The vault organizes around three main components:

**Hook Scripts** (`.claude/scripts/`): TypeScript and shell scripts that execute natively via Node without dependencies. These handle four key functions: injecting context at startup, classifying messages, validating frontmatter/wikilinks, and backing up transcripts before compaction.

**Commands** (`.claude/commands/`): Eighteen agent-agnostic markdown files with YAML frontmatter. Users invoke these as `/om-standup`, `/om-dump`, etc., depending on their agent platform.

**Memory System** (`brain/`): Plain markdown files including "Memories," "Patterns," "Key Decisions," and "Gotchas." When you learn something worth remembering, write it to the relevant `brain/` topic note with a wikilink to context.

## Multi-Agent Support

The system works across three primary agents:
- Claude Code (full support via `.claude/settings.json`)
- Codex CLI (shared hook scripts via `.codex/hooks.json`)
- Gemini CLI (shared hook scripts via `.gemini/settings.json`)

Nine subagents in `.claude/agents/` handle specialized tasks.

## Portability Note

Most vault conventions are platform-agnostic. Only Claude Code's auto-memory loader (`~/.claude/`) is agent-specific.
