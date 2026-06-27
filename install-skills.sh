#!/usr/bin/env bash
# Installs Claude Code skills listed in skills-lock.json into .claude/skills/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCK_FILE="$SCRIPT_DIR/skills-lock.json"
TMPDIR_WORK="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_WORK"' EXIT

usage() {
  echo "Usage: $0 [--global] [--force] [--help]"
  echo ""
  echo "  --global  Install into ~/.claude/skills/ (available across all projects)"
  echo "  --force   Reinstall skills even if already installed"
  echo "  --help    Show this message"
}

FORCE=false
GLOBAL=false
for arg in "$@"; do
  case "$arg" in
    --global) GLOBAL=true ;;
    --force) FORCE=true ;;
    --help) usage; exit 0 ;;
    *) echo "Unknown option: $arg"; usage; exit 1 ;;
  esac
done

if [ "$GLOBAL" = true ]; then
  SKILLS_DIR="$HOME/.claude/skills"
else
  SKILLS_DIR="$SCRIPT_DIR/.claude/skills"
fi

if [ ! -f "$LOCK_FILE" ]; then
  echo "Error: $LOCK_FILE not found" >&2
  exit 1
fi
if ! command -v jq &>/dev/null; then
  echo "Error: jq is required but not installed" >&2
  exit 1
fi

# Download a single file from GitHub raw, respecting the proxy
github_raw() {
  local owner_repo="$1" branch="$2" path="$3" dest="$4"
  local url="https://raw.githubusercontent.com/$owner_repo/$branch/$path"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL -o "$dest" "$url"
}

# Install one skill from a GitHub repository.
# Convention: the skill lives at skills/<name>/ inside the repo.
install_github_skill() {
  local name="$1" owner_repo="$2" skill_path="$3" expected_hash="$4"
  local dest_dir="$SKILLS_DIR/$name"

  # Resolve default branch
  local branch
  branch=$(curl -fsSL "https://api.github.com/repos/$owner_repo" | jq -r '.default_branch')
  if [ -z "$branch" ] || [ "$branch" = "null" ]; then
    branch="main"
  fi

  local skill_dir_in_repo="skills/$name"

  # Get recursive file tree for the skill directory
  local tree_json
  tree_json=$(curl -fsSL "https://api.github.com/repos/$owner_repo/git/trees/$branch?recursive=1")

  local files
  files=$(echo "$tree_json" | jq -r --arg prefix "$skill_dir_in_repo/" \
    '.tree[] | select(.type == "blob" and (.path | startswith($prefix))) | .path')

  if [ -z "$files" ]; then
    echo "  [error] $name: no files found at $skill_dir_in_repo/ in $owner_repo" >&2
    return 1
  fi

  local tmp_skill="$TMPDIR_WORK/$name"
  mkdir -p "$tmp_skill"

  while IFS= read -r file_path; do
    local rel_path="${file_path#"$skill_dir_in_repo/"}"
    local dest_file="$tmp_skill/$rel_path"
    github_raw "$owner_repo" "$branch" "$file_path" "$dest_file"
  done <<< "$files"

  # Verify hash of the main SKILL.md
  local main_skill_file="$tmp_skill/$skill_path"
  if [ -f "$main_skill_file" ]; then
    local actual_hash
    actual_hash=$(sha256sum "$main_skill_file" | cut -d' ' -f1)
    if [ "$actual_hash" != "$expected_hash" ]; then
      echo "  [warn]  $name: hash mismatch (skill may have been updated)"
      echo "          expected: $expected_hash"
      echo "          actual:   $actual_hash"
    fi
  else
    echo "  [warn]  $name: $skill_path not found in downloaded files" >&2
  fi

  # Copy to destination
  rm -rf "$dest_dir"
  cp -r "$tmp_skill" "$dest_dir"

  local file_count
  file_count=$(find "$dest_dir" -type f | wc -l | tr -d ' ')
  echo "  [ok]   $name  ($file_count files from github.com/$owner_repo)"
}

echo "Installing skills from $LOCK_FILE ..."
echo ""

installed=0; skipped=0; failed=0

while IFS= read -r name; do
  source_type=$(jq -r ".skills[\"$name\"].sourceType" "$LOCK_FILE")
  source=$(jq -r ".skills[\"$name\"].source" "$LOCK_FILE")
  skill_path=$(jq -r ".skills[\"$name\"].skillPath" "$LOCK_FILE")
  expected_hash=$(jq -r ".skills[\"$name\"].computedHash" "$LOCK_FILE")

  dest_dir="$SKILLS_DIR/$name"

  if [ -d "$dest_dir" ] && [ "$FORCE" = false ]; then
    echo "  [skip] $name (already installed — use --force to reinstall)"
    skipped=$((skipped + 1))
    continue
  fi

  case "$source_type" in
    github)
      if install_github_skill "$name" "$source" "$skill_path" "$expected_hash"; then
        installed=$((installed + 1))
      else
        failed=$((failed + 1))
      fi
      ;;
    *)
      echo "  [error] $name: unsupported sourceType '$source_type'" >&2
      failed=$((failed + 1))
      ;;
  esac
done < <(jq -r '.skills | keys[]' "$LOCK_FILE")

echo ""
echo "Done. $installed installed, $skipped skipped, $failed failed."
