#!/usr/bin/env node
/**
 * Cross-platform MCP launcher for QMD.
 * Bypasses Windows .cmd/.ps1 shims by spawning qmd.js with Node binary.
 */

import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { env, homedir } from "node:process";
import { platform } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveVaultRoot() {
	// scripts live at .claude/scripts/ → vault root two levels up
	return dirname(dirname(__dirname));
}

function resolveQmdEntry() {
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

function readQmdIndex(vaultRoot) {
	try {
		const raw = readFileSync(join(vaultRoot, "vault-manifest.json"), { encoding: "utf-8" });
		const manifest = JSON.parse(raw);
		return typeof manifest.qmd_index === "string" ? manifest.qmd_index : null;
	} catch {
		return null;
	}
}

function resolveIndexSqlitePath(indexName) {
	const cacheBase = env["XDG_CACHE_HOME"] ?? join(homedir(), ".cache");
	return join(cacheBase, "qmd", `${indexName}.db`);
}

function buildLaunchCommand(entry, qmdIndex, sqlitePath) {
	const args = entry
		? [entry, "mcp"]
		: ["qmd", "mcp"];
	const cmd = entry ? process.execPath : "qmd";
	const extraArgs = qmdIndex ? ["--index", qmdIndex] : [];
	const extraEnv = sqlitePath ? { INDEX_PATH: sqlitePath } : {};
	return { cmd, args: [...(entry ? [entry] : []), "mcp", ...extraArgs], shell: !entry, extraEnv };
}

async function runAsMcp() {
	const vaultRoot = resolveVaultRoot();
	const entry = resolveQmdEntry();
	const qmdIndex = readQmdIndex(vaultRoot);
	const sqlitePath = qmdIndex ? resolveIndexSqlitePath(qmdIndex) : null;
	const { cmd, args, shell, extraEnv } = buildLaunchCommand(entry, qmdIndex, sqlitePath);

	const child = spawn(cmd, args, {
		stdio: "inherit",
		shell,
		env: { ...env, ...extraEnv },
		cwd: vaultRoot,
	});

	child.on("error", (err) => {
		process.stderr.write(`qmd-mcp: failed to start: ${err.message}\n`);
		process.exit(1);
	});

	child.on("exit", (code) => process.exit(code ?? 0));
}

runAsMcp();
