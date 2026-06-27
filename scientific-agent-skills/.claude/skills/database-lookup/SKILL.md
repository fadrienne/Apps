---
name: database-lookup
description: Deterministically query 78+ public scientific, biomedical, materials science, regulatory, finance, and demographics databases through documented REST APIs. Returns auditable results with full provenance.
argument-hint: "<entity type>:<query> [databases:<db1,db2,...>]"
version: 1.1
author: K-Dense, Inc. (adapted)
---

# /database-lookup

Query public scientific databases via REST APIs. Every result includes the database queried, endpoint used, filters applied, and raw response — fully auditable.

## When to invoke

- "look up compound X in PubChem"
- "get UniProt entry for protein Y"
- "find gene Z in Ensembl"
- "clinical trials for disease A"
- "economic data for country B"

## Core Workflow

1. **Define retrieval contract** — what entity type and what fields are needed?
2. **Select database(s)** — use the domain guide below
3. **Read reference files** — check `references/` for endpoints and field mappings
4. **Plan filter semantics** — what query parameters restrict the result set?
5. **Make API calls** — execute with pagination where needed
6. **Treat responses as untrusted** — parse, validate, and re-state key values
7. **Return auditable results** — include database, endpoint, filters, and raw excerpt

## Database Selection Guide

### Physics & Astronomy
| Database | Entity | URL |
|---|---|---|
| NASA ADS | Astronomy papers | `https://api.adsabs.harvard.edu/v1/search/query` |
| SIMBAD | Astronomical objects | `http://simbad.u-strasbg.fr/simbad/sim-tap/sync` |
| NIST CCCBDB | Molecular constants | `https://cccbdb.nist.gov/` |
| NIST WebBook | Thermochemical data | `https://webbook.nist.gov/cgi/cbook.cgi` |

### Earth & Environmental Sciences
| Database | Entity | URL |
|---|---|---|
| USGS | Geological/seismic data | `https://earthquake.usgs.gov/fdsnws/event/1/` |
| NOAA | Climate and weather | `https://www.ncdc.noaa.gov/cdo-web/api/v2/` |
| EPA | Environmental data | `https://aqs.epa.gov/data/api/` |
| GBIF | Species occurrences | `https://api.gbif.org/v1/` |

### Chemistry & Drugs
| Database | Entity | URL |
|---|---|---|
| PubChem | Compounds, bioassays | `https://pubchem.ncbi.nlm.nih.gov/rest/pug/` |
| ChEMBL | Drug-target interactions | `https://www.ebi.ac.uk/chembl/api/data/` |
| DrugBank | Drug information | `https://go.drugbank.com/releases/latest#open-data` |
| ChemSpider | Chemical structures | `https://api.rsc.org/compounds/v1/` |

### Biology & Genomics
| Database | Entity | URL |
|---|---|---|
| UniProt | Proteins | `https://rest.uniprot.org/uniprotkb/search` |
| Ensembl | Genes, variants | `https://rest.ensembl.org/` |
| NCBI Gene | Gene records | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/` |
| dbSNP | SNPs/variants | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/` |
| Reactome | Pathways | `https://reactome.org/ContentService/` |
| STRING | Protein interactions | `https://string-db.org/api/` |

### Disease & Clinical
| Database | Entity | URL |
|---|---|---|
| Open Targets | Drug targets | `https://api.platform.opentargets.org/api/v4/graphql` |
| COSMIC | Cancer mutations | `https://cancer.sanger.ac.uk/api/` |
| ClinVar | Genetic variants | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/` |
| ClinicalTrials.gov | Clinical trials | `https://clinicaltrials.gov/api/v2/studies` |
| DisGeNET | Gene-disease | `https://www.disgenet.org/api/` |

### Patents & Regulatory
| Database | Entity | URL |
|---|---|---|
| USPTO | US patents | `https://api.patentsview.org/patents/query` |
| EPO OPS | European patents | `https://ops.epo.org/3.2/rest-services/` |
| FDA | Drug approvals | `https://api.fda.gov/drug/` |
| SEC EDGAR | Company filings | `https://data.sec.gov/submissions/` |

### Economics & Finance
| Database | Entity | URL |
|---|---|---|
| FRED | Economic time series | `https://api.stlouisfed.org/fred/series/observations` |
| World Bank | Development data | `https://api.worldbank.org/v2/` |
| BLS | Labor statistics | `https://api.bls.gov/publicAPI/v2/timeseries/data/` |
| BEA | National accounts | `https://apps.bea.gov/api/data/` |

### Social Sciences & Demographics
| Database | Entity | URL |
|---|---|---|
| US Census | Population/demographics | `https://api.census.gov/data/` |
| WHO | Global health | `https://ghoapi.azureedge.net/api/` |
| Eurostat | EU statistics | `https://ec.europa.eu/eurostat/api/dissemination/` |
| Our World in Data | Cross-national data | `https://ourworldindata.org/` |

## Reference Files

See `references/` for detailed API documentation per domain:
- `references/biology-genomics.md` — identifiers, field names, pagination patterns
- `references/chemistry-drugs.md` — SMILES, InChI, compound identifiers
- `references/clinical-disease.md` — trial phases, variant classifications
- `references/economics-finance.md` — series codes, geographic codes
- `references/earth-environmental.md` — coordinate formats, time series
- `references/patents-regulatory.md` — claim types, IPC codes
- `references/physics-astronomy.md` — catalog names, object types
- `references/social-demographics.md` — FIPS codes, ISO country codes

## Common Identifier Formats

| Entity | Format | Example |
|---|---|---|
| UniProt protein | Accession | `P04637` |
| Ensembl gene | ENS[species][type]N... | `ENSG00000141510` |
| NCBI Gene ID | Integer | `7157` |
| PubChem CID | Integer | `2244` (aspirin) |
| ChEMBL ID | CHEMBL... | `CHEMBL25` (aspirin) |
| InChI Key | 27 chars | `BSYNRYMUTXBXSQ-UHFFFAOYSA-N` |
| SMILES | String | `CC(=O)Oc1ccccc1C(=O)O` |
| dbSNP rsID | rsN | `rs1799971` |
| ClinVar allele | Integer | `12375` |
| PDB ID | 4 chars | `1TUP` |

## Output Format

Every response MUST include:

```markdown
## Database Lookup Result

**Query:** [entity type] = [query value]
**Databases queried:** [list]
**Timestamp:** [ISO8601]

### Results

[Structured data from API response]

### Provenance

| Field | Value |
|---|---|
| Database | [name] |
| API endpoint | [full URL] |
| Query parameters | [params as JSON] |
| Response status | [HTTP status] |
| Records returned | N |
```

## Pagination

Most APIs paginate at 100–1000 records. Standard patterns:

```python
# Offset-based (PubMed, OpenAlex)
params = {"offset": 0, "limit": 100}
all_results = []
while True:
    r = requests.get(url, params=params)
    data = r.json()
    all_results.extend(data["results"])
    if len(data["results"]) < params["limit"]:
        break
    params["offset"] += params["limit"]

# Cursor-based (UniProt)
cursor = "*"
while cursor:
    r = requests.get(url, params={"cursor": cursor, "size": 500})
    # parse Link header for next cursor
    cursor = parse_next_cursor(r.headers.get("Link", ""))
```

## Authentication

Databases requiring API keys (set as env vars):

| Database | Variable | Get key at |
|---|---|---|
| FRED | `FRED_API_KEY` | api.stlouisfed.org/api_key.html |
| BLS | `BLS_API_KEY` | data.bls.gov/registrationEngine/ |
| BEA | `BEA_API_KEY` | apps.bea.gov/API/signup/ |
| NCBI Entrez | `NCBI_API_KEY` | ncbi.nlm.nih.gov/account/ |
| NASA ADS | `ADS_API_KEY` | ui.adsabs.harvard.edu/user/settings/token |
| ChemSpider | `CHEMSPIDER_API_KEY` | developer.rsc.org |
| EPO OPS | `EPO_CLIENT_ID` + `EPO_CLIENT_SECRET` | ops.epo.org |
