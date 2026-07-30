# Shared browser setup for run.sh and seed.sh. Sourced, not executed.
#
# Prefers the Chromium preinstalled in Claude Code remote containers so the
# server doesn't download its own copy. When an intercepting proxy is also in
# play, Chromium is routed through the TLS-capping wrapper (see
# chromium-tls12.sh for why). Set LINKEDIN_MCP_NO_TLS_CAP=1 to opt out, or
# CHROME_PATH yourself to override entirely.

_lkd_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_lkd_chromium="${LINKEDIN_MCP_CHROMIUM:-/opt/pw-browsers/chromium}"

if [ -z "${CHROME_PATH:-}" ] && [ -x "$_lkd_chromium" ]; then
  if [ -n "${HTTPS_PROXY:-}${https_proxy:-}" ] && [ -z "${LINKEDIN_MCP_NO_TLS_CAP:-}" ]; then
    export LINKEDIN_MCP_CHROMIUM="$_lkd_chromium"
    export CHROME_PATH="$_lkd_dir/chromium-tls12.sh"
  else
    export CHROME_PATH="$_lkd_chromium"
  fi
fi

export UV_HTTP_TIMEOUT="${UV_HTTP_TIMEOUT:-300}"
