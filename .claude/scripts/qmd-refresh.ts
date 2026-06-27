#!/usr/bin/env node
/**
 * PostToolUse hook — trigger a detached QMD refresh after the agent
 * writes or edits a vault markdown file.
 */

import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { debug, readStdinJson } from "./lib/hook-io.ts";
import {
	shouldRefreshForPath,
	triggerDebouncedRefresh,
} from "./lib/qmd-refresh.ts";

const DEBOUNCE_MS = 30_000;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SENTINEL_PATH =
	process.env["QMD_REFRESH_SENTINEL"] ??
	join(SCRIPT_DIR, ".qmd-refresh-sentinel");
const WORKER_PATH = resolvePath(SCRIPT_DIR, "qmd-refresh-run.ts");

type HookInput = {
	readonly tool_input?: unknown;
};

const input = await readStdinJson<HookInput>();
if (!input) {
	debug("qmd-refresh: null input");
	process.exit(0);
}

const toolInput = input.tool_input;
if (!toolInput || typeof toolInput !== "object") {
	debug("qmd-refresh: missing tool_input");
	process.exit(0);
}

const filePath = (toolInput as Record<string, unknown>).file_path;
if (typeof filePath !== "string") {
	debug("qmd-refresh: missing file_path");
	process.exit(0);
}

if (!shouldRefreshForPath(filePath)) {
	debug(`qmd-refresh: skipped ${filePath}`);
	process.exit(0);
}

triggerDebouncedRefresh({
	sentinelPath: SENTINEL_PATH,
	workerPath: WORKER_PATH,
	debounceMs: DEBOUNCE_MS,
	logPrefix: "qmd-refresh",
});
process.exit(0);
