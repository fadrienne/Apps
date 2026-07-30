#!/usr/bin/env python3
"""Seed a LinkedIn MCP session from a li_at cookie, without a browser login window.

The LinkedIn MCP server normally authenticates via an interactive browser login
(--login) or by importing a session from a locally logged-in browser
(--import-from-browser). Neither works in a headless remote container, so this
script builds the same on-disk session artifacts directly from a li_at cookie:

  1. writes the portable cookie file (~/.linkedin-mcp/cookies.json)
  2. validates the cookie against LinkedIn /feed/ in a headless browser
     (this also creates the browser profile directory)
  3. persists source-state.json so the server accepts the session

Get your li_at cookie from a browser where you're logged in to LinkedIn:
DevTools > Application > Cookies > https://www.linkedin.com > li_at

Usage:
    LINKEDIN_LI_AT=<cookie> ./linkedin-mcp/seed.sh
or directly:
    LINKEDIN_LI_AT=<cookie> uv run --no-project \
        --with mcp-server-linkedin python linkedin-mcp/seed_session.py

The cookie is read from the LINKEDIN_LI_AT environment variable only — never
pass it as a CLI argument (argv leaks into process listings and shell history).
"""

import asyncio
import json
import os
import sqlite3
import sys
import time


def main() -> None:
    li_at = os.environ.get("LINKEDIN_LI_AT", "").strip().strip('"')
    if not li_at:
        sys.exit(
            "Set LINKEDIN_LI_AT to your li_at cookie value.\n"
            "Find it in a logged-in browser: DevTools > Application > Cookies "
            "> https://www.linkedin.com > li_at"
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

    # A real future expiry matters: Chromium keeps session cookies (expires=-1)
    # in memory only, so a session cookie never reaches the profile's cookie
    # store. When the server runs on the same machine that seeded it, it trusts
    # that store rather than re-injecting cookies.json — a session cookie would
    # leave every tool call logged out. LinkedIn's own li_at lasts about a year.
    expires = time.time() + 300 * 24 * 3600

    cookie_path.write_text(
        json.dumps(
            [
                {
                    "name": "li_at",
                    "value": li_at,
                    "domain": ".linkedin.com",
                    "path": "/",
                    "expires": expires,
                    "httpOnly": True,
                    "secure": True,
                    "sameSite": "None",
                }
            ]
        )
    )
    os.chmod(cookie_path, 0o600)

    print("Validating cookie against LinkedIn (headless browser)...")
    ok = asyncio.run(validate_imported_cookies(cookie_path, profile_dir))
    if not ok:
        cookie_path.unlink(missing_ok=True)
        sys.exit(
            "LinkedIn rejected the cookie. It may be expired or revoked — "
            "grab a fresh li_at from a logged-in browser and try again."
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
