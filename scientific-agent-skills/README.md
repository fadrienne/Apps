# Scientific Agent Skills

A curated collection of 24 agent skills for scientific research, adapted from the [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) open-source collection. Transforms Claude Code into a powerful research assistant across biology, chemistry, medicine, and data science.

## Skills

### Search & Discovery

| Skill | Description |
|---|---|
| `/literature-review` | Systematic literature reviews across PubMed, arXiv, Semantic Scholar, and more |
| `/paper-lookup` | Quick paper search across 10+ academic databases |
| `/database-lookup` | Query 78+ public scientific databases via REST APIs |
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

### Bioinformatics

| Skill | Description |
|---|---|
| `/biopython` | Computational biology: sequences, BLAST, PDB, phylogenetics |
| `/gget` | Genomic data retrieval from Ensembl, UniProt, NCBI |
| `/bulk-rnaseq` | RNA-seq differential expression analysis pipeline |
| `/pathway-enrichment` | GO/KEGG biological pathway enrichment analysis |

### Chemistry & Drug Discovery

| Skill | Description |
|---|---|
| `/datamol` | Molecular manipulation and ADMET prediction |
| `/deepchem` | Deep learning for drug discovery and molecular property prediction |
| `/molecular-dynamics` | Molecular dynamics simulation with GROMACS/OpenMM |

### Data Analysis

| Skill | Description |
|---|---|
| `/matplotlib` | Publication-quality scientific figures |
| `/polars` | High-performance data analysis and transformation |
| `/networkx` | Network/graph analysis for biological and social networks |

### Clinical & Health

| Skill | Description |
|---|---|
| `/clinical-decision-support` | Evidence-based clinical decision tools |
| `/pyhealth` | Healthcare machine learning and clinical prediction |

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
/database-lookup compound:aspirin databases:PubChem,ChEMBL
/hypothesis-generation "Why do some cancer cells resist immunotherapy?"
/experimental-design factorial treatment:drug dose:3 replicates:5
```

## Credits

Skills adapted from [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) (MIT License) by K-Dense Inc.
