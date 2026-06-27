/**
 * Cross-platform QMD invocation helpers that bypass Windows .cmd/.ps1 shims.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

export type QmdCommand = {
	readonly cmd: string;
	readonly args: readonly string[];
	readonly shell: boolean;
};

export function resolveQmdEntry(): string | null {
	try {
		const req = createRequire(import.meta.url);
		const pkg = req.resolve("@tobilu/qmd/package.json");
		const dir = pkg.replace(/[/\\]package\.json$/, "");
		const entry = join(dir, "dist", "cli.js");
		if (existsSync(entry)) return entry;
		// npm fallback
		const binEntry = join(dir, "bin", "qmd.js");
		if (existsSync(binEntry)) return binEntry;
		return null;
	} catch {
		return null;
	}
}

export function buildQmdCommand(
	entry: string | null,
	args: readonly string[],
): QmdCommand {
	if (entry) {
		return { cmd: process.execPath, args: [entry, ...args], shell: false };
	}
	// Fallback: invoke via shell (works when qmd is on PATH)
	return { cmd: "qmd", args, shell: true };
}
