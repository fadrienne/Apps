# LinkedIn MCP

Setup for [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server)
(PyPI: [`mcp-server-linkedin`](https://pypi.org/project/mcp-server-linkedin/)) — an MCP server that
gives Claude LinkedIn tools (profiles, messaging, companies, jobs, people/post search) by driving a
headless browser against your own LinkedIn session.

The server is registered in the repo root [`.mcp.json`](../.mcp.json) as `linkedin` and launched via
[`run.sh`](run.sh), which runs `uvx mcp-server-linkedin@latest` and points it at the preinstalled
Chromium when running in a Claude Code remote container.

## Tools exposed

- **Profiles:** `get_person_profile`, `get_my_profile`, `connect_with_person`, `get_sidebar_profiles`
- **Messaging:** `get_inbox`, `get_conversation`, `search_conversations`, `send_message`
- **Companies:** `get_company_profile`, `get_company_posts`, `search_companies`, `get_company_employees`
- **Jobs:** `search_jobs`, `get_saved_jobs`, `get_job_details`
- **Search:** `search_people`, `search_posts`
- **Session:** `close_session`

## Authentication

The server authenticates with your real LinkedIn session (a persisted browser profile in
`~/.linkedin-mcp/`). No password is stored.

### On your own machine (Mac/desktop)

Nothing to do: on first tool call the server auto-imports the session from a locally logged-in
Chromium browser (Chrome, Brave, Edge, Arc, ...). Alternatively run a one-time interactive login:

```sh
uvx mcp-server-linkedin@latest --login
```

### In a headless/remote container (Claude Code on the web)

There is no browser to import from, so seed the session from your `li_at` cookie:

1. In a browser where you're logged in to LinkedIn:
   DevTools → Application → Cookies → `https://www.linkedin.com` → copy the `li_at` value.
2. In the remote session:

   ```sh
   LINKEDIN_LI_AT=<cookie value> ./linkedin-mcp/seed.sh
   ```

   The script writes the portable cookie file, validates it against LinkedIn in a headless
   browser, and persists the session metadata the server expects.

**Note:** remote containers are ephemeral — the seeded session lives in `~/.linkedin-mcp/` and is
lost when the container is reclaimed, so a fresh container needs re-seeding. (Don't commit session
artifacts to git; the `li_at` cookie is full access to your LinkedIn account.)

## Remote container caveats

### Network policy

The scraping browser must reach LinkedIn directly. Under a restricted network policy, CONNECT to
`www.linkedin.com` is denied (403) and every tool call fails with a proxy error. Fix: in the
environment's network settings, allow at least `linkedin.com` / `*.linkedin.com` and `*.licdn.com`
(LinkedIn's static/media CDN), or use a permissive policy.

### TLS 1.3 is reset by the sandbox proxy

Even with LinkedIn allowed, Chromium's TLS 1.3 handshakes are reset by the sandboxed egress proxy —
every `https://` load fails with `ERR_CONNECTION_RESET` while `curl` through the same proxy
succeeds. Disabling post-quantum key agreement alone doesn't help; the whole TLS 1.3 handshake is
affected.

[`chromium-tls12.sh`](chromium-tls12.sh) works around this by capping the handshake at TLS 1.2, and
[`browser-env.sh`](browser-env.sh) routes `CHROME_PATH` through it whenever a proxy is configured.
Certificate verification stays fully enabled. Set `LINKEDIN_MCP_NO_TLS_CAP=1` to opt out. On a
normal machine (no intercepting proxy) the cap is never applied.

### LinkedIn rate-limits datacenter IPs

Requests from a remote container come from a datacenter IP, which LinkedIn treats with suspicion:
expect `HTTP 429` responses and redirects to the login page under repeated requests, even with a
valid cookie. Space out calls, and re-seed after a cooldown if seeding fails with 429. Running on
your own machine avoids this entirely — this is the main reason to prefer local use for heavy
scraping.

## Security notes

- Treat `LINKEDIN_LI_AT` like a password: pass it only via environment variable (never CLI args,
  never committed files).
- All scraping runs as *your* account; heavy automated use can trip LinkedIn's anti-bot measures.
  The server rate-limits itself, but use judgement with bulk operations.
- `send_message` and `connect_with_person` act as you on the real LinkedIn — Claude should confirm
  before outward-facing actions.
