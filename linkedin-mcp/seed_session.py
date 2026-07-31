#!/usr/bin/env python3
"""Seed a LinkedIn MCP session from cookies, without a browser login window.

The LinkedIn MCP server normally authenticates via an interactive browser login
(--login) or by importing a session from a locally logged-in browser
(--import-from-browser). Neither works in a headless remote container, so this
script builds the same on-disk session artifacts directly from cookies:

  1. writes the portable cookie file (~/.linkedin-mcp/cookies.json)
  2. validates the session against LinkedIn /feed/ in a headless browser
     (this also creates the browser profile directory)
  3. persists source-state.json so the server accepts the session

Usage — either a single li_at cookie:

    LINKEDIN_LI_AT=<cookie> ./linkedin-mcp/seed.sh

or a full cookie export, which LinkedIn is likelier to accept from a datacenter
IP (inline JSON array, or a path to one):

    LINKEDIN_COOKIES_JSON=~/linkedin-cookies.json ./linkedin-mcp/seed.sh

Find them in a logged-in browser under DevTools > Application > Cookies >
https://www.linkedin.com, or export them with a cookie-editor extension.

Cookies are read from the environment only — never pass them as CLI arguments,
which leak into process listings and shell history.
"""

import asyncio
import json
import os
import sqlite3
import sys
import time


# The cookies the server replays for an imported session. Seeding with the full
# set rather than li_at alone matters from an unfamiliar IP: LinkedIn treats a
# lone li_at arriving from a datacenter address as a replayed session and
# answers authenticated requests with HTTP 429.
BRIDGE_COOKIES = ("li_at", "li_rm", "JSESSIONID", "bcookie", "bscookie", "liap", "lidc")


def main() -> None:
    cookies = _cookies_from_env()
    if not cookies:
        sys.exit(
            "Set LINKEDIN_LI_AT to your li_at cookie value, or LINKEDIN_COOKIES_JSON\n"
            "to a cookie export (a JSON array, or the path to one) covering:\n"
            f"  {', '.join(BRIDGE_COOKIES)}\n\n"
            "li_at alone often works from your own machine but is challenged from a\n"
            "datacenter IP; the full set is more likely to be accepted there.\n"
            "Find them in a logged-in browser: DevTools > Application > Cookies >\n"
            "https://www.linkedin.com (or export with a cookie-editor extension)."
        )

    # The server's config loader parses sys.argv; keep it away from ours.
    sys.argv = [sys.argv[0]]

    from linkedin_mcp_server.drivers.browser import validate_imported_cookies
    from linkedin_mcp_server.session_state import (
        get_source_profile_dir,
        portable_cookie_path,
        write_source_state,
    )

    profile_dir = get_source_profile_dir()
    cookie_path = portable_cookie_path(profile_dir)
    cookie_path.parent.mkdir(parents=True, exist_ok=True)

    cookie_path.write_text(json.dumps(cookies))
    os.chmod(cookie_path, 0o600)

    names = ", ".join(c["name"] for c in cookies)
    print(f"Validating against LinkedIn (headless browser). Cookies: {names}")
    ok = asyncio.run(validate_imported_cookies(cookie_path, profile_dir))
    if not ok:
        cookie_path.unlink(missing_ok=True)
        sys.exit(
            "LinkedIn did not accept the session. Either the cookies are expired or\n"
            "revoked (grab fresh ones from a logged-in browser), or LinkedIn is\n"
            "refusing this IP — an HTTP 429 in the output above means the latter,\n"
            "which is common from a remote container and needs a cooldown, the full\n"
            "cookie set via LINKEDIN_COOKIES_JSON, or running on your own machine."
        )

    if not _cookie_persisted(profile_dir):
        sys.exit(
            "The cookie validated but did not persist into the browser profile at\n"
            f"  {profile_dir}\n"
            "The server reads that store on the machine that seeded it, so tool "
            "calls would run logged out. Re-run seeding; if it repeats, the "
            "browser is not closing cleanly."
        )

    write_source_state(profile_dir)
    print(f"Session seeded. Profile: {profile_dir}")
    print("The LinkedIn MCP server will now start authenticated.")


def _cookies_from_env() -> list[dict]:
    """Build the cookie list from LINKEDIN_COOKIES_JSON or LINKEDIN_LI_AT."""
    raw = os.environ.get("LINKEDIN_COOKIES_JSON", "").strip()
    if raw:
        if not raw.startswith("["):  # a path rather than inline JSON
            raw = open(raw).read()
        exported = json.loads(raw)
        wanted = {name.lower() for name in BRIDGE_COOKIES}
        return [
            _cookie(c["name"], c["value"])
            for c in exported
            if c.get("name", "").lower() in wanted
            and "linkedin.com" in c.get("domain", ".linkedin.com")
        ]

    li_at = os.environ.get("LINKEDIN_LI_AT", "").strip().strip('"')
    return [_cookie("li_at", li_at)] if li_at else []


def _cookie(name: str, value: str) -> dict:
    """One Playwright-shaped cookie with an expiry that survives a browser restart.

    The expiry is not cosmetic: Chromium keeps session cookies (expires=-1) in
    memory only, so they never reach the profile's cookie store. The server
    trusts that store when it runs on the machine that seeded it, so a session
    cookie would leave every tool call logged out. LinkedIn's own li_at lasts
    about a year.
    """
    return {
        "name": name,
        "value": value,
        "domain": ".linkedin.com",
        "path": "/",
        "expires": time.time() + 300 * 24 * 3600,
        "httpOnly": True,
        "secure": True,
        "sameSite": "None",
    }


def _cookie_persisted(profile_dir) -> bool:
    """Whether li_at reached the profile's on-disk cookie store."""
    for cookies_db in profile_dir.glob("**/Cookies"):
        try:
            conn = sqlite3.connect(f"file:{cookies_db}?mode=ro", uri=True)
            try:
                rows = conn.execute(
                    "SELECT 1 FROM cookies WHERE name = 'li_at' LIMIT 1"
                ).fetchall()
            finally:
                conn.close()
            if rows:
                return True
        except sqlite3.Error:
            continue
    return False


if __name__ == "__main__":
    main()
