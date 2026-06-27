#!/usr/bin/env node
/**
 * PreCompact hook — back up the session transcript before compaction.
 * Keeps the most recent 30 backups; older ones are pruned.
 */

import {
	mkdirSync,
	copyFileSync,
	readdirSync,
	statSync,
	unlinkSync,
} from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { debug, readStdinJson } from "./lib/hook-io.ts";
import { isMainModule } from "./lib/main-guard.ts";
import { triggerDebouncedRefresh } from "./lib/qmd-refresh.ts";

type HookInput = {
	readonly transcript_path?: unknown;
	readonly trigger?: unknown;
};

const BACKUP_RETAIN = 30;

export function formatTimestamp(d: Date): string {
	const pad = (n: number) => String(n).padStart(2, "0");
	return (
		`${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
		`_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
	);
}

export function listBackups(dir: string): string[] {
	try {
		return readdirSync(dir)
			.filter((f) => f.startsWith("session_") && f.endsWith(".jsonl"))
			.map((f) => ({ name: f, mtime: statSync(join(dir, f)).mtimeMs }))
			.sort((a, b) => b.mtime - a.mtime)
			.map((e) => e.name);
	} catch {
		return [];
	}
}

export function pruneBackups(dir: string, retain: number): void {
	const ordered = listBackups(dir);
	for (const name of ordered.slice(retain)) {
		try {
			unlinkSync(join(dir, name));
		} catch {
			/* best effort */
		}
	}
}

if (isMainModule(import.meta.url)) {
	const input = await readStdinJson<HookInput>();
	if (!input) process.exit(0);

	{
		const scriptDir = dirname(fileURLToPath(import.meta.url));
		triggerDebouncedRefresh({
			sentinelPath:
				process.env["QMD_REFRESH_SENTINEL"] ??
				join(scriptDir, ".qmd-refresh-sentinel"),
			workerPath: resolvePath(scriptDir, "qmd-refresh-run.ts"),
			debounceMs: 30_000,
			logPrefix: "pre-compact",
		});
	}

	const transcriptPath =
		typeof input.transcript_path === "string" ? input.transcript_path : "";
	const trigger =
		typeof input.trigger === "string" ? input.trigger : "unknown";

	if (!transcriptPath) {
		debug("pre-compact: no transcript_path in input");
		process.exit(0);
	}

	const projectDir = process.env["CLAUDE_PROJECT_DIR"] ?? process.cwd();
	const backupDir = join(projectDir, "thinking/session-logs");
	mkdirSync(backupDir, { recursive: true });

	const dest = join(
		backupDir,
		`session_${trigger}_${formatTimestamp(new Date())}.jsonl`,
	);

	try {
		copyFileSync(transcriptPath, dest);
		debug(`pre-compact: backed up ${transcriptPath} → ${dest}`);
	} catch (err) {
		const code = (err as NodeJS.ErrnoException).code;
		if (code === "ENOENT") {
			debug(`pre-compact: transcript not found (path=${transcriptPath})`);
		} else {
			debug(`pre-compact: copy failed: ${(err as Error).message}`);
		}
		process.exit(0);
	}

	pruneBackups(backupDir, BACKUP_RETAIN);
	process.exit(0);
}
