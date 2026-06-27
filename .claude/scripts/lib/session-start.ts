/**
 * Pure helper functions for session-start context assembly.
 */

import { minimatch } from "node:path";

export function take(text: string, lines: number): string {
	return text.split("\n").slice(0, lines).join("\n");
}

export function formatDateHeader(d: Date): string {
	return d.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function isMarkdownFilename(name: string): boolean {
	return /\.md$/i.test(name);
}

export function isSkippedPath(path: string, skipPrefixes: readonly string[]): boolean {
	const normalized = path.replaceAll("\\", "/");
	for (const prefix of skipPrefixes) {
		if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
			return true;
		}
	}
	return false;
}

export function extractFrontmatterField(content: string, field: string): string | null {
	const match = /^---\n([\s\S]*?)\n---/.exec(content);
	if (!match) return null;
	const block = match[1] ?? "";
	const fieldMatch = new RegExp(`^${field}:\\s*["']?(.+?)["']?\\s*$`, "m").exec(block);
	return fieldMatch ? (fieldMatch[1] ?? null) : null;
}

export function stripFrontmatter(content: string): string {
	return content.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

export function hasBrainContent(body: string): boolean {
	const trimmed = body.trim();
	// Has substantive content if more than just a heading and a dash
	const lines = trimmed.split("\n").filter((l) => l.trim() && l.trim() !== "-");
	return lines.length > 1;
}

export function parseQmdIndex(manifestJson: string | null): string | null {
	if (!manifestJson) return null;
	try {
		const manifest = JSON.parse(manifestJson) as Record<string, unknown>;
		const index = manifest["qmd_index"];
		return typeof index === "string" && index ? index : null;
	} catch {
		return null;
	}
}

export function qmdArgsWithIndex(index: string | null, args: string[]): string[] {
	if (!index) return args;
	return ["--index", index, ...args];
}

export function parseInfraRootFilenames(manifestJson: string | null): Set<string> {
	if (!manifestJson) return new Set();
	try {
		const manifest = JSON.parse(manifestJson) as Record<string, unknown>;
		const infra = manifest["infrastructure"];
		if (!Array.isArray(infra)) return new Set();
		const names = new Set<string>();
		for (const pattern of infra) {
			if (typeof pattern !== "string") continue;
			// Only collect root-level (no slash) non-glob filenames
			if (!pattern.includes("/") && !pattern.includes("*")) {
				names.add(pattern);
			}
		}
		return names;
	} catch {
		return new Set();
	}
}

export function isInfraFilename(name: string, infraNames: Set<string>): boolean {
	return infraNames.has(name);
}

export function formatBrainIndex(
	entries: Array<{ name: string; description: string | null; hasContent: boolean }>,
): string {
	if (entries.length === 0) return "(no brain notes)";
	return entries
		.map((e) => {
			const desc = e.description ? ` — ${e.description}` : "";
			const marker = e.hasContent ? "" : " *(empty)*";
			return `- [[${e.name}]]${desc}${marker}`;
		})
		.join("\n");
}

export function formatActiveWork(files: string[], limit: number): string {
	if (files.length === 0) return "(none)";
	const shown = files.slice(0, limit).map((f) => `- ${f.replace(/\.md$/i, "")}`);
	const rest = files.length > limit ? [`- … and ${files.length - limit} more`] : [];
	return [...shown, ...rest].join("\n");
}

export function formatRecentChanges(gitLog: string, limit: number): string {
	if (!gitLog.trim()) return "(no recent changes)";
	const lines = gitLog.trim().split("\n").slice(0, limit);
	return lines.map((l) => `- ${l}`).join("\n");
}

export function collectOpenTasks(
	sources: Array<{ path: string; content: string }>,
	limit: number,
): string {
	const tasks: string[] = [];
	for (const { path, content } of sources) {
		const matches = content.match(/^- \[ \] .+$/gm) ?? [];
		for (const task of matches) {
			tasks.push(`${task} *(${path})*`);
			if (tasks.length >= limit) break;
		}
		if (tasks.length >= limit) break;
	}
	return tasks.length > 0 ? tasks.join("\n") : "(none)";
}
