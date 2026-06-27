/**
 * Validation logic for the validate-write hook.
 */

import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";

const SKIP_DIRS = [
	".claude",
	".codex",
	".gemini",
	".shardmind",
	".obsidian",
	"templates",
	"thinking",
	"scripts",
	"bases",
];

const SKIP_ROOT_FILES = [
	"CLAUDE.md",
	"AGENTS.md",
	"GEMINI.md",
	"README.md",
	"Home.md",
];

const ROOT_README_RE = /^README(\.[a-z]{2}(-[A-Z]{2})?)?\.md$/;

export function shouldSkipFile(filePath: string): boolean {
	const normalized = filePath.replaceAll("\\", "/");

	if (extname(normalized).toLowerCase() !== ".md") return true;

	const parts = normalized.split("/");
	const filename = parts[parts.length - 1] ?? "";

	// Skip root-level infra files
	if (parts.length <= 2 && SKIP_ROOT_FILES.includes(filename)) return true;
	if (ROOT_README_RE.test(filename)) return true;

	// Skip files in infra directories
	for (const dir of SKIP_DIRS) {
		if (parts.includes(dir)) return true;
	}

	return false;
}

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

function hasFrontmatterField(content: string, field: string): boolean {
	const match = FRONTMATTER_RE.exec(content);
	if (!match) return false;
	const block = match[1] ?? "";
	return new RegExp(`^${field}:`, "m").test(block);
}

function hasFrontmatter(content: string): boolean {
	return FRONTMATTER_RE.test(content);
}

function hasWikilink(content: string): boolean {
	return /\[\[[^\]]+\]\]/.test(content);
}

function detectNoteType(filePath: string): string {
	const normalized = filePath.replaceAll("\\", "/");
	if (normalized.includes("work/incidents/")) return "incident";
	if (normalized.includes("work/1-1/")) return "1-1";
	if (normalized.includes("org/people/")) return "person";
	if (normalized.includes("org/teams/")) return "team";
	if (normalized.includes("work/")) return "work-note";
	if (normalized.includes("perf/")) return "perf";
	return "general";
}

export function validateContent(content: string, filePath: string): string[] {
	const warnings: string[] = [];

	if (!hasFrontmatter(content)) {
		warnings.push("Missing frontmatter block (--- ... ---)");
		return warnings;
	}

	if (!hasFrontmatterField(content, "date")) {
		warnings.push("Frontmatter missing `date` field");
	}
	if (!hasFrontmatterField(content, "description")) {
		warnings.push("Frontmatter missing `description` field");
	}
	if (!hasFrontmatterField(content, "tags")) {
		warnings.push("Frontmatter missing `tags` field");
	}

	const noteType = detectNoteType(filePath);
	if (noteType === "work-note" || noteType === "incident" || noteType === "1-1") {
		if (!hasFrontmatterField(content, "status")) {
			warnings.push("Work note missing `status` field (active|completed|archived|on-hold)");
		}
		if (!hasFrontmatterField(content, "quarter")) {
			warnings.push("Work note missing `quarter` field (e.g. Q2 2026)");
		}
	}

	if (noteType === "incident") {
		for (const f of ["ticket", "severity", "role"]) {
			if (!hasFrontmatterField(content, f)) {
				warnings.push(`Incident note missing \`${f}\` field`);
			}
		}
	}

	if (!hasWikilink(content)) {
		warnings.push("Note has no [[wikilinks]] — every note must link to at least one other note");
	}

	return warnings;
}

export function validateFile(filePath: string): string[] | null {
	try {
		const content = readFileSync(filePath, { encoding: "utf-8" });
		return validateContent(content, filePath);
	} catch {
		return null;
	}
}
