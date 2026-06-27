# Scientific Agent Skills

A curated collection of agent skills for scientific research, adapted from the [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) open-source collection.

## Skills

### Search & Discovery

| Skill | Description |
|---|---|
| `/literature-review` | Systematic literature reviews across PubMed, arXiv, Semantic Scholar, and more |
| `/paper-lookup` | Quick paper search across 10+ academic databases |
| `/database-lookup` | Query public scientific databases via REST APIs |
| `/exa-search` | Semantic AI-powered web search for scientific content |
| `/parallel-web` | Parallel web search with academic source prioritization |

### Research Methodology

| Skill | Description |
|---|---|
| `/hypothesis-generation` | Generate 3–5 competing testable hypotheses from evidence |
| `/experimental-design` | Statistical design of experiments (randomization, blocking, factorial) |
| `/exploratory-data-analysis` | EDA across 200+ scientific file formats |

### Scientific Communication

| Skill | Description |
|---|---|
| `/citation-management` | Format, deduplicate, and validate bibliographies |
| `/peer-review` | Structured paper review following journal standards |
| `/infographics` | Scientific infographics and data visualization |
| `/latex-posters` | Conference poster generation in LaTeX |

### Data Analysis

| Skill | Description |
|---|---|
| `/matplotlib` | Publication-quality scientific figures |
| `/polars` | High-performance data analysis and transformation |

## Installation

```bash
# Install skills globally for Claude Code
./setup.sh

# Or install per-project
./setup.sh --project
```

## Requirements

- Python 3.10+
- Claude Code
- Skill-specific dependencies (see each skill's SKILL.md)

## Usage

Once installed, invoke skills in Claude Code conversations:

```
/literature-review "CRISPR off-target effects in therapeutic applications"
/hypothesis-generation "Why do some cancer cells resist immunotherapy?"
/experimental-design factorial treatment:drug dose:3 replicates:5
```

## Credits

Skills adapted from [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) (MIT License) by K-Dense Inc.
