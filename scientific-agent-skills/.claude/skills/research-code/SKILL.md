---
name: research-code
description: "Debug, profile, review, and restructure Python research and analysis code. Use when analysis scripts crash, produce wrong results, run too slowly, or need a correctness review before publication. Covers: reading tracebacks, hypothesis-driven debugging, common statistical/numerical coding errors (data leakage, NaN propagation, wrong axis, integer overflow, multiple comparisons), profiling pipelines, improving reproducibility (seeds, environments, hashing), and organizing analysis scripts. Do NOT use for understanding data content (use /exploratory-data-analysis) or choosing statistical tests (use /statistical-analysis)."
argument-hint: "<debug|profile|review|reproduce> [file or paste code]"
version: "1.0"
author: "K-Dense, Inc. (adapted)"
---

# /research-code

Debug, review for correctness, profile, and restructure Python research code.

## When to invoke

- "My analysis script is crashing with a KeyError"
- "The results change every time I run this — how do I make it reproducible?"
- "My pipeline takes 2 hours — find the bottleneck"
- "Review this code for statistical errors before I submit"
- "I'm getting NaN in my output and can't figure out where"
- "How should I structure this analysis project?"
- "Check for data leakage in my ML pipeline"

## Quick checklist by symptom

| Symptom | First check |
|---|---|
| Crash / exception | Read the traceback bottom-up; check line number |
| Wrong numbers | NaN propagation? Wrong axis? Data leakage? |
| Results change each run | Set `np.random.seed`, `random.seed`, `torch.manual_seed` |
| Pipeline too slow | `python -m cProfile -s cumulative script.py` |
| Memory blowup | `memory_profiler`; avoid loading all data at once |
| NaN in output | `np.isnan(X).any()` at each pipeline step |
| Bad CV performance | Check for data leakage or wrong GroupKFold |

## Common errors to check first

```python
# 1. Data leakage: fitting scaler on full data before split
scaler.fit_transform(X)          # WRONG — sees test data
scaler.fit_transform(X_train)    # RIGHT — train only

# 2. Wrong axis
X.mean(axis=0)    # mean per column (across rows)
X.mean(axis=1)    # mean per row (across columns)

# 3. Silent NaN propagation
assert not np.isnan(X).any(), "NaN found"

# 4. iloc vs loc
df.iloc[0:5]    # rows 0–4 (positional)
df.loc[0:5]     # rows with index labels 0–5 (inclusive)

# 5. Random seeds
np.random.seed(42); random.seed(42); torch.manual_seed(42)
```

## Profile a slow script

```bash
python -m cProfile -s cumulative my_script.py | head -30
uv pip install line_profiler && kernprof -l -v my_script.py
```

## Reproducibility in 3 lines

```python
import hashlib
print(f"Data hash: {hashlib.md5(open('data.csv','rb').read()).hexdigest()}")
print(f"Git: {subprocess.check_output(['git','rev-parse','HEAD']).decode().strip()}")
```

## Limitations

- Cannot run code directly from a pasted snippet without a file — write to a temp file first
- Profiling requires the script to be runnable end-to-end; partial snippets need wrapping
- GPU determinism on CUDA requires additional flags beyond `torch.manual_seed`
