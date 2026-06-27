/**
 * Mid-session QMD refresh logic with debouncing.
 */

import { existsSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { debug } from "./hook-io.ts";

const SKIP_PREFIXES = [".claude", ".codex", ".gemini", ".obsidian", ".git"];

export function shouldRefreshForPath(filePath: string): boolean {
	const normalized = filePath.replaceAll("\\", "/");
	const lower = normalized.toLowerCase();
	if (!lower.endsWith(".md")) return false;
	for (const prefix of SKIP_PREFIXES) {
		if (normalized.includes(`/${prefix}/`) || normalized.startsWith(prefix)) {
			return false;
		}
	}
	return true;
}

export function isDebounced(sentinelPath: string, debounceMs: number): boolean {
	try {
		const mtime = statSync(sentinelPath).mtimeMs;
		return Date.now() - mtime < debounceMs;
	} catch {
		return false;
	}
}

export type RefreshOptions = {
	readonly sentinelPath: string;
	readonly workerPath: string;
	readonly debounceMs: number;
	readonly logPrefix: string;
};

export function triggerDebouncedRefresh(opts: RefreshOptions): void {
	const { sentinelPath, workerPath, debounceMs, logPrefix } = opts;

	if (isDebounced(sentinelPath, debounceMs)) {
		debug(`${logPrefix}: debounced, skipping refresh`);
		return;
	}

	try {
		writeFileSync(sentinelPath, String(Date.now()), { encoding: "utf-8" });
	} catch {
		debug(`${logPrefix}: could not write sentinel`);
	}

	const child = spawn(
		process.execPath,
		["--disable-warning=ExperimentalWarning", "--experimental-strip-types", workerPath],
		{ stdio: "ignore", detached: true, windowsHide: true },
	);
	child.on("error", () => undefined);
	child.unref();
	debug(`${logPrefix}: spawned qmd-refresh-run worker`);
}
