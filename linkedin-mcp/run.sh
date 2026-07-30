#!/usr/bin/env bash
# Launch the LinkedIn MCP server (stickerdaniel/linkedin-mcp-server, PyPI: mcp-server-linkedin).
# Referenced by .mcp.json so the same config works locally and in remote containers.
set -euo pipefail

# Prefer the preinstalled Playwright Chromium in Claude Code remote containers;
# elsewhere the server downloads its own browser on first use.
if [ -z "${CHROME_PATH:-}" ] && [ -x /opt/pw-browsers/chromium ]; then
  export CHROME_PATH=/opt/pw-browsers/chromium
fi

export UV_HTTP_TIMEOUT="${UV_HTTP_TIMEOUT:-300}"

exec uvx mcp-server-linkedin@latest "$@"
