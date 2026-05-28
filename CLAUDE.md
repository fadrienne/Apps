# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

APPS is a monorepo housing multiple applications.

## Apps

### notebooklm/
Python project using [notebooklm-py](https://github.com/teng-lin/notebooklm-py) — an unofficial Python library for automating Google NotebookLM.

**Setup:**
```bash
pip install -r notebooklm/requirements.txt
playwright install chromium
```

**Authentication (one-time):**
```bash
notebooklm login
```

**Run example:**
```bash
cd notebooklm && python src/main.py
```

**CLI quick-reference:**
```bash
notebooklm notebooks list
notebooklm create "My Notebook"
notebooklm source add url <url> -n <notebook-id>
notebooklm ask "Summarize this" -n <notebook-id>
notebooklm generate audio -n <notebook-id> --wait
notebooklm artifact download <id> -n <notebook-id>
```

For CI/CD, set `NOTEBOOKLM_AUTH_JSON` to the JSON from `notebooklm auth export`.

### thrive-hub/
(existing app — see its own README for details)
