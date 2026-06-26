---
name: pathway-enrichment
description: Run GO term and KEGG pathway enrichment analysis on gene lists. Supports over-representation analysis (ORA) and gene set enrichment analysis (GSEA).
argument-hint: "<gene list file or inline genes> [--organism human|mouse|rat|...] [--analysis ora|gsea] [--databases GO,KEGG,Reactome]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /pathway-enrichment

Identify biological pathways and processes enriched in a gene list. Supports GO term analysis (BP, MF, CC), KEGG pathways, and Reactome. Returns ranked pathway list with statistics and visualization.

## When to invoke

- "what pathways are enriched in my gene list?"
- "run GO enrichment on [gene list]"
- "GSEA analysis"
- "what biological processes are affected?"

## Input formats

- Plain text file: one gene symbol per line
- CSV/TSV with gene symbols in a column
- Ranked gene list: gene + fold-change or signed p-value (for GSEA)
- Inline: comma-separated gene symbols

## Databases

| Database | Coverage | Analysis type |
|---|---|---|
| GO Biological Process (GO:BP) | Universal | ORA, GSEA |
| GO Molecular Function (GO:MF) | Universal | ORA, GSEA |
| GO Cellular Component (GO:CC) | Universal | ORA, GSEA |
| KEGG Pathway | Universal | ORA, GSEA |
| Reactome | Universal | ORA, GSEA |
| MSigDB Hallmarks | Universal | ORA, GSEA |
| WikiPathways | Universal | ORA |
| DisGeNET | Human disease | ORA |

## Analysis types

### Over-Representation Analysis (ORA)

For a gene list without ranking. Tests whether a pathway contains more of your genes than expected by chance.

```python
import gseapy as gp

def run_ora(gene_list, organism="human", databases=None):
    """Run ORA using Enrichr API."""
    if databases is None:
        databases = ["GO_Biological_Process_2023", "KEGG_2021_Human", "Reactome_2022"]
    
    results = gp.enrichr(
        gene_list=gene_list,
        gene_sets=databases,
        organism=organism,
        outdir=None,
        no_plot=True,
    )
    return results.results

# Filter by significance
sig_results = results[results["Adjusted P-value"] < 0.05]
```

**Statistical test:** Fisher's exact test (hypergeometric)
**Background:** all annotated genes for the organism
**Correction:** Benjamini-Hochberg FDR

### Gene Set Enrichment Analysis (GSEA)

For a ranked gene list (e.g., by fold-change × -log10 p-value from DESeq2).

```python
import gseapy as gp

def run_gsea(ranked_gene_file, organism="human", databases=None):
    """Run GSEA with pre-ranked gene list."""
    if databases is None:
        databases = ["GO_Biological_Process_2023", "KEGG_2021_Human"]
    
    result = gp.prerank(
        rnk=ranked_gene_file,  # two-column: gene\trank_metric
        gene_sets=databases,
        threads=4,
        min_size=15,
        max_size=500,
        permutation_num=1000,
        outdir="gsea_output",
        seed=42,
        verbose=True,
    )
    return result

# Access results
sig_gsea = result.res2d[result.res2d["FDR q-val"] < 0.25]
```

**Statistic:** Normalized Enrichment Score (NES)
**Significance:** FDR q-value < 0.25 (conventional GSEA threshold)

## Organism support

| Organism | gseapy code | KEGG code |
|---|---|---|
| Human | `human` | `hsa` |
| Mouse | `mouse` | `mmu` |
| Rat | `rat` | `rno` |
| Zebrafish | `zebrafish` | `dre` |
| Drosophila | `fly` | `dme` |
| C. elegans | `worm` | `cel` |
| Yeast | `yeast` | `sce` |
| Arabidopsis | `plant` | `ath` |

## Installation

```bash
pip install gseapy
# Optional: for Reactome via API
pip install pyreactome
```

## Workflow

### Step 1: Load and validate gene list

```python
def load_genes(input):
    # Accept file path or inline comma-separated list
    if os.path.isfile(input):
        with open(input) as f:
            genes = [g.strip() for g in f if g.strip()]
    else:
        genes = [g.strip() for g in input.split(",")]
    
    # Uppercase for human/mouse
    genes = [g.upper() for g in genes]
    print(f"Loaded {len(genes)} genes")
    return genes
```

### Step 2: Run enrichment

Choose ORA (gene list without ranking) or GSEA (ranked list). Default to ORA unless user provides a ranked list.

### Step 3: Filter and rank results

For ORA:
```python
# Filter
sig = df[df["Adjusted P-value"] < 0.05].copy()

# Sort by combined score (Enrichr): -log10(p) × z-score
sig = sig.sort_values("Combined Score", ascending=False)

# Keep top 20 per database
top = sig.groupby("Gene_set").head(20)
```

### Step 4: Generate report

````markdown
# Pathway Enrichment Analysis

**Date:** YYYY-MM-DD
**Input:** N genes
**Organism:** Human (Homo sapiens)
**Analysis:** ORA (over-representation)
**Databases:** GO:BP, GO:MF, KEGG, Reactome

## Significant Pathways (FDR < 0.05)

### GO Biological Process

| Rank | Pathway | Overlap | p-value | FDR | Genes |
|---|---|---|---|---|---|
| 1 | Response to DNA damage | 45/287 | 1.2e-8 | 3.1e-6 | TP53, BRCA1, ATM... |
| 2 | Cell cycle regulation | 38/312 | 4.5e-7 | 5.8e-5 | CDK1, CCND1... |

### KEGG Pathways

| Rank | Pathway | Overlap | p-value | FDR | Genes |
|---|---|---|---|---|---|
| 1 | p53 signaling pathway | 22/68 | 8.3e-12 | 2.1e-10 | TP53, MDM2... |

### Reactome

[...]

## Summary

The gene list is significantly enriched for pathways involved in [top theme], [second theme], and [third theme]. The most significant individual pathway is [pathway name] (FDR = [value]).

## Key Genes Driving Enrichment

| Gene | Pathways | Biological role |
|---|---|---|
| TP53 | 12 pathways | Master regulator of cell cycle and apoptosis |
| BRCA1 | 8 pathways | DNA damage response and homologous recombination |
````

## Output files

- `enrichment-results-[date].csv` — full results table
- `enrichment-dotplot-[date].png` — dot plot of top pathways
- `enrichment-network-[date].png` — pathway overlap network (optional)
