#!/usr/bin/env node
/**
 * Detached worker — runs qmd update + embed in the background.
 * Swallows all errors since QMD is optional infrastructure.
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolveQmdEntry, buildQmdCommand } from "./lib/qmd.ts";

function readManifest(): Record<string, unknown> | null {
	try {
		return JSON.parse(readFileSync("vault-manifest.json", { encoding: "utf-8" })) as Record<string, unknown>;
	} catch {
		return null;
	}
}

const manifest = readManifest();
const qmdIndex = manifest && typeof manifest["qmd_index"] === "string" ? manifest["qmd_index"] : null;
const entry = resolveQmdEntry();
const indexArgs = (args: string[]) => qmdIndex ? ["--index", qmdIndex, ...args] : args;

for (const args of [["update"], ["embed"], ["update"]]) {
	try {
		const cmd = buildQmdCommand(entry, indexArgs(args));
		spawnSync(cmd.cmd, cmd.args as string[], { stdio: "ignore", shell: cmd.shell, timeout: 120_000 });
	} catch { /* qmd is optional */ }
}
