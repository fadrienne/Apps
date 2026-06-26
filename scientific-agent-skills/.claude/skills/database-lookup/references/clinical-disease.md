# Clinical & Disease Databases

## ClinicalTrials.gov

**Base URL:** `https://clinicaltrials.gov/api/v2`
**Rate limit:** 10 req/s

```bash
# Search trials
curl "https://clinicaltrials.gov/api/v2/studies?query.cond=breast+cancer&query.intr=pembrolizumab&pageSize=5&format=json"

# Specific trial by NCT ID
curl "https://clinicaltrials.gov/api/v2/studies/NCT04108468?format=json"

# Download full study fields
curl "https://clinicaltrials.gov/api/v2/studies/NCT04108468?fields=BriefTitle,Phase,Status,EligibilityCriteria,PrimaryOutcomes"
```

```python
import requests

def search_trials(condition, intervention=None, status="RECRUITING", n=10):
    params = {
        "query.cond": condition,
        "filter.overallStatus": status,
        "pageSize": n,
        "format": "json",
    }
    if intervention:
        params["query.intr"] = intervention
    
    r = requests.get("https://clinicaltrials.gov/api/v2/studies", params=params)
    studies = r.json()["studies"]
    
    return [
        {
            "nct_id": s["protocolSection"]["identificationModule"]["nctId"],
            "title": s["protocolSection"]["identificationModule"]["briefTitle"],
            "phase": s["protocolSection"].get("designModule", {}).get("phases", []),
            "status": s["protocolSection"]["statusModule"]["overallStatus"],
        }
        for s in studies
    ]
```

## OMIM (Online Mendelian Inheritance in Man)

**Base URL:** `https://api.omim.org/api`
**Requires:** API key at `omim.org/api` (free for research)

```bash
# Gene-disease associations
curl "https://api.omim.org/api/entry?mimNumber=113705&include=geneMap&format=json&apiKey=$OMIM_API_KEY"

# Search by keyword
curl "https://api.omim.org/api/entry/search?search=breast+cancer&include=geneMap&format=json&apiKey=$OMIM_API_KEY&limit=5"
```

## DisGeNET

**Base URL:** `https://www.disgenet.org/api`
**Auth:** Bearer token (free registration)

```bash
# Gene-disease associations
curl -H "Authorization: Bearer $DISGENET_TOKEN" \
  "https://www.disgenet.org/api/gda/gene/BRCA1?source=ALL&format=json"

# Disease associations
curl -H "Authorization: Bearer $DISGENET_TOKEN" \
  "https://www.disgenet.org/api/gda/disease/C0006142?source=ALL&format=json"
```

## GWAS Catalog

**Base URL:** `https://www.ebi.ac.uk/gwas/rest/api`
**Rate limit:** Generous, no key needed

```bash
# Associations for a trait
curl "https://www.ebi.ac.uk/gwas/rest/api/associations/search?q=mappedGenes:BRCA1&size=10"

# Studies for a disease
curl "https://www.ebi.ac.uk/gwas/rest/api/studies/search?q=breast+cancer&size=10"
```

## HPO (Human Phenotype Ontology)

**Base URL:** `https://hpo.jax.org/api/hpo`
**Rate limit:** No hard limit

```bash
# Search phenotype terms
curl "https://hpo.jax.org/api/hpo/search?q=breast+neoplasm&max=10&offset=0&category=terms"

# Genes for a phenotype
curl "https://hpo.jax.org/api/hpo/term/HP:0003002/genes?max=20&offset=0"

# Diseases for a phenotype
curl "https://hpo.jax.org/api/hpo/term/HP:0003002/diseases?max=20&offset=0"
```

## ICD Coding (WHO)

**ICD-10:** `https://icd.who.int/browse10/2019/en`
**ICD-11 API:** `https://id.who.int/icd/entity`

```bash
# ICD-11 code lookup
curl -H "Authorization: Bearer $ICD_TOKEN" \
  "https://id.who.int/icd/release/11/mms/search?q=breast+cancer&subtreeFilterUsage=foundationDescendants"
```

## Common Identifiers

| Entity | Identifier | Example |
|---|---|---|
| Disease | OMIM ID | `113705` (BRCA1) |
| Disease | DisGeNET ID | UMLS CUI `C0006142` |
| Disease | ICD-10 | `C50` (breast cancer) |
| Disease | ICD-11 MMS | `2C6Y` |
| Phenotype | HPO ID | `HP:0003002` |
| GWAS variant | rsID | `rs1799950` |
| Clinical trial | NCT ID | `NCT04108468` |
| Gene-disease | OMIM MIM# | `113705` |
