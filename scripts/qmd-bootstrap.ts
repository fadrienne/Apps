#!/usr/bin/env node
/**
 * One-time QMD bootstrap for a fresh obsidian-mind clone.
 * Registers the vault, attaches context metadata, syncs ignore patterns,
 * and builds the initial search index with vector embeddings.
 *
 * Idempotent: safe to run multiple times.
 *
 * Usage: node --experimental-strip-types scripts/qmd-bootstrap.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const vaultRoot = resolve(__dirname, "..");

function readManifest(): Record<string, unknown> {
	const path = join(vaultRoot, "vault-manifest.json");
	try {
		return JSON.parse(readFileSync(path, { encoding: "utf-8" })) as Record<string, unknown>;
	} catch {
		throw new Error(`Cannot read vault-manifest.json at ${path}`);
	}
}

function resolveQmdEntry(): string | null {
	try {
		const req = createRequire(import.meta.url);
		const pkg = req.resolve("@tobilu/qmd/package.json");
		const dir = pkg.replace(/[/\\]package\.json$/, "");
		for (const rel of ["dist/cli.js", "bin/qmd.js"]) {
			const p = join(dir, rel);
			if (existsSync(p)) return p;
		}
	} catch { /* fall through */ }
	return null;
}

function qmd(args: string[], opts: { cwd?: string } = {}): boolean {
	const entry = resolveQmdEntry();
	const cmd = entry ? process.execPath : "qmd";
	const cmdArgs = entry ? [entry, ...args] : args;

	process.stdout.write(`  qmd ${args.join(" ")}\n`);
	const result = spawnSync(cmd, cmdArgs, {
		stdio: "inherit",
		shell: !entry,
		cwd: opts.cwd ?? vaultRoot,
		timeout: 300_000,
	});

	if (result.error) {
		process.stderr.write(`  error: ${result.error.message}\n`);
		return false;
	}
	return result.status === 0;
}

const manifest = readManifest();
const qmdIndex = typeof manifest["qmd_index"] === "string" ? manifest["qmd_index"] : "obsidian-mind";
const qmdContext = typeof manifest["qmd_context"] === "string" ? manifest["qmd_context"] : "";

process.stdout.write(`Bootstrapping QMD index "${qmdIndex}" for vault at ${vaultRoot}\n\n`);

const steps = [
	{ label: "Register vault", args: ["register", vaultRoot, "--name", qmdIndex] },
	...(qmdContext ? [{ label: "Set context", args: ["context", "--index", qmdIndex, "--set", qmdContext] }] : []),
	{ label: "Update index", args: ["--index", qmdIndex, "update"] },
	{ label: "Build embeddings", args: ["--index", qmdIndex, "embed"] },
];

let failed = false;
for (const step of steps) {
	process.stdout.write(`\n→ ${step.label}\n`);
	if (!qmd(step.args)) {
		process.stderr.write(`  FAILED: ${step.label}\n`);
		failed = true;
		break;
	}
}

if (failed) {
	process.stderr.write("\nBootstrap failed. Is @tobilu/qmd installed? npm install -g @tobilu/qmd\n");
	process.exit(1);
}

process.stdout.write("\n✓ QMD bootstrap complete. Semantic search is now available.\n");
process.stdout.write(`  Try: qmd --index ${qmdIndex} query "what did I ship this quarter?"\n`);
