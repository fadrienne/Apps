/**
 * Detects if the current ESM module was invoked directly as a script.
 * Equivalent to CommonJS `require.main === module`.
 */

import { fileURLToPath } from "node:url";

export function isMainModule(importMetaUrl: string): boolean {
	try {
		const scriptPath = fileURLToPath(importMetaUrl);
		const mainPath = process.argv[1];
		if (!mainPath) return false;
		// Normalize both paths to handle symlinks and OS differences
		return scriptPath === mainPath || scriptPath.endsWith(mainPath);
	} catch {
		return false;
	}
}
