/**
 * Regex boundary logic for message classification using Latin-letter
 * lookarounds instead of \b for CJK-safe word boundaries.
 */

type Signal = {
	readonly pattern: RegExp;
	readonly hint: string;
};

const SIGNALS: readonly Signal[] = [
	{
		pattern: /(?<![a-zA-Z])(decided|decision|we('re| are) going to|agreed to|chose to|going with)(?![a-zA-Z])/i,
		hint: "DECISION detected — capture in Obsidian Mind/brain/Key Decisions.md with date, context, and rationale. Link to the relevant work note.",
	},
	{
		pattern: /(?<![a-zA-Z])(incident|outage|pager|on-?call|postmortem|retrospective|rca|root cause|sev[0-9]|severity)(?![a-zA-Z])/i,
		hint: "INCIDENT detected — use /om-incident-capture or create a note in Obsidian Mind/work/incidents/ with proper frontmatter (ticket, severity, role).",
	},
	{
		pattern: /(?<![a-zA-Z])(1:?1|one[- ]on[- ]one|1-on-1|sync with|catch[- ]up with|met with|meeting with)(?![a-zA-Z])/i,
		hint: "1:1 detected — use /om-capture-1on1 to create a structured note in Obsidian Mind/work/1-1/.",
	},
	{
		pattern: /(?<![a-zA-Z])(shipped|launched|released|deployed|merged|published|presented|demo'?d|won|closed|fixed|resolved|completed)(?![a-zA-Z])/i,
		hint: "WIN detected — add to Obsidian Mind/perf/Brag Doc.md or the current quarter brag note. Link to competency evidence.",
	},
	{
		pattern: /(?<![a-zA-Z])(architecture|design doc|ADR|RFC|proposal|schema|database|api design|system design)(?![a-zA-Z])/i,
		hint: "ARCHITECTURE detected — capture in Obsidian Mind/reference/ or Obsidian Mind/work/active/ with proper frontmatter. Link to [[Key Decisions]] if a decision was made.",
	},
	{
		pattern: /(?<![a-zA-Z])(hired|joined|left|promoted|transferred|new eng|new hire|onboarding|offboarding)(?![a-zA-Z])/i,
		hint: "PERSON/ORG change detected — update Obsidian Mind/org/people/ or Obsidian Mind/org/teams/ as needed. Update [[People & Context]] if the org structure changed.",
	},
	{
		pattern: /(?<![a-zA-Z])(project update|status update|weekly update|EOW|end of week|sprint review|roadmap|OKR|milestone)(?![a-zA-Z])/i,
		hint: "PROJECT UPDATE detected — update the relevant Obsidian Mind/work/active/ note. Check if Obsidian Mind/work/Index.md needs updating.",
	},
];

export function classify(prompt: string): string[] {
	const matched: string[] = [];
	for (const signal of SIGNALS) {
		if (signal.pattern.test(prompt)) {
			matched.push(signal.hint);
		}
	}
	return matched;
}
