/**
 * Shared I/O utilities for hook entry points.
 */

import { createInterface } from "node:readline";

export function debug(msg: string): void {
	if (process.env["HOOK_DEBUG"] === "1") {
		process.stderr.write(`[hook-debug] ${msg}\n`);
	}
}

export function warn(msg: string): void {
	process.stderr.write(`⚠ ${msg}\n`);
}

export async function readStdinJson<T>(): Promise<T | null> {
	return new Promise((resolve) => {
		const chunks: string[] = [];
		const rl = createInterface({ input: process.stdin, terminal: false });
		rl.on("line", (line) => chunks.push(line));
		rl.on("close", () => {
			const raw = chunks.join("\n").trim();
			if (!raw) {
				resolve(null);
				return;
			}
			try {
				resolve(JSON.parse(raw) as T);
			} catch {
				resolve(null);
			}
		});
	});
}

export function writeHookOutput(eventName: string, additionalContext: string): void {
	const output = JSON.stringify({
		type: "hookSpecificOutput",
		hookEventName: eventName,
		additionalContext,
	});
	process.stdout.write(output + "\n");
}
