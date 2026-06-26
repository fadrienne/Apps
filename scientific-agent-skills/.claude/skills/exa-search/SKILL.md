---
name: exa-search
description: Semantic AI-powered web search optimized for scientific and technical content. Unlike keyword search, Exa finds semantically similar content and can search by concept, not just keywords.
argument-hint: "<semantic query> [--type neural|keyword|auto] [--include-domains pubmed.ncbi.nlm.nih.gov,arxiv.org,...] [--date-range]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /exa-search

Search the web with semantic understanding using the Exa API. Finds conceptually similar content even when keywords don't match exactly. Excellent for scientific discovery and finding related work.

## When to invoke

- "find papers about X" (when you want semantic similarity, not keyword match)
- "find recent work on X"
- "what are people writing about X?"
- "find similar research to [description]"

## Setup

```bash
# Install Exa Python client
pip install exa-py

# Set API key
export EXA_API_KEY="your_key_here"
# Get key at: exa.ai/api
```

## Core operations

### Neural search (recommended for scientific content)

```python
from exa_py import Exa
import os

exa = Exa(api_key=os.environ["EXA_API_KEY"])

# Semantic search — finds conceptually related content
results = exa.search(
    "mechanisms of CRISPR-Cas9 off-target DNA cleavage",
    num_results=10,
    type="neural",       # semantic understanding
    use_autoprompt=True, # Exa optimizes your query
)

for r in results.results:
    print(f"{r.title}\n{r.url}\n{r.published_date}\n")
```

### Keyword search with site filters

```python
# Domain-filtered search
results = exa.search(
    "CAR-T cell therapy clinical trial solid tumors",
    num_results=20,
    type="keyword",
    include_domains=["pubmed.ncbi.nlm.nih.gov", "clinicaltrials.gov", "nejm.org"],
)
```

### Date-filtered search (find recent papers)

```python
from datetime import datetime, timedelta

# Find papers from last 6 months
six_months_ago = (datetime.now() - timedelta(days=180)).strftime("%Y-%m-%dT%H:%M:%SZ")

results = exa.search(
    "protein language model antibody design",
    num_results=15,
    type="neural",
    start_published_date=six_months_ago,
    include_domains=["arxiv.org", "biorxiv.org"],
)
```

### Get full text content

```python
# Search and retrieve full text in one call
results = exa.search_and_contents(
    "AlphaFold3 protein-ligand binding prediction",
    num_results=5,
    text=True,               # include full page text
    highlights=True,         # return most relevant excerpts
    highlights_num_sentences=3,
)

for r in results.results:
    print(f"=== {r.title} ===")
    print(f"URL: {r.url}")
    if r.highlights:
        for h in r.highlights:
            print(f"Key excerpt: {h}")
    print()
```

### Find similar content to a URL

```python
# "Papers similar to this one"
similar_papers = exa.find_similar(
    url="https://www.nature.com/articles/s41586-021-03819-2",  # AlphaFold2 paper
    num_results=10,
    exclude_source_domain=False,  # include results from the same site
    include_domains=["arxiv.org", "biorxiv.org", "nature.com", "science.org"],
)

for r in similar_papers.results:
    print(f"{r.title} ({r.published_date})")
    print(f"  {r.url}")
```

### Fetch specific URL content

```python
# Get full text of a known URL
content = exa.get_contents(
    urls=["https://arxiv.org/abs/2303.08774", "https://arxiv.org/abs/2302.01318"],
    text=True,
    highlights=True,
)
```

## Scientific search strategies

### Find landmark papers on a topic

```python
def find_landmark_papers(topic, n=10):
    results = exa.search(
        f"seminal paper introducing {topic}",
        num_results=n,
        type="neural",
        use_autoprompt=True,
        include_domains=[
            "nature.com", "science.org", "cell.com",
            "pnas.org", "nejm.org", "thelancet.com",
            "pubmed.ncbi.nlm.nih.gov", "arxiv.org",
        ],
    )
    return results.results
```

### Track recent preprints

```python
def get_recent_preprints(topic, days=30):
    from datetime import datetime, timedelta
    cutoff = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    results = exa.search(
        topic,
        num_results=20,
        type="neural",
        start_published_date=cutoff,
        include_domains=["arxiv.org", "biorxiv.org", "medRxiv.org", "chemrxiv.org"],
    )
    return results.results
```

### Find competitive landscape

```python
def find_competing_approaches(problem_description):
    results = exa.search_and_contents(
        f"approach method for {problem_description}",
        num_results=15,
        type="neural",
        use_autoprompt=True,
        highlights=True,
        highlights_num_sentences=2,
    )
    return results.results
```

## Output format

```markdown
## Search Results: [Query]

**Search type:** Neural / Keyword
**Date:** YYYY-MM-DD
**Results returned:** N

### Result 1
**Title:** [Paper/page title]
**URL:** [URL]
**Published:** [Date]
**Source:** [Domain]
**Relevance:** [Why this result is relevant]
**Key excerpt:** [Most relevant passage]

### Result 2
[...]
```

## Limitations

- Does not access paywalled content (returns metadata only for subscription journals)
- Coverage focuses on English-language content
- Very recent content (<24h) may not be indexed
- Deep research reports require `/parallel-web --mode deep-research` instead

## Rate limits

| Plan | Rate limit |
|---|---|
| Free | 1,000 searches/month |
| Pro | 10,000 searches/month |
| Enterprise | Unlimited |

Add `time.sleep(1)` between large batch queries.
