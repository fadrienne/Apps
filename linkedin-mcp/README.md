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

There is no browser to import from, so seed the session from cookies taken out of a browser where
you're logged in. Either a single `li_at`:

```sh
LINKEDIN_LI_AT=<cookie value> ./linkedin-mcp/seed.sh
```

or the full cookie set, which LinkedIn is likelier to accept from a datacenter IP (see below):

```sh
LINKEDIN_COOKIES_JSON=~/linkedin-cookies.json ./linkedin-mcp/seed.sh
```

Find them under DevTools → Application → Cookies → `https://www.linkedin.com`, or export them with
a cookie-editor extension. `LINKEDIN_COOKIES_JSON` takes a JSON array (inline or a path) and keeps
the cookies the server replays: `li_at`, `li_rm`, `JSESSIONID`, `bcookie`, `bscookie`, `liap`,
`lidc`.

The script writes the portable cookie file, validates the session against LinkedIn in a headless
browser, and persists the session metadata the server expects. It fails loudly rather than
reporting a success that cannot work.

**Note:** remote containers are ephemeral — the seeded session lives in `~/.linkedin-mcp/` and is
lost when the container is reclaimed, so a fresh container needs re-seeding. (Don't commit session
artifacts to git; the `li_at` cookie is full access to your LinkedIn account.)

## Remote container caveats

### Network policy

The scraping browser must reach LinkedIn directly. Under a restricted network policy, CONNECT to
`www.linkedin.com` is denied (403) and every tool call fails with a proxy error. Fix: in the
environment's network settings, allow at least `linkedin.com` / `*.linkedin.com` and `*.licdn.com`
(LinkedIn's static/media CDN), or use a permissive policy.

### Encrypted Client Hello breaks every page load

Even with LinkedIn allowed, every `https://` load from Chromium fails with `ERR_CONNECTION_RESET`
while `curl` through the same proxy succeeds. The cause is Chromium's Encrypted Client Hello: the
egress gateway answers `CONNECT` with `200 Connection Established` and then resets the tunnel the
moment that ClientHello arrives, returning zero bytes.

[`browser-env.sh`](browser-env.sh) writes `/etc/chromium/policies/managed/ech.json` disabling ECH
whenever a proxy is configured. Two details are easy to get wrong:

- The `--disable-features=EncryptedClientHello` flag is **silently ignored**; only the enterprise
  policy works, and only from `/etc/chromium/policies/managed` for this build.
- Capping the handshake at TLS 1.2 also clears the reset, but a browser claiming to be current
  Chrome while refusing TLS 1.3 is an implausible fingerprint that LinkedIn answers with `HTTP 429`.
  Keep TLS 1.3 and drop only ECH.

Set `LINKEDIN_MCP_NO_ECH_POLICY=1` to skip writing the policy. On a normal machine (no intercepting
proxy) it is never written.

### LinkedIn challenges datacenter IPs

Requests from a remote container come from a datacenter IP. Unauthenticated page loads work, but
authenticated ones may be answered with `HTTP 429` even with a valid cookie — LinkedIn treats a
session replayed from an unfamiliar address as suspect. Mitigations, in order of effectiveness:

1. Run on your own machine, where the IP is residential and the session is the one you logged in
   with. This is the reliable option and the reason to prefer local use for heavy scraping.
2. Seed the full cookie set via `LINKEDIN_COOKIES_JSON` rather than `li_at` alone, so the session
   looks like the browser it came from.
3. Wait out the block and space out calls. Cooldowns can run to hours.

Note that a 429 in seeding is reported as "LinkedIn did not accept the session" — check the output
for `HTTP ERROR 429` to tell an IP block apart from a genuinely expired cookie.

## Security notes

- Treat `LINKEDIN_LI_AT` like a password: pass it only via environment variable (never CLI args,
  never committed files).
- All scraping runs as *your* account; heavy automated use can trip LinkedIn's anti-bot measures.
  The server rate-limits itself, but use judgement with bulk operations.
- `send_message` and `connect_with_person` act as you on the real LinkedIn — Claude should confirm
  before outward-facing actions.
