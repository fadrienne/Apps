# Patents & Regulatory Databases

## USPTO Patent Full-Text (PatentsView)

**Base URL:** `https://search.patentsview.org/api/v1`
**Auth:** API key header `X-Api-Key: $PATENTSVIEW_KEY` — free at patentsview.org/apis

```bash
# Search patents by keyword
curl -H "X-Api-Key: $PATENTSVIEW_KEY" \
  "https://search.patentsview.org/api/v1/patent/?q={%22_text_phrase%22:{%22patent_abstract%22:%22CRISPR+gene+editing%22}}&f=[%22patent_id%22,%22patent_title%22,%22patent_date%22,%22assignee_organization%22]&o={%22per_page%22:10}"

# Inventor lookup
curl -H "X-Api-Key: $PATENTSVIEW_KEY" \
  "https://search.patentsview.org/api/v1/inventor/?q={%22inventor_last_name%22:%22Doudna%22}&f=[%22inventor_id%22,%22inventor_first_name%22,%22inventor_last_name%22,%22patent_id%22]"
```

## EPO Open Patent Services (OPS)

**Base URL:** `https://ops.epo.org/3.2`
**Auth:** OAuth2 — register at developers.epo.org

```bash
# Get patent by application number
curl -H "Authorization: Bearer $EPO_TOKEN" \
  "https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/EP3354328/biblio"

# Full text search
curl -H "Authorization: Bearer $EPO_TOKEN" \
  "https://ops.epo.org/3.2/rest-services/published-data/search?q=ta%3Dcrispr+AND+pd%3D20200101-20231231&Range=1-10"
```

## Google Patents (via SerpAPI)

```python
import requests

def search_google_patents(query, n=10):
    r = requests.get("https://serpapi.com/search", params={
        "engine": "google_patents",
        "q": query,
        "num": n,
        "api_key": os.environ["SERPAPI_KEY"],
    })
    return r.json().get("organic_results", [])
```

## FDA Drug Approval History

**Base URL:** `https://api.fda.gov/drug/drugsfda.json`

```bash
# Approved drugs for a condition (oncology)
curl "https://api.fda.gov/drug/drugsfda.json?search=products.te_code:AA&limit=10&api_key=$FDA_API_KEY"

# Drug by active ingredient
curl "https://api.fda.gov/drug/drugsfda.json?search=products.active_ingredients.name:pembrolizumab&limit=5"

# Application number lookup
curl "https://api.fda.gov/drug/drugsfda.json?search=application_number:BLA761060&limit=1"
```

## EMA (European Medicines Agency)

**Base URL:** `https://www.ema.europa.eu/en/medicines/find-medicine/human-medicines`
**EPAR Data:** Downloadable at ema.europa.eu/en/medicines/download-medicine-data

```python
import pandas as pd

# Download EPAR product data (updated monthly)
url = "https://www.ema.europa.eu/sites/default/files/Medicines_output_european_public_assessment_reports.xlsx"
epar = pd.read_excel(url, skiprows=8)  # header row offset
```

## ClinicalTrials.gov (Regulatory filings)

See `clinical-disease.md` — ClinicalTrials.gov is also a regulatory submission database under FDA Amendments Act.

## Common Patent Identifiers

| Identifier | Format | Example |
|---|---|---|
| US patent number | `US[0-9]+` | `US10,781,450` |
| US application | `US[0-9]+/[0-9]+` | `US15/123,456` |
| EP publication | `EP[0-9]+` | `EP3354328` |
| PCT application | `PCT/[A-Z]+[0-9]+/[0-9]+` | `PCT/US2019/012345` |
| Patent ECLA | Class codes | `C12N15/90` (IPC) |
| FDA NDA | `NDA[0-9]+` | `NDA201023` |
| FDA BLA | `BLA[0-9]+` | `BLA761060` |
| FDA IND | `IND[0-9]+` | internal only |

## IPC / CPC Classification Codes

```
A: Human necessities (A61K = pharmaceutical preparations)
B: Performing operations/transporting
C: Chemistry/metallurgy (C12N = microorganisms/enzymes)
D: Textiles/paper
E: Fixed constructions
F: Mechanical engineering
G: Physics (G01N = measuring)
H: Electricity (H04L = digital communications)
```
