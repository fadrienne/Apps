# Shared browser setup for run.sh and seed.sh. Sourced, not executed.
#
# Prefers the Chromium preinstalled in Claude Code remote containers so the
# server doesn't download its own copy, and works around the sandboxed egress
# gateway's handling of Chromium's Encrypted Client Hello (see below).

_lkd_chromium="${LINKEDIN_MCP_CHROMIUM:-/opt/pw-browsers/chromium}"

if [ -z "${CHROME_PATH:-}" ] && [ -x "$_lkd_chromium" ]; then
  export CHROME_PATH="$_lkd_chromium"
fi

# Chromium sends an Encrypted Client Hello by default. The sandboxed egress
# gateway answers CONNECT with "200 Connection Established" and then resets the
# tunnel the moment that ClientHello arrives — zero bytes come back — so every
# https:// load fails with ERR_CONNECTION_RESET while curl through the same
# proxy succeeds. ECH can only be switched off by enterprise policy: the
# --disable-features=EncryptedClientHello flag is silently ignored, and only
# /etc/chromium/policies/managed is read by this build.
#
# Capping the handshake at TLS 1.2 also clears the reset, but a browser claiming
# to be current Chrome while refusing TLS 1.3 is an implausible fingerprint, and
# LinkedIn answers it with HTTP 429. Keeping TLS 1.3 and dropping only ECH
# leaves the handshake looking like the browser it claims to be.
_lkd_policy_dir=/etc/chromium/policies/managed
if [ -n "${HTTPS_PROXY:-}${https_proxy:-}" ] && [ -z "${LINKEDIN_MCP_NO_ECH_POLICY:-}" ]; then
  if [ ! -f "$_lkd_policy_dir/ech.json" ]; then
    if mkdir -p "$_lkd_policy_dir" 2>/dev/null; then
      echo '{"EncryptedClientHelloEnabled": false}' > "$_lkd_policy_dir/ech.json" 2>/dev/null || true
    fi
  fi
fi

export UV_HTTP_TIMEOUT="${UV_HTTP_TIMEOUT:-300}"
