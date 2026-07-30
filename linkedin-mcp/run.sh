#!/usr/bin/env bash
# Launch the LinkedIn MCP server (stickerdaniel/linkedin-mcp-server, PyPI: mcp-server-linkedin).
# Referenced by .mcp.json so the same config works locally and in remote containers.
set -euo pipefail

# shellcheck source=browser-env.sh
. "$(cd "$(dirname "$0")" && pwd)/browser-env.sh"

exec uvx mcp-server-linkedin@latest "$@"
