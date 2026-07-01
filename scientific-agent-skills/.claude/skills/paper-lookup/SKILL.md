---
name: paper-lookup
description: "Structured search across 10 academic databases (PubMed, arXiv, Semantic Scholar, OpenAlex, Crossref, Unpaywall, PMC, bioRxiv, medRxiv, CORE). Use for: finding papers by topic/author/DOI/PMID, citation graphs, open-access PDF links, preprint tracking, and cross-database queries. Do NOT use for general web search — use /web-lookup. Do NOT use for interactive Q&A about a paper's content — use /alpha-research."
argument-hint: "<title or author or DOI or PMID or arXiv ID>"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /paper-lookup

Look up a specific paper or run a targeted search across 10 academic databases. Returns title, authors, abstract, citation count, and open-access links.

## When to invoke

- "find this paper: [title or DOI]"
- "who wrote [paper topic] in [year]?"
- "get me the abstract for PMID 12345678"
- "look up arXiv:2301.12345"

## Databases

| Database | Best for | ID format |
|---|---|---|
| PubMed | Biomedical | PMID, DOI |
| PMC | Full-text biomedical | PMCID |
| bioRxiv | Biology preprints | DOI, biorXiv ID |
| medRxiv | Medicine preprints | DOI |
| arXiv | Physics/CS/Math/QBio | arXiv:YYMM.NNNNN |
| OpenAlex | All disciplines | DOI, OpenAlex ID |
| Crossref | All disciplines (DOI lookup) | DOI |
| Semantic Scholar | All disciplines + citations | DOI, S2 ID |
| CORE | Open access | DOI, CORE ID |
| Unpaywall | Open access PDF | DOI |

## Identifier recognition

Detect the identifier type from the input:
- Starts with `10.` → DOI
- Numeric only (8 digits) → PMID
- Starts with `PMC` → PMCID
- Starts with `arXiv:` or matches `\d{4}\.\d{4,5}` → arXiv ID
- Otherwise → title search

## Workflow

### Step 1: Identify lookup type

```python
def detect_id_type(query):
    if query.startswith("10."):
        return "doi"
    if query.replace("-", "").isdigit() and len(query) >= 7:
        return "pmid"
    if query.upper().startswith("PMC"):
        return "pmcid"
    if "arxiv" in query.lower() or re.match(r'\d{4}\.\d{4,5}', query):
        return "arxiv"
    return "title_search"
```

### Step 2: Route to appropriate database(s)

**DOI lookup:**
```bash
# Primary: Crossref for metadata
curl "https://api.crossref.org/works/{DOI}"
# Secondary: Unpaywall for open access
curl "https://api.unpaywall.org/v2/{DOI}?email=lookup@research.ai"
```

**PMID lookup:**
```bash
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={PMID}&rettype=abstract&retmode=xml"
```

**arXiv lookup:**
```bash
curl "https://export.arxiv.org/api/query?id_list={ARXIV_ID}"
```

**Title search:**
```bash
# Semantic Scholar — best for title search
curl "https://api.semanticscholar.org/graph/v1/paper/search?query={ENCODED_TITLE}&fields=title,authors,year,abstract,citationCount,externalIds,openAccessPdf&limit=5"
```

### Step 3: Return structured result

```markdown
## [Paper Title]

**Authors:** Author1, Author2, ...
**Journal/Venue:** [Journal name] | [Year]
**DOI:** [doi if available]
**PMID:** [pmid if available]
**Citations:** N

### Abstract
[Full abstract]

### Open Access
- PDF: [URL or "Not available"]
- PubMed Central: [PMCID link or "Not available"]

### Identifiers
- DOI: [doi]
- PMID: [pmid]
- arXiv: [arxiv_id]
- Semantic Scholar: [s2_id]
```

## Rate limits and auth

Most databases are free for single lookups. If you need higher rate limits:
- NCBI: set `NCBI_API_KEY` env var (10 req/s vs 3 req/s)
- Semantic Scholar: register at semanticscholar.org/product/api

## Common issues

**Paper not found in any database:**
1. Check for typos in title or DOI
2. Try alternate spellings or author name variations
3. Check bioRxiv/medRxiv for preprint versions
4. Very recent papers (<1 week) may not be indexed yet

**DOI resolves but no abstract:**
- Fetch from publisher directly using DOI resolver: `https://doi.org/{DOI}`
- Check PubMed if it is a biomedical paper
