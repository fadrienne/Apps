#!/usr/bin/env bash
# Seed the LinkedIn MCP session from a li_at cookie (see seed_session.py).
# Usage: LINKEDIN_LI_AT=<cookie> ./linkedin-mcp/seed.sh
set -euo pipefail
cd "$(dirname "$0")"

# shellcheck source=browser-env.sh
. "./browser-env.sh"

exec uv run --no-project --python 3.12 --with mcp-server-linkedin python seed_session.py
