#!/usr/bin/env bash
# Chromium wrapper that caps TLS at 1.2.
#
# The sandboxed egress proxy used by Claude Code remote environments resets
# Chromium's TLS 1.3 handshakes (every https:// load fails with
# ERR_CONNECTION_RESET, while curl through the same proxy succeeds). Capping the
# handshake at TLS 1.2 is what gets the scraping browser onto LinkedIn.
# Certificate verification stays fully enabled.
#
# Used as CHROME_PATH so the MCP server, which has no pass-through for browser
# flags, still launches Chromium with the flag. exec is required: Playwright
# talks to the browser over inherited file descriptors and signals the pid it
# spawned, so this process must be replaced rather than wrap a child.
exec "${LINKEDIN_MCP_CHROMIUM:-/opt/pw-browsers/chromium}" --ssl-version-max=tls1.2 "$@"
