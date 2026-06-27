# Academic Database Reference

## PubMed (NCBI)

**Base URL:** `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`
**Rate limit:** 3 req/s without key; 10 req/s with `NCBI_API_KEY`
**Documentation:** https://www.ncbi.nlm.nih.gov/books/NBK25499/

```bash
# Search
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=BRCA1+AND+cancer&retmax=100&retmode=json"

# Fetch abstracts
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=12345678,87654321&rettype=abstract&retmode=text"
```

## arXiv

**Base URL:** `https://export.arxiv.org/api/`
**Rate limit:** 1 req/3s; burst of 3 req/s for short periods
**Documentation:** https://info.arxiv.org/help/api/

```bash
curl "https://export.arxiv.org/api/query?search_query=all:CRISPR+AND+all:off-target&max_results=50&sortBy=relevance"
```

## Semantic Scholar

**Base URL:** `https://api.semanticscholar.org/graph/v1/`
**Rate limit:** 100 req/5min without key; register at semanticscholar.org/product/api
**Documentation:** https://api.semanticscholar.org/

```bash
# Search papers
curl "https://api.semanticscholar.org/graph/v1/paper/search?query=transformer+attention+mechanism&fields=title,authors,year,citationCount,externalIds&limit=50"

# Get paper details by ID
curl "https://api.semanticscholar.org/graph/v1/paper/10.1038/nature12373?fields=title,authors,abstract,year,citationCount"
```

## OpenAlex

**Base URL:** `https://api.openalex.org/`
**Rate limit:** 10 req/s without key; register for higher limits
**Documentation:** https://docs.openalex.org/

```bash
# Search works
curl "https://api.openalex.org/works?search=CRISPR+gene+editing&per-page=50&select=title,authorships,publication_year,cited_by_count,doi"
```

## bioRxiv / medRxiv

**Base URL:** `https://api.biorxiv.org/`
**Rate limit:** No published limit; use responsibly
**Documentation:** https://api.biorxiv.org/

```bash
# Search by date range
curl "https://api.biorxiv.org/details/biorxiv/2024-01-01/2024-12-31/0"

# Get specific preprint
curl "https://api.biorxiv.org/details/biorxiv/10.1101/2024.01.15.575000"
```

## Crossref

**Base URL:** `https://api.crossref.org/`
**Rate limit:** 5 req/s anonymous; register for 50 req/s
**Documentation:** https://api.crossref.org/swagger-ui/

```bash
# Search works
curl "https://api.crossref.org/works?query=machine+learning+protein+folding&rows=50&select=DOI,title,author,published,is-referenced-by-count"

# Verify DOI
curl "https://api.crossref.org/works/10.1038/s41586-021-03819-2"
```

## Unpaywall

**Base URL:** `https://api.unpaywall.org/v2/`
**Requires:** Email parameter
**Documentation:** https://unpaywall.org/products/api

```bash
# Check open access availability
curl "https://api.unpaywall.org/v2/10.1038/nature12373?email=researcher@university.edu"
```

## Search String Construction

Use Boolean operators:
```
# Narrow: all terms must appear
BRCA1 AND breast cancer AND mutation

# Broad: any related term
(CRISPR OR CRISPR-Cas9 OR gene editing) AND (off-target OR specificity)

# Exclude: remove unwanted results
(immunotherapy) NOT (review) NOT (meta-analysis)

# Phrase search
"chimeric antigen receptor" AND "T cell"
```

## Journal Tier Reference

**Top Tier (IF > 20):**
Nature, Science, Cell, NEJM, Lancet, JAMA, Nature Medicine, Nature Genetics, Nature Biotechnology, Nature Methods, Immunity, Cancer Cell, Molecular Cell, Developmental Cell, Neuron, PNAS

**High Tier (IF 10–20):**
PLoS Biology, Genome Research, Genome Biology, eLife, Nature Communications, Cell Reports, Science Advances, Journal of Clinical Oncology

**Preprint Servers (no IF, but influential):**
arXiv, bioRxiv, medRxiv, ChemRxiv, ESSOAr
