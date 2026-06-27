# Obsidian Mind Vault Overview

This is a multi-agent knowledge management system designed primarily for Claude Code but supporting other AI agents through portable configurations.

## Core Components

**Hook Scripts**: TypeScript and shell scripts in `.claude/scripts/` execute at specific agent lifecycle events (session start, message classification, write validation, transcript compaction). These scripts work across Claude Code, Codex CLI, and Gemini CLI without modifications.

**Commands**: 18 markdown-based commands with YAML frontmatter live in `.claude/commands/`. Different agents invoke them differently — Claude Code uses slash commands like `/om-standup`, while Codex CLI uses plain text commands.

**Memory System**: The `brain/` directory stores persistent knowledge in plain markdown files (Memories.md, Patterns.md, Key Decisions.md, Gotchas.md). This vault-side memory is "the source of truth" across all agents, separate from Claude Code's auto-loaded `~/.claude/` memory.

**Subagents**: Nine specialized agents in `.claude/agents/` handle focused tasks.

## Portability

Most components are agent-agnostic — the same markdown prompts, hook logic, and memory structures work across multiple AI agents. Setup guides provided for Codex CLI, Gemini CLI, and other platforms like Cursor and Windsurf, with configuration adjustments needed for context file access.

## Quick Start

1. Open this vault in Obsidian
2. Start a Claude Code session in this directory
3. Run `/om-standup` to load vault context and surface your priorities

See `CLAUDE.md` for full operating manual.
