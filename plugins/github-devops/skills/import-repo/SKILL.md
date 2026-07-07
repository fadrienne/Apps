---
name: import-repo
description: "Import a GitHub repository into this Apps repo in a controlled, selective way. Use when the user shares a GitHub link and wants its contents copied into a new subfolder, with only specific files promoted to .claude/. Prevents the bulk-import problem where everything ends up in .claude/ indiscriminately. Triggers on: 'I have a GitHub link', 'add this repo', 'import this', 'copy this repo into Apps'."
---

# Import Repo

Controlled import of an external GitHub repository into this Apps repo.

## What This Skill Does

1. Clones the target repo into a new named subfolder of Apps/
2. Shows you what's inside (skills, agents, prompts, scripts, etc.)
3. Asks which specific files you want promoted to `.claude/`
4. Copies only those, then commits the whole thing cleanly

This prevents the problem of bulk-importing everything into `.claude/` without review.

---

## Workflow

### Step 1 — Get the URL and folder name

Ask the user for:
- The GitHub URL (e.g. `https://github.com/owner/repo`)
- The folder name to use inside Apps/ (default: the repo name)

### Step 2 — Clone into a subfolder

```bash
# Clone into Apps/<folder-name>/
git clone --depth=1 <github-url> <folder-name>

# Remove the nested .git so it doesn't conflict with the Apps repo
rm -rf <folder-name>/.git
```

If `git clone` fails (private repo, network issue, auth), fall back to `gh repo clone`:
```bash
gh repo clone <owner>/<repo> <folder-name> -- --depth=1
rm -rf <folder-name>/.git
```

### Step 3 — Inspect and report what's available

After cloning, scan for promotable content and present a clear list:

```bash
# Skills
find <folder-name> -path "*/skills/*/SKILL.md" | sort

# Agents
find <folder-name> -path "*/agents/*.md" | sort

# Prompts / commands
find <folder-name> -path "*/prompts/*.md" -o -path "*/commands/*.md" | sort

# Scripts
find <folder-name> -name "*.py" -o -name "*.sh" | sort

# Top-level files
ls <folder-name>/
```

Format the report like this before asking the user what to promote:

```
## What's in <repo-name>

### Skills (promotable to .claude/skills/)
- skills/foo/SKILL.md
- skills/bar/SKILL.md

### Agents (promotable to .claude/agents/)
- agents/writer.md
- agents/reviewer.md

### Other files (stay in <folder-name>/, not promoted)
- README.md
- CLAUDE.md
- scripts/run.py
```

### Step 4 — Ask what to promote

Ask the user which specific items they want copied to `.claude/`. Be explicit:

> Which of these do you want added to `.claude/`? List the ones you want — anything not listed stays in `<folder-name>/` only.

Wait for their answer before proceeding.

### Step 5 — Copy selected files to `.claude/`

For each item the user selected:

**Skills** → copy the whole skill directory:
```bash
cp -r <folder-name>/skills/<skill-name> .claude/skills/<skill-name>
```

**Agents** → copy the agent file:
```bash
cp <folder-name>/agents/<agent-name>.md .claude/agents/<agent-name>.md
```

**Commands/prompts** → copy to `.claude/commands/` or as appropriate:
```bash
cp <folder-name>/prompts/<name>.md .claude/commands/<name>.md
```

If a destination already exists, warn the user before overwriting:
> `.claude/skills/<name>/` already exists. Overwrite? (yes / skip)

### Step 6 — Commit

Stage and commit everything:

```bash
git add <folder-name>/ .claude/
git commit -m "feat: import <repo-name> into <folder-name>/, promote <N> items to .claude/"
```

Always commit both the subfolder AND the promoted files together so the import is one atomic change.

---

## Rules

- **Never** bulk-copy an entire repo's `.claude/` into this repo's `.claude/` without asking first.
- **Never** overwrite existing `.claude/` files without warning.
- **Always** remove the nested `.git` from the cloned folder — it must not become a git submodule.
- If the repo has a `CLAUDE.md` at its root, read it and summarize its contents for the user so they know what the repo expects before they decide what to promote.
- Keep the subfolder name short and descriptive. If the user doesn't specify one, use the repo name, stripping any common prefixes like `claude-`, `agent-`, `skills-`.

---

## Example

User: "Here's the link: https://github.com/example/scientific-tools"

```
Cloning into scientific-tools/...

## What's in scientific-tools

### Skills (promotable to .claude/skills/)
- skills/data-analysis/SKILL.md
- skills/chart-builder/SKILL.md
- skills/report-writer/SKILL.md

### Agents (promotable to .claude/agents/)
- agents/analyst.md

### Other files (stay in scientific-tools/)
- README.md
- CLAUDE.md  ← has instructions for the repo
- scripts/setup.py
- requirements.txt

Which of these do you want added to .claude/?
```

User: "just data-analysis and the analyst agent"

```
Copying:
  scientific-tools/skills/data-analysis/ → .claude/skills/data-analysis/
  scientific-tools/agents/analyst.md     → .claude/agents/analyst.md

Committing...
[main abc1234] feat: import scientific-tools, promote data-analysis skill + analyst agent
```
