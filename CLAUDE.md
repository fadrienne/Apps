# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

APPS (previously named SHORE) is a newly initialized repository. No language, framework, build system, or application code has been set up yet.

As the project evolves, this file should be updated to document build commands, test workflows, architecture decisions, and conventions.

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
