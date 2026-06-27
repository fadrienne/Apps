---
name: exploratory-data-analysis
description: Automated EDA for scientific data files. Detects file format, loads data, summarizes structure and quality, and generates a markdown report. Supports 200+ scientific file formats across genomics, chemistry, imaging, spectroscopy, and general data.
argument-hint: "<file path or glob> [--format auto|csv|fasta|pdb|mzML|...]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /exploratory-data-analysis

Analyze any scientific data file or directory. Detect the format, summarize the contents, check data quality, and generate a markdown EDA report.

## When to invoke

- "explore this dataset"
- "what's in this file?"
- "summarize these data"
- "check data quality for X"

## Supported file categories

### General Scientific Data
`.csv`, `.tsv`, `.xlsx`, `.parquet`, `.feather`, `.hdf5`, `.h5`, `.zarr`, `.json`, `.jsonl`, `.npy`, `.npz`, `.mat`

### Bioinformatics & Genomics
`.fasta`, `.fastq`, `.fq.gz`, `.bam`, `.sam`, `.vcf`, `.bcf`, `.bed`, `.gff`, `.gtf`, `.bigwig`, `.bw`, `.wig`, `.bedgraph`, `.genbank`, `.gb`, `.newick`, `.nwk`

### Chemistry & Molecular
`.pdb`, `.cif`, `.mol`, `.mol2`, `.sdf`, `.xyz`, `.smiles`, `.inchi`, `.cdxml`, `.pdbqt`, `.gro`, `.top`, `.tpr`

### Microscopy & Imaging
`.tif`, `.tiff`, `.nd2`, `.czi`, `.lif`, `.ome.tiff`, `.png`, `.jpg`, `.svs`, `.mrxs`, `.scn`, `.dcm`

### Spectroscopy & Analytical
`.mzML`, `.mzXML`, `.mzdata`, `.raw`, `.cdf`, `.fid`, `.jdx`, `.jcamp`, `.brukerfid`

### Proteomics & Metabolomics
`.pepxml`, `.mzIdentML`, `.idxml`, `.mztab`, `.tsv` (MaxQuant), `.txt` (Perseus)

## Workflow

### Step 1: Detect file type

```python
import pathlib
import mimetypes

def detect_format(filepath):
    path = pathlib.Path(filepath)
    suffix = "".join(path.suffixes).lower()
    
    format_map = {
        ".fasta": "fasta", ".fa": "fasta", ".fna": "fasta",
        ".fastq": "fastq", ".fq": "fastq",
        ".bam": "bam", ".sam": "sam",
        ".vcf": "vcf", ".bcf": "bcf",
        ".pdb": "pdb", ".cif": "cif",
        ".sdf": "sdf", ".mol": "mol",
        ".mzml": "mzml", ".mzxml": "mzxml",
        ".csv": "csv", ".tsv": "tsv",
        ".parquet": "parquet",
        ".h5": "hdf5", ".hdf5": "hdf5",
        ".xlsx": "excel",
        ".dcm": "dicom",
        ".tif": "tiff", ".tiff": "tiff",
        ".json": "json", ".jsonl": "jsonl",
    }
    
    for ext, fmt in format_map.items():
        if suffix.endswith(ext):
            return fmt
    return "unknown"
```

### Step 2: Load and analyze by format

**General data (CSV/TSV/Parquet):**
```python
import polars as pl

df = pl.read_csv(filepath)
report = {
    "rows": len(df),
    "columns": len(df.columns),
    "schema": df.schema,
    "null_counts": df.null_count(),
    "describe": df.describe(),
    "sample": df.head(5),
}
```

**FASTA sequences:**
```python
from Bio import SeqIO

records = list(SeqIO.parse(filepath, "fasta"))
lengths = [len(r.seq) for r in records]
report = {
    "n_sequences": len(records),
    "length_range": (min(lengths), max(lengths)),
    "mean_length": sum(lengths) / len(lengths),
    "gc_content": [round(100 * (r.seq.count("G") + r.seq.count("C")) / len(r.seq), 2) for r in records[:5]],
    "first_ids": [r.id for r in records[:5]],
}
```

**VCF variants:**
```bash
bcftools stats input.vcf | head -50
```

**PDB structures:**
```python
from Bio.PDB import PDBParser

parser = PDBParser(QUIET=True)
structure = parser.get_structure("mol", filepath)
chains = [c.id for c in structure.get_chains()]
n_residues = sum(1 for _ in structure.get_residues())
n_atoms = sum(1 for _ in structure.get_atoms())
```

**HDF5 / Zarr:**
```python
import h5py

with h5py.File(filepath, "r") as f:
    def print_structure(name, obj):
        print(name, type(obj).__name__, getattr(obj, "shape", ""))
    f.visititems(print_structure)
```

### Step 3: Assess data quality

Check for:
- Missing values (count and percentage per column/field)
- Outliers (IQR method for numeric data)
- Duplicate records
- Encoding issues (unexpected characters)
- File truncation (last record complete?)
- For sequences: ambiguous bases, unusual lengths
- For variants: FILTER field, quality scores (QUAL)
- For structures: missing residues, alternate locations, HETATM ratio
- For time series: gaps, irregular spacing

### Step 4: Generate report

````markdown
# EDA Report: [filename]

**Generated:** YYYY-MM-DD HH:MM
**File:** [path]
**Format:** [detected format]
**Size:** [bytes, human-readable]

## Overview

| Property | Value |
|---|---|
| Format | [format] |
| Records/rows | N |
| Features/columns | M |
| File size | [size] |

## Schema / Structure

[Column names, types, example values]

## Summary Statistics

[Numeric: mean, std, min, max, quartiles]
[Categorical: unique values, top-N]
[Sequences: length distribution, GC content]

## Data Quality

| Check | Result |
|---|---|
| Missing values | [count per column] |
| Duplicates | [count] |
| Outliers (IQR) | [count per column] |
| [Format-specific checks] | [result] |

## Notable Observations

- [Key finding 1]
- [Key finding 2]

## Recommended Next Steps

- [Preprocessing needed]
- [Analysis to run]
- [Potential issues to address]
````

## Output

Write report to `eda-[filename-slug]-[date].md` in the same directory as the input file.
