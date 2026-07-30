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
import sys


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

    cookie_path.write_text(
        json.dumps(
            [
                {
                    "name": "li_at",
                    "value": li_at,
                    "domain": ".linkedin.com",
                    "path": "/",
                    "expires": -1,
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

    write_source_state(profile_dir)
    print(f"Session seeded. Profile: {profile_dir}")
    print("The LinkedIn MCP server will now start authenticated.")


if __name__ == "__main__":
    main()
