---
name: literature-review
description: Conduct systematic, comprehensive literature reviews following rigorous academic methodology. Searches multiple databases, synthesizes findings, verifies citations, and generates professional markdown and PDF outputs.
argument-hint: "<research question or topic> [--scope narrow|broad] [--years N] [--max-papers N]"
version: 1.2
author: K-Dense, Inc. (adapted)
---

# /literature-review

Conduct a systematic literature review across academic databases and synthesize findings into a professional report. Every review MUST include PRISMA-style tracking of papers found, screened, and included.

## When to invoke

- "literature review on X"
- "what's known about X"
- "find papers about X and summarize"
- "systematic review of X"

## Databases to search (in order)

1. **PubMed** — biomedical and life sciences
2. **arXiv** — physics, math, CS, quantitative biology
3. **bioRxiv / medRxiv** — biology and medicine preprints
4. **Semantic Scholar** — cross-disciplinary with citation metrics
5. **OpenAlex** — open access multidisciplinary
6. **Crossref** — DOI resolution and metadata

See `references/databases.md` for API endpoints and rate limits.

## Workflow

### Phase 1: Scoping

1. Parse the research question using the PICO framework:
   - **P**opulation / Problem
   - **I**ntervention / Exposure
   - **C**omparison / Control
   - **O**utcome

2. Define inclusion/exclusion criteria:
   - Study types (RCT, meta-analysis, case study, etc.)
   - Date range (default: last 10 years unless user specifies)
   - Language (default: English)
   - Publication status (include preprints by default)

3. Generate Boolean search string:
   ```
   (primary_term OR synonym1 OR synonym2) AND (context_term) NOT (exclusion_term)
   ```

### Phase 2: Database Search

Search each database in parallel. For each hit, collect:
- Title, authors, year, journal/venue
- DOI or arXiv ID
- Abstract
- Citation count (where available)

De-duplicate across databases by DOI first, then by normalized title similarity.

Track counts at each stage (PRISMA-style):
- Records identified per database
- Records after deduplication
- Records after title/abstract screening
- Records after full-text assessment
- Records included in synthesis

### Phase 3: Screening

Screen by relevance to research question:
1. Title screening (exclude clearly irrelevant)
2. Abstract screening (apply inclusion/exclusion criteria)
3. Full-text review (for borderline cases)

Prioritize papers with:
- High citation counts (>50 citations for older papers)
- Publication in high-tier venues (Nature, Science, Cell, NEJM, Lancet, PNAS, top-tier CS conferences)
- Landmark or first-in-field papers regardless of recency

### Phase 4: Data Extraction

For each included paper, extract:
- Study design and methodology
- Sample size / dataset size
- Key findings and effect sizes
- Limitations acknowledged by authors
- Conflicts of interest

### Phase 5: Synthesis

Organize findings **thematically**, not study-by-study:
1. Identify 3–7 major themes
2. Map papers to themes
3. Note convergent findings and contradictions
4. Identify gaps in the literature
5. Assess overall quality of evidence

### Phase 6: Citation Verification

Verify that all cited papers exist:

```python
# For each included paper:
# 1. Resolve DOI to confirm the paper exists
# 2. Verify author names match
# 3. Check year and journal are correct
import requests

def verify_doi(doi):
    r = requests.get(f"https://api.crossref.org/works/{doi}")
    return r.status_code == 200
```

### Phase 7: Report Generation

Write a professional literature review report:

```markdown
# Literature Review: [Topic]

**Date:** YYYY-MM-DD
**Databases searched:** PubMed, arXiv, Semantic Scholar, ...
**Search period:** YYYY–YYYY
**Total papers identified:** N
**Papers included in synthesis:** N

## PRISMA Flow
- Identified: N (PubMed: x, arXiv: y, Semantic Scholar: z)
- After deduplication: N
- After screening: N
- Included: N

## Background
[2–3 paragraphs contextualizing the topic]

## Theme 1: [Title]
[Synthesis of papers on this theme, cited inline]

## Theme 2: [Title]
...

## Gaps and Future Directions
...

## Conclusions
...

## References
[Full bibliography in APA format]
```

## Quality standards

- Cite **minimum 20 papers** for a focused review; 50+ for a broad survey
- Every factual claim requires a citation
- Distinguish empirical findings from reviews/meta-analyses
- Flag contradictory findings explicitly

## Output files

- `literature-review-[topic-slug]-[date].md` — main report
- `literature-review-[topic-slug]-[date].bib` — BibTeX references
