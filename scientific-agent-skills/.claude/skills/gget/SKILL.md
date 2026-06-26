---
name: gget
description: Retrieve genomic and proteomic data from Ensembl, UniProt, NCBI, and 20+ databases using gget — the command-line genomics toolkit.
argument-hint: "<module> <query> [--species human|mouse|...] [--release N]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /gget

Query genomic databases quickly using gget. One command to fetch gene info, sequences, expression data, orthologues, mutations, and more.

## Installation

```bash
pip install gget
gget setup          # Downloads required databases (first run only, ~1-2 GB)
```

## Module Reference

### gget search — find genes

```python
import gget

# Search by gene name or description
results = gget.search("BRCA1", "homo_sapiens")
# Returns DataFrame with gene IDs, descriptions, biotype, etc.

# Cross-species search
results = gget.search("p53", ["homo_sapiens", "mus_musculus"])
```

### gget info — gene metadata

```python
# Get detailed info for one or more Ensembl IDs
info = gget.info(["ENSG00000012048", "ENSG00000141510"])  # BRCA1, TP53
# Returns: name, synonyms, biotype, chromosome, start, end, description

# From gene symbols
info = gget.info(["BRCA1", "TP53"], uniprot=True)  # Include UniProt IDs
```

### gget seq — fetch sequences

```python
# Fetch nucleotide sequence (genomic DNA)
seq = gget.seq("ENSG00000012048")  # BRCA1

# Fetch amino acid sequence (protein)
seq = gget.seq("ENSG00000012048", translate=True)

# Save to FASTA
gget.seq("BRCA1", save=True, out="BRCA1.fasta")
```

### gget blast — BLAST search

```python
# BLAST a sequence against NCBI databases
results = gget.blast(
    "MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR",
    program="blastp",
    database="nr",
    limit=10,
    expect=1e-4,
)
```

### gget blat — UCSC BLAT

```python
# Map sequence to genome
results = gget.blat(
    sequence="GCAGCGGCGGCGGCAGCAGTGCGGCGGCGGCGGCAGCAGCAGCAGCAGCAGCAGCAG",
    seqtype="DNA",
    assembly="hg38",
)
```

### gget muscle — multiple sequence alignment

```python
# Align sequences
gget.muscle(["MAVHQGLRRTYDFVRFSSSVPASNTSNLQFFFLEGGCNQ...", "MAAHQLRRTYDFMRFSSSVPASSHANLQFFFLEGGCNQ..."])
```

### gget enrichr — pathway enrichment

```python
# Pathway enrichment from gene list
results = gget.enrichr(
    genes=["TP53", "BRCA1", "CDK2", "CCND1", "ATM"],
    database="pathway",    # or "transcription_factor", "phenotype", "disease"
    organism="human",
)
```

### gget alphafold — protein structure

```python
# Fetch AlphaFold predicted structure
gget.alphafold("ENSG00000012048")  # Returns PDB and CIF files

# For a custom protein sequence
gget.alphafold("MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTK")
```

### gget archs4 — gene expression

```python
# Human gene expression from ARCHS4 (uniform RNA-seq reprocessing)
expression = gget.archs4(
    "TP53",
    which="tissue",        # "tissue" or "correlation"
    species="human",
)
# Returns tissue-level TPM values

# Find most co-expressed genes
correlated = gget.archs4("TP53", which="correlation")
```

### gget cellxgene — single-cell expression

```python
# Query CZ CellXGene for gene expression in specific cell types
results = gget.cellxgene(
    gene="PECAM1",
    tissue="lung",
    cell_type="endothelial cell",
    species="homo_sapiens",
)
```

### gget mutate — codon-optimized mutations

```python
# Introduce specific mutations into a sequence
mutated = gget.mutate(
    sequences=["ATGGTGCTGAGCGATGAC..."],
    mutations=["A2G", "L5M"],    # position (1-indexed) + mutation
)
```

### gget cosmic — cancer mutations

```python
# Search COSMIC for cancer mutations in a gene
mutations = gget.cosmic(
    searchterm="BRCA1",
    entity="gene",
    limit=50,
)
```

### gget opentargets — drug targets

```python
# Find drug targets associated with a disease
targets = gget.opentargets(
    "ENSG00000141510",     # TP53 Ensembl ID
    resource="diseases",   # "diseases", "drugs", "tractability", "interactions"
)
```

### gget elm — protein motifs

```python
# Find eukaryotic linear motifs in a protein
motifs = gget.elm("MAPKSPGKKTPKKHPF...")
```

### gget diamond — fast sequence alignment

```python
# Fast protein alignment (like BLAST but 1000x faster)
results = gget.diamond(
    query="MVLSPADKTNVK...",
    reference="database.fasta",
    sensitivity="fast",    # or "mid", "sensitive", "very-sensitive"
)
```

## Common Workflows

**Workflow: Gene characterization**
```python
import gget

gene = "EGFR"
organism = "homo_sapiens"

# 1. Find Ensembl ID
results = gget.search(gene, organism)
ensembl_id = results.iloc[0]["Ensembl_ID"]

# 2. Get detailed metadata
info = gget.info(ensembl_id, uniprot=True)
print(f"Gene: {info['symbol']}, Location: chr{info['chromosome_name']}:{info['start']}-{info['end']}")

# 3. Fetch protein sequence
protein_seq = gget.seq(ensembl_id, translate=True)

# 4. Get tissue expression
expression = gget.archs4(gene, which="tissue")
print(expression.head(10))

# 5. Find associated diseases
diseases = gget.opentargets(ensembl_id, resource="diseases")
```

**Workflow: Cancer mutation analysis**
```python
# Get COSMIC mutations for a cancer gene
mutations = gget.cosmic("TP53", entity="gene", limit=100)

# Get drug targets
drugs = gget.opentargets("ENSG00000141510", resource="drugs")

# Combine with pathway enrichment
related_genes = mutations["gene_name"].unique().tolist()
pathways = gget.enrichr(related_genes, database="pathway")
```

## Species codes (Ensembl)

| Common name | Ensembl code |
|---|---|
| Human | `homo_sapiens` |
| Mouse | `mus_musculus` |
| Rat | `rattus_norvegicus` |
| Zebrafish | `danio_rerio` |
| Drosophila | `drosophila_melanogaster` |
| C. elegans | `caenorhabditis_elegans` |
| Yeast | `saccharomyces_cerevisiae` |
| Arabidopsis | `arabidopsis_thaliana` |
