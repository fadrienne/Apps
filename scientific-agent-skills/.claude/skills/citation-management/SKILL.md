---
name: citation-management
description: Format, deduplicate, validate, and convert bibliographies. Supports APA, MLA, Chicago, Vancouver, and BibTeX. Resolves DOIs and verifies citations against live databases.
argument-hint: "<bibliography file or inline citations> [--format apa|mla|chicago|vancouver|bibtex] [--verify]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /citation-management

Clean up, format, verify, and convert bibliographies. Resolve DOIs to canonical metadata, remove duplicates, and output publication-ready reference lists.

## When to invoke

- "format my references in APA"
- "check my citations"
- "deduplicate bibliography"
- "convert to BibTeX"
- "verify these references exist"

## Supported input formats

- Raw text references (any format, auto-detected)
- BibTeX (`.bib`)
- RIS (`.ris`)
- CSV/TSV with title, author, year columns
- Inline DOIs or PMIDs

## Workflow

### Step 1: Parse input references

Detect format and extract structured fields:

```python
import re

def parse_reference_block(text):
    """Try to extract DOI or key fields from a free-text reference."""
    doi_match = re.search(r'10\.\d{4,}/\S+', text)
    pmid_match = re.search(r'PMID:?\s*(\d{7,8})', text, re.I)
    arxiv_match = re.search(r'arXiv:(\d{4}\.\d{4,5})', text, re.I)
    
    return {
        "doi": doi_match.group() if doi_match else None,
        "pmid": pmid_match.group(1) if pmid_match else None,
        "arxiv_id": arxiv_match.group(1) if arxiv_match else None,
        "raw": text.strip(),
    }
```

### Step 2: Resolve to canonical metadata

For each reference with a DOI, PMID, or arXiv ID, fetch canonical metadata:

```python
import requests

def resolve_doi(doi):
    """Get canonical metadata from Crossref."""
    r = requests.get(
        f"https://api.crossref.org/works/{doi}",
        headers={"User-Agent": "citation-manager/1.0 (mailto:user@domain.com)"}
    )
    if r.status_code == 200:
        return r.json()["message"]
    return None

def resolve_pmid(pmid):
    """Get canonical metadata from PubMed."""
    r = requests.get(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
        params={"db": "pubmed", "id": pmid, "rettype": "abstract", "retmode": "json"}
    )
    return r.json() if r.status_code == 200 else None
```

### Step 3: Deduplicate

Identify duplicates using:
1. Exact DOI match
2. Normalized title similarity (lowercase, strip punctuation, compare)
3. Author + year + first word of title

```python
from difflib import SequenceMatcher

def normalize_title(title):
    return re.sub(r'[^\w\s]', '', title.lower()).strip()

def are_duplicates(ref1, ref2):
    if ref1.get("doi") and ref1.get("doi") == ref2.get("doi"):
        return True
    t1 = normalize_title(ref1.get("title", ""))
    t2 = normalize_title(ref2.get("title", ""))
    if t1 and t2:
        ratio = SequenceMatcher(None, t1, t2).ratio()
        return ratio > 0.90
    return False
```

### Step 4: Format citations

**APA 7th edition:**
```python
def format_apa(ref):
    authors = format_authors_apa(ref["authors"])
    year = ref.get("published-print", {}).get("date-parts", [[ref.get("year", "n.d.")]])[0][0]
    title = ref.get("title", [""])[0]
    journal = ref.get("container-title", [""])[0]
    volume = ref.get("volume", "")
    issue = ref.get("issue", "")
    pages = ref.get("page", "")
    doi = ref.get("DOI", "")
    
    vol_issue = f"{volume}({issue})" if issue else volume
    return f"{authors} ({year}). {title}. *{journal}*, *{vol_issue}*, {pages}. https://doi.org/{doi}"
```

**BibTeX:**
```python
def format_bibtex(ref, key=None):
    if key is None:
        first_author = ref["authors"][0].split(",")[0].strip()
        year = ref.get("year", "0000")
        key = f"{first_author}{year}"
    
    lines = [f"@article{{{key},"]
    lines.append(f'  author = {{{format_authors_bibtex(ref["authors"])}}},')
    lines.append(f'  title = {{{ref["title"]}}},')
    lines.append(f'  journal = {{{ref["journal"]}}},')
    lines.append(f'  year = {{{ref["year"]}}},')
    if ref.get("volume"): lines.append(f'  volume = {{{ref["volume"]}}},')
    if ref.get("pages"): lines.append(f'  pages = {{{ref["pages"]}}},')
    if ref.get("doi"): lines.append(f'  doi = {{{ref["doi"]}}},')
    lines.append("}")
    return "\n".join(lines)
```

Supported output formats: APA, MLA, Chicago (author-date), Vancouver, BibTeX, RIS.

### Step 5: Verify citations (--verify flag)

For each reference, confirm it exists:

```python
def verify_reference(ref):
    if ref.get("doi"):
        r = requests.head(f"https://doi.org/{ref['doi']}", allow_redirects=True)
        return {"doi": ref["doi"], "status": "verified" if r.status_code == 200 else "not_found"}
    if ref.get("pmid"):
        r = requests.get(f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={ref['pmid']}&retmode=json")
        data = r.json()
        return {"pmid": ref["pmid"], "status": "verified" if not data.get("result", {}).get("ERROR") else "not_found"}
    return {"raw": ref.get("raw"), "status": "unverifiable_no_id"}
```

## Output

```markdown
# Bibliography Report

**Input:** N references
**After deduplication:** N unique
**Verified:** N/N (with --verify)
**Format:** APA 7th / BibTeX / ...

## Issues Found

| # | Reference | Issue |
|---|---|---|
| 3 | Smith et al. 2020 | DOI not resolving |
| 7 | Jones & Brown 2018 | Duplicate of reference 2 |

## Formatted Bibliography

[Full formatted reference list]
```

Also saves:
- `bibliography.[format]` — formatted output
- `bibliography.bib` — BibTeX (always generated as secondary output)
