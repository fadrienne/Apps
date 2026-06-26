# Biology & Genomics Databases

## NCBI Entrez (Gene, Nucleotide, Protein, PubMed)

**Base URL:** `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`
**Rate limit:** 3 req/s unauthenticated, 10 req/s with API key (`NCBI_API_KEY`)

```bash
# Gene lookup by symbol
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=BRCA1[Gene Name]+AND+Homo+sapiens[Organism]&retmode=json"

# Fetch gene record
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=672&rettype=gene_table&retmode=text"

# Protein sequence (FASTA)
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=protein&id=NP_009225.1&rettype=fasta&retmode=text"
```

## Ensembl REST API

**Base URL:** `https://rest.ensembl.org`
**Rate limit:** 55,000 req/hour (no key needed)
**Docs:** `https://rest.ensembl.org/documentation`

```bash
# Gene info by symbol
curl -H "Content-Type: application/json" "https://rest.ensembl.org/lookup/symbol/homo_sapiens/BRCA2?expand=1"

# Gene sequence
curl -H "Content-Type: application/json" "https://rest.ensembl.org/sequence/id/ENSG00000139618?type=genomic"

# Variants in region
curl -H "Content-Type: application/json" "https://rest.ensembl.org/overlap/region/human/7:140424943-140624564?feature=variation"
```

## UniProt

**Base URL:** `https://rest.uniprot.org`
**Rate limit:** No hard limit; be respectful
**Formats:** JSON, TSV, FASTA, GFF, XML

```bash
# Protein by accession (JSON)
curl "https://rest.uniprot.org/uniprotkb/P38398.json"

# Search by gene name
curl "https://rest.uniprot.org/uniprotkb/search?query=gene:BRCA1+AND+organism_id:9606&format=json&size=5"

# Download sequence
curl "https://rest.uniprot.org/uniprotkb/P38398.fasta"
```

## STRING (Protein Interactions)

**Base URL:** `https://string-db.org/api`
**Rate limit:** 1 req/s recommended

```bash
# Interaction partners (JSON)
curl "https://string-db.org/api/json/interaction_partners?identifiers=BRCA1&species=9606&limit=10"

# Network image
curl "https://string-db.org/api/image/network?identifiers=TP53%0ABRCA1%0ABRCA2&species=9606"

# Enrichment analysis
curl "https://string-db.org/api/json/enrichment?identifiers=TP53%0ABRCA1%0ABRCA2&species=9606"
```

## GEO (Gene Expression Omnibus)

**Base URL:** `https://www.ncbi.nlm.nih.gov/geo/`
**Python:** `GEOparse` library

```python
import GEOparse

# Download and parse a GEO dataset
gse = GEOparse.get_GEO(geo="GSE68849", destdir="/tmp/")
print(gse.metadata["title"])

# Access sample expression data
for gsm_name, gsm in gse.gsms.items():
    print(gsm_name, gsm.metadata["source_name_ch1"])
    df = gsm.table  # expression values
```

## TCGA / GDC (Cancer Genomics)

**Base URL:** `https://api.gdc.cancer.gov`
**Python:** `pygdc` or direct REST

```bash
# Search for TCGA files
curl "https://api.gdc.cancer.gov/files?filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.project.project_id%22%2C%22value%22%3A%5B%22TCGA-BRCA%22%5D%7D%7D%5D%7D&fields=file_id,file_name,data_type&size=5"
```

## Common Identifiers

| Entity | Identifier | Example |
|---|---|---|
| Human gene | HGNC symbol | `BRCA1` |
| Gene (NCBI) | Entrez Gene ID | `672` |
| Gene (Ensembl) | ENSEMBL ID | `ENSG00000012048` |
| Protein | UniProt accession | `P38398` |
| Protein (NCBI) | RefSeq protein | `NP_009225.1` |
| mRNA | RefSeq mRNA | `NM_007294.4` |
| Variant | dbSNP rsID | `rs28897672` |
| Variant | HGVS | `NM_007294.4:c.5266dupC` |
| GEO dataset | GSE accession | `GSE68849` |
| GEO sample | GSM accession | `GSM1682127` |
