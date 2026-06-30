# Apps

A repo containing a personal knowledge vault and a collection of AI-powered tools.

## [Obsidian Mind](Obsidian%20Mind/) — Personal Knowledge Vault

An AI-enhanced personal knowledge management system built on Obsidian. Open the `Obsidian Mind/` folder as your vault root in Obsidian. Features lifecycle hooks, slash commands for common workflows, and multi-agent support (Claude Code, Codex, Gemini).

See [`CLAUDE.md`](CLAUDE.md) for the full operating manual.

## Projects

### [Feynman](feynman/)

A bundle of 20 Claude Code skills for the scientific research lifecycle, plus 13 reusable prompts and a 4-agent subagent team (researcher, reviewer, writer, verifier). Skills cover the full pipeline from literature search and hypothesis generation through paper writing, peer review, and compute orchestration.

**Skills include:** alpha-research, autoresearch, deep-research, literature-review, paper-writing, peer-review, paper-code-audit, replication, source-comparison, ml-training-recipe, docker, modal-compute, runpod-compute, eli5, jobs, preview, session-log, session-search, contributing, watch

See [`feynman/AGENTS.md`](feynman/AGENTS.md) for agent conventions and [`feynman/skills/`](feynman/skills/) for individual skill docs.

### [Hallmark](hallmark/)

A design skill for AI coding assistants that makes generated UIs look made, not generated. Use for building new pages, auditing existing designs, redesigns, and extracting design patterns from URLs or screenshots.

**Key features:**
- Component library covering navigation, hero sections, carousels, modals, and more
- Theme references: carnival, cobalt, hum, lumen
- Supports greenfield builds, audits, and design extraction from live URLs or images

See [`hallmark/SKILL.md`](hallmark/SKILL.md) for usage.

### [AutoSci](autosci/)

A memory-centric agentic system for the full scientific research lifecycle, powered by Claude Code. Handles everything from literature ingestion and idea generation through experiment execution to paper writing and conference rebuttal.

**Key features:**
- Wiki-based persistent knowledge base with citation graph
- 30+ Claude Code skills covering the end-to-end research workflow
- Daily arXiv recommendation pipeline with email delivery
- Interactive knowledge graph web UI
- Multi-model cross-review via MCP server

See [`autosci/README.md`](autosci/README.md) for setup and usage.

### [NotebookLM](notebooklm/)

Python automation client for Google NotebookLM. List, create, and interact with notebooks; add URL sources; chat with content; and generate audio overviews — all from the command line or Python scripts.

See [`notebooklm/README.md`](notebooklm/README.md) for setup and usage.

### [Thrive Hub](thrive-hub/)

A business dashboard for tracking key metrics and performance indicators.

See [`thrive-hub/`](thrive-hub/) for details.

### [gstack](gstack/)

An open-source AI-powered software factory by Garry Tan (YC President & CEO) that transforms Claude Code into a virtual engineering team. Provides 23+ specialized skills covering the full product development lifecycle — from strategic planning and design through QA, security audits, and shipping.

**Key features:**
- Structured sprint workflow: Think → Plan → Build → Review → Test → Ship → Reflect
- Specialized AI roles: CEO, designer, engineering manager, QA lead, release engineer
- Browser-based QA with AI-controlled Chromium
- Cross-model code review (Claude + OpenAI)
- Persistent knowledge base (GBrain) with local or cloud storage

See [`gstack/README.md`](gstack/README.md) for setup and usage.

### [Scientific Agent Skills](scientific-agent-skills/)

A curated collection of 24 Claude Code skills for scientific research, adapted from the K-Dense-AI open-source library. Covers the full research workflow from literature discovery through data analysis, molecular modeling, and publication.

**Skill categories:**
- Research workflow: literature review, paper lookup, hypothesis generation, experimental design, peer review, citation management
- Data & visualization: Polars, Matplotlib, exploratory data analysis, infographics, LaTeX posters
- Web & search: Exa search, Parallel web, database lookup

See [`scientific-agent-skills/README.md`](scientific-agent-skills/README.md) for setup and usage.
