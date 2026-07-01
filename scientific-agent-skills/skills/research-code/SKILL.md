---
name: research-code
description: "Debug, profile, review, and restructure Python research and analysis code. Use when analysis scripts crash, produce wrong results, run too slowly, or need a correctness review. Covers: reading tracebacks and diagnosing root causes, hypothesis-driven debugging, reviewing code for common statistical/numerical errors, profiling data pipelines, improving reproducibility (seeds, environments, determinism), and structuring analysis scripts for sharing. Distinct from /exploratory-data-analysis (which understands data) and /statistical-analysis (which chooses and runs tests) — this skill focuses on the code itself."
allowed-tools: Read Write Edit Bash
compatibility: "Python >=3.10. Profiling: cProfile (stdlib), line_profiler, memory_profiler. Install extras with uv."
license: MIT license
metadata: {"version": "1.0", "skill-author": "K-Dense Inc."}
---

# Research Code

## Overview

Scientific code fails differently from production software: bugs are often silent (wrong numbers instead of crashes), reproducibility is an afterthought, and the codebase is shaped by one person writing fast rather than a team writing carefully. This skill addresses the code layer of research — not the science, not the data, but the scripts that connect them.

**Scope:**
- **Debugging** — crashes, wrong results, unexpected behavior
- **Code review for correctness** — common numerical and statistical coding errors
- **Profiling** — slow pipelines, memory blowups
- **Reproducibility** — making runs deterministic and shareable
- **Structure** — organizing scripts for clarity and reuse

---

## Debugging

### Step 1: Read the full traceback

Python tracebacks are read bottom-up: the bottom line is the error; the lines above are the call stack. Look at:
- The **error type** (`TypeError`, `ValueError`, `KeyError`, `IndexError`, `AttributeError`)
- The **error message** — often tells you exactly what went wrong
- The **file and line number** where the error occurred
- The **local variables** at that line (add a `print()` or use `pdb`)

### Step 2: Reproduce minimally

Strip away everything not needed to reproduce the bug:

```python
# Before — large real dataset, complex pipeline
# After — minimal reproducible example (MRE)
import numpy as np

X = np.array([[1, 2], [3, 4]])
# Does the bug happen here?
result = my_function(X)
```

**Rules for a good MRE:**
- Smallest dataset that triggers the bug (synthetic is fine)
- No external files or database connections
- No irrelevant imports
- Self-contained in one file

### Step 3: Form and test hypotheses

Don't randomly change code. Form a specific hypothesis about the cause, then test it:

```python
# Hypothesis: the bug is in the preprocessing, not the model
# Test: bypass preprocessing, feed raw data directly
result = model.predict(X_raw)   # does it still fail?
```

### Common debugging patterns

**Shape mismatches (numpy/torch)**
```python
# Always print shapes at intermediate steps
print(f"X: {X.shape}, y: {y.shape}, weights: {weights.shape}")
# Expected: (100, 10), (100,), (10,)
```

**Off-by-one in slicing / indexing**
```python
# Python slices exclude the end: a[0:5] gives indices 0,1,2,3,4
# pandas .iloc vs .loc — iloc is position-based, loc is label-based
df.iloc[0:5]   # rows 0–4
df.loc[0:5]    # rows where index label is 0 through 5 (inclusive!)
```

**Silent NaN propagation**
```python
import numpy as np
import pandas as pd

# Check for NaNs after every transformation
assert not np.isnan(X).any(), f"NaN in X after preprocessing"
assert not df.isnull().values.any(), f"NaN in DataFrame: {df.isnull().sum()}"

# Find where NaNs came from
df.isnull().sum()           # count per column
df[df['col'].isnull()]      # rows with NaN in a column
```

**Wrong axis in numpy operations**
```python
# axis=0 operates along rows (across rows, per column)
# axis=1 operates along columns (across columns, per row)
X = np.array([[1, 2, 3], [4, 5, 6]])

X.mean(axis=0)  # [2.5, 3.5, 4.5] — mean of each column
X.mean(axis=1)  # [2.0, 5.0]       — mean of each row

# Normalize each sample (row) — common mistake: wrong axis
X_norm = (X - X.mean(axis=1, keepdims=True)) / X.std(axis=1, keepdims=True)
# Without keepdims=True, broadcasting fails
```

**Random state inconsistency**
```python
import numpy as np
import random

# Set all seeds at the top of the script
SEED = 42
np.random.seed(SEED)
random.seed(SEED)

# PyTorch
import torch
torch.manual_seed(SEED)
torch.cuda.manual_seed_all(SEED)
torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False

# sklearn
from sklearn.model_selection import train_test_split
X_train, X_test = train_test_split(X, random_state=SEED)
```

**Using `pdb` for interactive debugging**
```python
import pdb; pdb.set_trace()   # breakpoint (Python 3.7+: just `breakpoint()`)
# In pdb: n=next, s=step into, c=continue, p <var>=print, l=list code, q=quit
```

---

## Code Review for Correctness

### Statistical coding errors

**Data leakage — fitting on test data**
```python
# WRONG: scaler sees test data during fit
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)            # fits on ALL data
X_train, X_test = train_test_split(X_scaled)

# CORRECT: fit only on train, transform both
X_train, X_test = train_test_split(X)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)        # fit on train only
X_test = scaler.transform(X_test)              # apply same transform
```

**Target leakage — features that encode the outcome**
```python
# Example: 'diagnosis_date' is derived from the outcome — leakage
# Rule: no feature column should be causally downstream of the target
```

**Incorrect cross-validation with grouped data**
```python
# WRONG: rows from the same patient can appear in both train and test
cv = KFold(n_splits=5)

# CORRECT for grouped data (patients, subjects, locations):
from sklearn.model_selection import GroupKFold
cv = GroupKFold(n_splits=5)
for train_idx, test_idx in cv.split(X, y, groups=patient_ids):
    ...
```

**Wrong metric for imbalanced classes**
```python
# Accuracy is misleading when classes are imbalanced (95% negative → 95% by predicting all negative)
# Use instead:
from sklearn.metrics import roc_auc_score, average_precision_score, f1_score
auc = roc_auc_score(y_test, proba[:, 1])
ap = average_precision_score(y_test, proba[:, 1])   # area under PR curve
f1 = f1_score(y_test, preds, average='macro')
```

**Multiple comparisons without correction**
```python
from statsmodels.stats.multitest import multipletests

p_values = [0.03, 0.04, 0.001, 0.07, 0.02]
reject, p_corrected, _, _ = multipletests(p_values, alpha=0.05, method='fdr_bh')
# Benjamini-Hochberg FDR correction
```

**Numerical instability — log of zero or division by zero**
```python
# WRONG: log(0) = -inf
log_proba = np.log(proba)

# CORRECT: use log1p for values near 0, or clip
import numpy as np
log_proba = np.log(np.clip(proba, 1e-10, 1.0))

# Or use scipy which handles edge cases:
from scipy.special import xlogy
# xlogy(x, y) = x * log(y), returns 0 when x=0 (avoiding 0 * -inf)
```

**Integer overflow in numpy**
```python
# Default numpy int is int64; but some operations can overflow
counts = np.array([1000000], dtype=np.int32)
result = counts * counts    # overflows int32!

# Fix: use int64 or float
counts = counts.astype(np.int64)
```

---

## Profiling

### Find the bottleneck first

```bash
# cProfile — built-in, profile the whole script
python -m cProfile -s cumulative my_script.py 2>&1 | head -30

# Or profile a specific function:
import cProfile
cProfile.run('my_slow_function(data)', sort='cumulative')
```

### Line-level profiling

```bash
uv pip install line_profiler

# Decorate the function you suspect:
@profile
def my_slow_function(data):
    ...

# Run:
kernprof -l -v my_script.py
```

### Memory profiling

```bash
uv pip install memory_profiler

@profile
def memory_hungry_function(data):
    ...

python -m memory_profiler my_script.py
```

### Common bottlenecks and fixes

**Python loop over pandas rows**
```python
# SLOW: iterrows is ~1000x slower than vectorized
for idx, row in df.iterrows():
    result.append(row['a'] * row['b'])

# FAST: vectorized operation
result = df['a'] * df['b']

# FAST: apply (slower than vectorized but faster than iterrows)
result = df.apply(lambda row: row['a'] * row['b'], axis=1)
```

**Loading large CSV repeatedly**
```python
# Cache as parquet — 10-100x faster reads, much smaller files
df = pd.read_csv('large_data.csv')
df.to_parquet('large_data.parquet')

# Next time:
df = pd.read_parquet('large_data.parquet')
```

**Recomputing expensive results**
```python
import joblib

def expensive_computation(data):
    ...

# Cache with joblib.Memory
memory = joblib.Memory('./cache', verbose=0)
cached_fn = memory.cache(expensive_computation)
result = cached_fn(data)   # recomputes only when data changes
```

**Unnecessary copies of large arrays**
```python
# Check if an array is a view or a copy
x = arr[:100]
x.base is arr    # True → view (no copy); False → copy

# Prefer in-place operations when possible
arr += 1         # in-place, no copy
arr = arr + 1    # creates a new array
```

---

## Reproducibility

### Minimal reproducibility checklist

```python
# 1. Pin all random seeds (see debugging section above)

# 2. Log the environment
import subprocess, sys
print(sys.version)
print(subprocess.check_output(["pip", "freeze"]).decode())

# 3. Log the git commit
import subprocess
commit = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
print(f"Git commit: {commit}")

# 4. Log input data hashes
import hashlib, pandas as pd
def file_hash(path):
    return hashlib.md5(open(path, 'rb').read()).hexdigest()

print(f"Data hash: {file_hash('data/train.csv')}")

# 5. Save outputs with timestamps or version tags, not by overwriting
import datetime
ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
df.to_csv(f"results_{ts}.csv", index=False)
```

### Environment management

```bash
# Capture current environment
uv pip freeze > requirements.txt

# Recreate it
uv pip install -r requirements.txt

# For full isolation (recommended for sharing)
uv venv .venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

---

## Structuring Analysis Scripts

### Recommended layout for a single analysis

```
project/
├── data/
│   ├── raw/          # original, never modified
│   └── processed/    # outputs of preprocessing
├── notebooks/        # exploratory, named with date: 20240601_eda.ipynb
├── scripts/
│   ├── preprocess.py
│   ├── train.py
│   └── evaluate.py
├── outputs/
│   ├── figures/
│   └── results/
├── requirements.txt
└── README.md         # how to reproduce from scratch
```

### Make scripts runnable as CLI tools

```python
import argparse

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to input CSV")
    parser.add_argument("--output", default="results.csv")
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()

def main():
    args = parse_args()
    # ... use args.data, args.output, args.seed

if __name__ == "__main__":
    main()
```

---

## Integration

- **`/exploratory-data-analysis`** — understand what's in the data before debugging why analysis produces unexpected results
- **`/statistical-analysis`** — choose the right test; this skill fixes the code that runs it
- **`/experiment-tracking`** — once the code is correct, track runs with MLflow or W&B
- **`/polars`** — replace slow pandas pipelines with Polars for large datasets
