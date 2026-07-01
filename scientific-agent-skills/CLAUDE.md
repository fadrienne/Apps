# Scientific Agent Skills

A curated collection of Claude Code skills for scientific research. Each skill lives under `.claude/skills/<name>/SKILL.md`.

## Skill Routing

When the user's request matches a skill below, invoke it via the Skill tool.

| User intent | Skill |
|---|---|
| "find papers on X", "literature review", "what's known about X" | `/literature-review` |
| "look up this paper", "find paper by author/DOI", "get paper details" | `/paper-lookup` |
| "query a scientific database", "look up a compound or dataset" | `/database-lookup` |
| "search the web for X", "find recent news on X", "fetch this URL", "enrich this list" | `/exa-search` or `/web-lookup` |
| "generate hypotheses for X", "why does X happen", "explain X mechanistically" | `/hypothesis-generation` |
| "design an experiment to test X", "how many replicates do I need", "randomize my treatment groups" | `/experimental-design` |
| "explore this dataset", "what's in this file", "summarize these data" | `/exploratory-data-analysis` |
| "format my references", "check my citations", "deduplicate bibliography" | `/citation-management` |
| "review this paper", "peer review", "critique this manuscript" | `/peer-review` |
| "make an infographic", "visualize these findings", "create a summary figure" | `/infographics` |
| "make a poster", "conference poster", "create a scientific poster" | `/latex-posters` |
| "plot this data", "make a figure", "publication figure", "matplotlib" | `/matplotlib` |
| "analyze this CSV", "fast data processing", "data transformation", "polars" | `/polars` |

## Skill Directory

All skills are installed under `.claude/skills/` (project-local) or `~/.claude/skills/` (global).

## Notes

- Skills are adapted from K-Dense-AI/scientific-agent-skills (MIT License)
- Most skills require domain-specific Python packages; see each SKILL.md for dependencies
- API keys may be required for some database and search skills
