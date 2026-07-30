#!/usr/bin/env bash
# Seed the LinkedIn MCP session from a li_at cookie (see seed_session.py).
# Usage: LINKEDIN_LI_AT=<cookie> ./linkedin-mcp/seed.sh
set -euo pipefail
cd "$(dirname "$0")"

if [ -z "${CHROME_PATH:-}" ] && [ -x /opt/pw-browsers/chromium ]; then
  export CHROME_PATH=/opt/pw-browsers/chromium
fi
export UV_HTTP_TIMEOUT="${UV_HTTP_TIMEOUT:-300}"

exec uv run --no-project --python 3.12 --with mcp-server-linkedin python seed_session.py
