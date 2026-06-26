#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/.claude/skills"

usage() {
  echo "Usage: $0 [--project] [--global] [--help]"
  echo ""
  echo "  --project  Install skills into the current project's .claude/skills/ (default)"
  echo "  --global   Install skills into ~/.claude/skills/"
  echo "  --help     Show this message"
}

MODE="project"
for arg in "$@"; do
  case "$arg" in
    --global) MODE="global" ;;
    --project) MODE="project" ;;
    --help) usage; exit 0 ;;
    *) echo "Unknown option: $arg"; usage; exit 1 ;;
  esac
done

if [ "$MODE" = "global" ]; then
  DEST="$HOME/.claude/skills"
else
  # Find project root (where CLAUDE.md lives, or fall back to cwd)
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  DEST="$ROOT/.claude/skills"
fi

mkdir -p "$DEST"

echo "Installing scientific-agent-skills into $DEST ..."

for skill_dir in "$SKILLS_SRC"/*/; do
  skill_name="$(basename "$skill_dir")"
  dest_skill="$DEST/$skill_name"

  if [ -d "$dest_skill" ]; then
    echo "  [skip] $skill_name (already exists)"
  else
    cp -r "$skill_dir" "$dest_skill"
    echo "  [ok]   $skill_name"
  fi
done

echo ""
echo "Done. $(ls "$SKILLS_SRC" | wc -l | tr -d ' ') skills installed."
echo ""
echo "Invoke skills in Claude Code:"
echo "  /literature-review 'query'"
echo "  /database-lookup gene:BRCA1 databases:UniProt,Ensembl"
echo "  /hypothesis-generation 'observation'"
