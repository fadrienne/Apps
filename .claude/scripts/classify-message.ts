#!/usr/bin/env node
/**
 * UserPromptSubmit hook — classify user messages and inject routing hints.
 */

import { debug, readStdinJson, writeHookOutput } from "./lib/hook-io.ts";
import { classify } from "./lib/matcher.ts";

type HookInput = {
	readonly prompt?: unknown;
	readonly hook_event_name?: unknown;
};

const input = await readStdinJson<HookInput>();
if (!input) {
	debug("classify: null input (bad/empty stdin)");
	process.exit(0);
}

const prompt = input.prompt;
if (typeof prompt !== "string" || !prompt) {
	debug(`classify: no usable prompt (type=${typeof prompt})`);
	process.exit(0);
}

const signals = classify(prompt);
debug(`classify: matched ${signals.length} signal(s)`);

if (signals.length > 0) {
	const hints = signals.map((s) => `- ${s}`).join("\n");
	const additionalContext =
		"Content classification hints (act on these if the user's message contains relevant info):\n" +
		hints +
		"\n\nRemember: use proper templates, add [[wikilinks]], follow CLAUDE.md conventions.";

	const eventName =
		typeof input.hook_event_name === "string"
			? input.hook_event_name
			: "UserPromptSubmit";

	writeHookOutput(eventName, additionalContext);
}

process.exit(0);
