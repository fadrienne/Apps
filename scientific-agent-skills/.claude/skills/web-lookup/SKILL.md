---
name: web-lookup
description: "General web search, URL extraction, bulk data enrichment, and deep research reports powered by parallel-cli. Use for: web searches (current events, products, non-paper content, general lookups), fetching a specific URL or web page, enriching a list of entities (companies, people, products) with web-sourced fields, or running exhaustive multi-source deep research reports. Prioritizes academic and scientific sources when the query is technical. Do NOT use for targeted paper/DOI lookups — use /paper-lookup for those. Do NOT use for interactive Q&A about a specific arXiv paper — use /alpha-research for that."
argument-hint: "<search query or URL> [--mode search|extract|enrich|deep-research]"
version: 1.1
author: K-Dense, Inc. (adapted)
---

# /web-lookup

Search the web with academic source prioritization, extract content from URLs, enrich datasets with web-sourced fields, or generate comprehensive deep research reports.

## When to invoke

- "search the web for X"
- "find recent information on X"
- "fetch content from [URL]"
- "deep research on X"
- "enrich these compounds/genes/papers with web data"

## Setup

Requires the `parallel-cli` tool with a Parallel API key.

```bash
# Install
curl -sSL https://parallel.ai/install | sh
# Or via uv:
uv tool install parallel-cli

# Authenticate
export PARALLEL_API_KEY="your_key_here"
# Or:
parallel-cli login
```

## Modes

### Web Search

For finding current information about a topic. Defaults to academic sources.

```bash
# Basic search
parallel-cli search "CRISPR off-target effects 2024"

# With academic source priority
parallel-cli search "mRNA vaccine mechanism" --prefer academic

# Get JSON output
parallel-cli search "protein folding AlphaFold3" --format json
```

**Source prioritization order:**
1. Peer-reviewed journals (PubMed Central, Nature, Science, Cell family, NEJM)
2. Preprint servers (arXiv, bioRxiv, medRxiv, ChemRxiv)
3. Institutional sources (.edu, .gov, WHO, NIH, CDC)
4. Technical reports and white papers
5. General web (last resort)

### URL Extract

Fetch and extract structured content from a specific URL.

```bash
# Extract article text
parallel-cli extract "https://www.nature.com/articles/s41586-023-06562-y"

# Extract with metadata
parallel-cli extract "https://arxiv.org/abs/2303.08774" --metadata

# Extract tables
parallel-cli extract "https://clinical-data-site.com/results" --tables
```

### Data Enrichment

Enrich a list of entities with web-sourced information. More efficient than looping searches.

```bash
# Enrich a list of genes with descriptions
parallel-cli enrich genes.txt --field "function,disease_associations,tissue_expression"

# Enrich compounds with properties
parallel-cli enrich compounds.csv --id-col smiles --field "mechanism,clinical_status"

# Enrich papers with citation counts and abstracts
parallel-cli enrich paper_ids.csv --id-col doi --field "abstract,citations,altmetric"
```

### Deep Research

Generate a comprehensive multi-source research report. **10-100× more expensive than search — use only when explicitly requested.**

```bash
# Full research report (takes 5-15 minutes)
parallel-cli research "What are the current limitations of CAR-T cell therapy?" \
    --depth comprehensive \
    --format markdown \
    --out research_report.md

# Check status (for async jobs)
parallel-cli research status --id <job_id>

# Poll for results
parallel-cli research poll --id <job_id> --wait 600
```

Deep research includes:
- Multi-query search across dozens of sources
- Synthesis across multiple documents
- Fact verification
- Citation tracking
- Structured output with sections

## Academic search strategies

### Boolean search construction

```bash
# Exact phrase
parallel-cli search '"CAR-T cell therapy" "solid tumors" clinical trial'

# Include related terms
parallel-cli search "(CRISPR OR base editing OR prime editing) AND (off-target OR specificity)"

# Exclude irrelevant results
parallel-cli search "immunotherapy checkpoint inhibitor" --exclude "review" --site pubmed.ncbi.nlm.nih.gov

# Date filtering
parallel-cli search "AlphaFold protein structure prediction" --after 2024-01-01
```

### Site-specific search

```bash
# Search only PubMed
parallel-cli search "BRCA1 mutation breast cancer prognosis" --site pubmed.ncbi.nlm.nih.gov

# Search only arXiv
parallel-cli search "transformer protein language model" --site arxiv.org

# Search only ClinicalTrials.gov
parallel-cli search "KRAS inhibitor NSCLC" --site clinicaltrials.gov
```

## Output formats

```bash
# Markdown (default for research reports)
parallel-cli research "topic" --format markdown

# JSON (for programmatic use)
parallel-cli search "query" --format json

# Plain text
parallel-cli extract "URL" --format text

# CSV (for enrichment)
parallel-cli enrich data.csv --format csv
```

## Rate limits and costs

| Mode | Approximate cost | Speed |
|---|---|---|
| Search | Low | ~2-5 seconds |
| Extract | Low | ~3-10 seconds |
| Enrich | Low-Medium | Depends on n items |
| Deep Research | High | 5-15 minutes |

## Integration with other skills

- Use results as input to `/literature-review` for systematic synthesis
- Feed drug names to `/database-lookup` for chemical details
- Pass gene lists to `/pathway-enrichment` after enrichment
- Extract paper DOIs and verify with `/citation-management`

## Privacy and sourcing

- All sources are cited with URLs
- No content from paywalled sources (respects robots.txt)
- Academic sources preferred over commercial
- Results include publication date and source credibility indicators
