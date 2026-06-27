#!/usr/bin/env node
/**
 * ShardMind personalization hook — runs after install to customize
 * scaffold files for the new vault owner.
 */

// This hook is called by ShardMind after `shardmind install`.
// Customize scaffold files (North Star, Memories, etc.) for the new user.
// The vault root is available as the current working directory.

import { readFileSync, writeFileSync } from "node:fs";

// No-op by default — scaffold files ship with placeholder content.
// Customize this hook to pre-fill owner-specific details.
process.exit(0);
