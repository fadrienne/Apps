---
name: bulk-rnaseq
description: Differential expression analysis pipeline for bulk RNA-seq data. Handles count matrix input → DESeq2/edgeR analysis → pathway enrichment → publication figures.
argument-hint: "<count matrix file> --metadata <sample_sheet.csv> [--reference group] [--condition group]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /bulk-rnaseq

Run a differential expression analysis pipeline for bulk RNA-seq data. Input: count matrix + sample metadata. Output: DE gene list, volcano plot, heatmap, pathway enrichment.

## When to invoke

- "differential expression analysis"
- "which genes are up in treatment vs control?"
- "RNA-seq DE analysis"
- "run DESeq2 on this count matrix"

## Input requirements

1. **Count matrix** — raw read counts (integers), rows = genes, columns = samples
   - Format: CSV, TSV, or .h5 (AnnData/10x)
   - Row names: gene symbols or Ensembl IDs
   - Values: raw counts (NOT normalized, NOT log-transformed)

2. **Sample metadata** — CSV with at minimum:
   ```csv
   sample_id,condition,batch
   sample1,control,1
   sample2,control,1
   sample3,treatment,1
   sample4,treatment,2
   ```

## Workflow

### Step 1: Load and validate data

```python
import pandas as pd
import numpy as np

def load_counts(filepath):
    if filepath.endswith(".csv"):
        df = pd.read_csv(filepath, index_col=0)
    elif filepath.endswith((".tsv", ".txt")):
        df = pd.read_csv(filepath, sep="\t", index_col=0)
    
    # Validate
    assert df.values.dtype in [int, np.int32, np.int64], "Counts must be integers"
    assert (df.values >= 0).all(), "Counts must be non-negative"
    print(f"Loaded count matrix: {df.shape[0]} genes × {df.shape[1]} samples")
    return df

counts = load_counts("counts.csv")
metadata = pd.read_csv("metadata.csv", index_col=0)

# Check sample order matches
assert list(counts.columns) == list(metadata.index), "Sample order mismatch"
```

### Step 2: Quality control

```python
import matplotlib.pyplot as plt
import seaborn as sns

def qc_plots(counts, metadata, outdir="."):
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    
    # Library sizes
    lib_sizes = counts.sum(axis=0)
    axes[0].bar(range(len(lib_sizes)), lib_sizes / 1e6, color=metadata["condition"].map({"control": "blue", "treatment": "red"}))
    axes[0].set_xlabel("Sample"); axes[0].set_ylabel("Library size (M reads)")
    axes[0].set_title("Library sizes")
    
    # PCA
    from sklearn.decomposition import PCA
    from sklearn.preprocessing import StandardScaler
    
    log_counts = np.log2(counts + 1)
    pca = PCA(n_components=2)
    coords = pca.fit_transform(StandardScaler().fit_transform(log_counts.T))
    
    for condition, group in metadata.groupby("condition"):
        idx = [list(metadata.index).index(s) for s in group.index]
        axes[1].scatter(coords[idx, 0], coords[idx, 1], label=condition, s=100)
    axes[1].set_xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
    axes[1].set_ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
    axes[1].legend(); axes[1].set_title("PCA")
    
    # Sample correlation heatmap
    corr = log_counts.corr()
    sns.heatmap(corr, ax=axes[2], cmap="coolwarm", vmin=0.8, vmax=1.0)
    axes[2].set_title("Sample correlation")
    
    plt.tight_layout()
    plt.savefig(f"{outdir}/qc_plots.png", dpi=150, bbox_inches="tight")
    plt.close()
    return lib_sizes
```

### Step 3: Differential expression with PyDESeq2

```python
from pydeseq2.dds import DeseqDataSet
from pydeseq2.ds import DeseqStats

def run_deseq2(counts, metadata, condition_col="condition", reference="control"):
    dds = DeseqDataSet(
        counts=counts.T,          # samples × genes
        clinical=metadata,
        design_factors=condition_col,
        ref_level=[condition_col, reference],
        refit_cooks=True,
    )
    dds.deseq2()
    
    stat_res = DeseqStats(dds, contrast=[condition_col, "treatment", reference])
    stat_res.summary()
    
    results = stat_res.results_df
    results = results.sort_values("padj")
    return results, dds

results, dds = run_deseq2(counts, metadata)
```

**Filtering DE genes:**
```python
# Standard thresholds
sig_up = results[(results["padj"] < 0.05) & (results["log2FoldChange"] > 1)]
sig_down = results[(results["padj"] < 0.05) & (results["log2FoldChange"] < -1)]
sig_all = results[results["padj"] < 0.05]

print(f"Significantly upregulated: {len(sig_up)}")
print(f"Significantly downregulated: {len(sig_down)}")
print(f"Total DE genes (|LFC| > 1, FDR < 0.05): {len(sig_up) + len(sig_down)}")
```

### Step 4: Visualization

```python
def volcano_plot(results, out="volcano.png"):
    fig, ax = plt.subplots(figsize=(8, 8))
    
    # Color by significance and fold-change
    colors = pd.Series("grey", index=results.index)
    colors[(results["padj"] < 0.05) & (results["log2FoldChange"] > 1)] = "red"
    colors[(results["padj"] < 0.05) & (results["log2FoldChange"] < -1)] = "blue"
    
    ax.scatter(results["log2FoldChange"], -np.log10(results["pvalue"].clip(1e-300)),
               c=colors.values, alpha=0.6, s=15)
    
    # Threshold lines
    ax.axhline(-np.log10(0.05), color="black", linestyle="--", alpha=0.5)
    ax.axvline(1, color="black", linestyle="--", alpha=0.5)
    ax.axvline(-1, color="black", linestyle="--", alpha=0.5)
    
    # Label top genes
    top = results[results["padj"] < 0.001].head(20)
    for gene, row in top.iterrows():
        ax.annotate(gene, (row["log2FoldChange"], -np.log10(row["pvalue"])),
                    fontsize=7, ha="center")
    
    ax.set_xlabel("log₂ Fold Change"); ax.set_ylabel("-log₁₀ p-value")
    ax.set_title("Volcano Plot")
    plt.savefig(out, dpi=150, bbox_inches="tight")
    plt.close()

def heatmap_top_genes(dds, results, n=50, out="heatmap.png"):
    top_genes = results[results["padj"] < 0.05].head(n).index
    
    # Get normalized counts
    from pydeseq2.utils import vst
    vst_counts = vst(dds).T  # genes × samples
    
    sns.clustermap(
        vst_counts.loc[top_genes],
        z_score=0,           # row-normalize
        cmap="RdBu_r",
        figsize=(10, 12),
    )
    plt.savefig(out, dpi=150, bbox_inches="tight")
    plt.close()
```

### Step 5: Pathway enrichment

Run `/pathway-enrichment` on the DE gene lists, or inline:

```python
import gseapy as gp

# ORA on upregulated genes
up_genes = list(sig_up.index)
enrichment = gp.enrichr(
    gene_list=up_genes,
    gene_sets=["GO_Biological_Process_2023", "KEGG_2021_Human"],
    organism="human",
    outdir=None,
)
sig_pathways = enrichment.results[enrichment.results["Adjusted P-value"] < 0.05]
```

## Output files

- `results_DE.csv` — full DE results table (all genes, sorted by padj)
- `results_sig.csv` — significant DE genes only (padj < 0.05, |LFC| > 1)
- `qc_plots.png` — library sizes, PCA, sample correlation
- `volcano.png` — volcano plot
- `heatmap.png` — top 50 DE genes heatmap
- `pathway_enrichment.csv` — pathway enrichment results
- `DE_summary.md` — report

## Common issues

- **Non-integer counts**: EDA, FPKM, TPM → must convert back to raw counts
- **Too few replicates (n < 3)**: DESeq2 requires ≥ 2 per group; 3+ for reliable results
- **Batch effects**: Add `batch` to design formula: `design_factors=["batch", "condition"]`
- **Low count genes**: Pre-filter: `counts = counts[counts.sum(axis=1) >= 10]`
