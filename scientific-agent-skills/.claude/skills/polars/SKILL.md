---
name: polars
description: High-performance data analysis and transformation with Polars. Faster than pandas for large scientific datasets. Covers loading, filtering, aggregation, joins, and time series operations.
argument-hint: "<data file or query description>"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /polars

Analyze and transform scientific datasets with Polars — 5–10× faster than pandas for large tabular data. Lazy evaluation, memory efficiency, and native parallelism.

## When to invoke

- "analyze this CSV"
- "fast data processing"
- "aggregate / filter / join datasets"
- "process large genomics tables"

## Installation

```bash
pip install polars
```

## Core patterns

### Loading data

```python
import polars as pl

# CSV / TSV
df = pl.read_csv("data.csv")
df = pl.read_csv("data.tsv", separator="\t")

# Parquet (fastest for large files)
df = pl.read_parquet("data.parquet")

# Excel
df = pl.read_excel("data.xlsx")

# From URLs (via LazyFrame)
df = pl.read_csv("https://example.com/data.csv")

# Lazy reading (memory-efficient for large files)
lf = pl.scan_csv("large_data.csv")
result = lf.filter(pl.col("value") > 100).collect()
```

### Inspecting data

```python
print(df.shape)          # (rows, cols)
print(df.schema)         # column names and dtypes
print(df.describe())     # summary statistics
print(df.head(5))
print(df.null_count())   # missing values per column
```

### Filtering

```python
# Single condition
filtered = df.filter(pl.col("pvalue") < 0.05)

# Multiple conditions
filtered = df.filter(
    (pl.col("padj") < 0.05) & (pl.col("log2FoldChange").abs() > 1)
)

# String filtering
df.filter(pl.col("gene").str.starts_with("BRCA"))
df.filter(pl.col("chr").is_in(["chr1", "chr2", "chr3"]))

# Null filtering
df.filter(pl.col("value").is_not_null())
```

### Selecting and renaming columns

```python
# Select columns
df.select(["gene", "pvalue", "log2FoldChange"])

# Select by pattern
df.select(pl.col("^sample_.*$"))   # all columns matching regex

# Rename
df.rename({"log2FoldChange": "LFC", "padj": "FDR"})

# Drop columns
df.drop(["column_to_remove"])

# Add column
df.with_columns(
    (-pl.col("pvalue").log(base=10)).alias("neg_log10_p")
)
```

### Aggregation

```python
# Group by and aggregate
summary = df.group_by("condition").agg([
    pl.col("expression").mean().alias("mean_expression"),
    pl.col("expression").std().alias("std_expression"),
    pl.col("expression").count().alias("n_samples"),
    pl.col("pvalue").min().alias("min_pvalue"),
])

# Multiple columns, different aggregations
df.group_by(["condition", "timepoint"]).agg([
    pl.col("gene").count().alias("n_genes"),
    pl.col("LFC").abs().mean().alias("mean_abs_LFC"),
])

# Apply custom function
df.group_by("group").agg(
    pl.col("value").apply(lambda x: (x > 0).sum()).alias("n_positive")
)
```

### Joins

```python
# Inner join
result = df1.join(df2, on="gene_id", how="inner")

# Left join (keep all from left)
result = df1.join(df2, on="gene_id", how="left")

# Join on multiple columns
result = df1.join(df2, on=["gene_id", "transcript_id"], how="inner")

# Join with different column names
result = df1.join(df2, left_on="gene_symbol", right_on="gene_name", how="left")
```

### String operations

```python
df.with_columns([
    pl.col("gene").str.to_uppercase().alias("GENE"),
    pl.col("description").str.extract(r"(\w+) protein", group_index=1).alias("protein_type"),
    pl.col("sequence").str.lengths().alias("seq_length"),
    pl.col("annotation").str.split(";").alias("annotation_list"),
])
```

### Pivoting and reshaping

```python
# Wide to long (melt)
df_long = df.unpivot(
    on=["sample_A", "sample_B", "sample_C"],
    index=["gene"],
    variable_name="sample",
    value_name="expression",
)

# Long to wide (pivot)
df_wide = df_long.pivot(
    values="expression",
    index="gene",
    on="sample",
)
```

### Window functions (running stats, rank)

```python
df.with_columns([
    pl.col("value").rank().alias("rank"),
    pl.col("value").rolling_mean(window_size=5).alias("rolling_mean"),
    pl.col("value").cum_sum().alias("cumulative"),
    (pl.col("value") - pl.col("value").mean()) / pl.col("value").std()).alias("z_score"),
])

# Percentile rank within group
df.with_columns(
    pl.col("expression").rank().over("condition").alias("rank_within_condition")
)
```

### Time series

```python
# Parse datetime
df = df.with_columns(
    pl.col("date").str.to_date("%Y-%m-%d")
)

# Resample to monthly average
monthly = (
    df
    .group_by_dynamic("date", every="1mo")
    .agg(pl.col("value").mean())
)

# Time-based filtering
df.filter(
    pl.col("date").is_between(
        pl.date(2024, 1, 1), pl.date(2024, 12, 31)
    )
)
```

### Lazy evaluation (for large files)

```python
# Lazy pipeline — optimized and parallelized automatically
result = (
    pl.scan_csv("huge_file.csv")
    .filter(pl.col("quality") > 30)
    .with_columns(
        (pl.col("ref") != pl.col("alt")).alias("is_snp")
    )
    .group_by("chromosome")
    .agg(pl.col("is_snp").sum().alias("n_snps"))
    .sort("n_snps", descending=True)
    .collect()   # only executes here
)

# Explain query plan
print(lf.explain(optimized=True))
```

## Scientific data patterns

### VCF-like variant processing

```python
vcf = pl.read_csv("variants.tsv", separator="\t", comment_prefix="#")

sig_variants = (
    vcf
    .filter(pl.col("FILTER") == "PASS")
    .filter(pl.col("AF") > 0.01)   # MAF > 1%
    .with_columns(
        (pl.col("DP") > 20).alias("high_depth"),
        pl.col("INFO").str.extract(r"AF=([0-9.]+)", group_index=1)
            .cast(pl.Float64).alias("allele_freq"),
    )
    .select(["CHROM", "POS", "REF", "ALT", "allele_freq", "high_depth"])
)
```

### Gene expression matrix operations

```python
# Load expression matrix (genes × samples)
expr = pl.read_csv("expression.csv")

# Filter low-expression genes
expr_filtered = expr.filter(
    pl.all_horizontal(pl.col("^sample_.*$") > 1)
)

# Log2-transform all sample columns
expr_log = expr_filtered.with_columns(
    (pl.col("^sample_.*$") + 1).log(base=2)
)

# Z-score normalize per gene (row-wise)
# Polars doesn't have row-wise native z-score, use apply or transpose
```

### Merging large genomics tables

```python
# Efficient join of two large tables
result = (
    pl.scan_parquet("annotations.parquet")
    .join(
        pl.scan_csv("results.csv").filter(pl.col("padj") < 0.05),
        left_on="ensembl_id",
        right_on="gene_id",
        how="inner",
    )
    .select(["gene_symbol", "padj", "log2FoldChange", "description", "pathway"])
    .collect()
)
```

## Saving results

```python
# CSV
df.write_csv("output.csv")

# Parquet (fastest, smallest)
df.write_parquet("output.parquet")

# Excel
df.write_excel("output.xlsx")
```
