#!/usr/bin/env node
/**
 * Count characters in a specific markdown section.
 * Usage: node charcount.ts <file> <section> [subsection] [--limit N]
 */

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const limitIdx = args.indexOf("--limit");
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1] ?? "0", 10) : null;
const positional = args.filter((_, i) => i !== limitIdx && i !== limitIdx + 1);

const [filePath, section, subsection] = positional;

if (!filePath || !section) {
	process.stderr.write("Usage: charcount.ts <file> <section> [subsection] [--limit N]\n");
	process.exit(1);
}

let content: string;
try {
	content = readFileSync(filePath, { encoding: "utf-8" });
} catch {
	process.stderr.write(`Error: cannot read file ${filePath}\n`);
	process.exit(1);
}

function extractSection(text: string, heading: string, sub?: string): string | null {
	const headingRe = new RegExp(`^#{1,6}\\s+${escapeRe(heading)}\\s*$`, "mi");
	const match = headingRe.exec(text);
	if (!match) return null;

	const start = match.index + match[0].length;
	const level = (match[0].match(/^#+/) ?? [""])[0].length;
	const nextHeadingRe = new RegExp(`^#{1,${level}}\\s`, "m");
	const rest = text.slice(start);
	const nextMatch = nextHeadingRe.exec(rest);
	const sectionText = nextMatch ? rest.slice(0, nextMatch.index) : rest;

	if (!sub) return sectionText.trim();
	return extractSection(sectionText, sub);
}

function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const extracted = extractSection(content, section, subsection);
if (extracted === null) {
	process.stderr.write(`Section "${section}"${subsection ? ` > "${subsection}"` : ""} not found\n`);
	process.exit(1);
}

const charCount = extracted.length;
process.stdout.write(`${charCount} characters\n`);

if (limit !== null) {
	if (charCount > limit) {
		process.stderr.write(`Over limit: ${charCount} > ${limit}\n`);
		process.exit(1);
	}
	process.stdout.write(`Within limit: ${charCount}/${limit}\n`);
}

process.exit(0);
