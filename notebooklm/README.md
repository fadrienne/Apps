# NotebookLM

Python automation client for [Google NotebookLM](https://notebooklm.google.com), built on [`notebooklm-py`](https://github.com/teng-lin/notebooklm-py).

## Setup

```bash
pip install -r requirements.txt
playwright install chromium
```

### Authentication

```bash
# Opens a browser for Google OAuth — saves auth to your profile
notebooklm login

# Verify auth is working
notebooklm auth check --test --json

# (Optional) export auth JSON for headless/CI environments
notebooklm login --save-json > auth.json
```

Copy `.env.example` to `.env` and fill in values if running headless.

## Usage

```bash
# List all notebooks
python src/main.py

# Create a notebook
python src/main.py --create "My Research"

# Add a URL source to a notebook
python src/main.py --add-source <NB_ID> https://example.com/paper.pdf

# Chat with a notebook
python src/main.py --chat <NB_ID> "Summarize the key findings"
```

Or use the `notebooklm` CLI directly:

```bash
notebooklm list
notebooklm create --title "My Research"
notebooklm source add <NB_ID> --url https://...
notebooklm chat <NB_ID> "What are the main themes?"
notebooklm audio generate <NB_ID>
notebooklm audio download <NB_ID> output.mp3
```
