---
name: experimental-design
description: Design statistically rigorous experiments before data collection. Covers design selection, randomization, blocking, sample size calculation, and treatment layouts.
argument-hint: "<research question> [--design factorial|rct|crossover|observational] [--treatment N] [--replicates N]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /experimental-design

Design experiments before running them. Choose the right design, randomize treatment allocation, block for nuisance variables, and calculate required sample sizes. Addresses the most common errors that invalidate published experiments.

## When to invoke

- "design an experiment to test X"
- "how many replicates do I need?"
- "randomize my treatment groups"
- "should I use a factorial or RCT design?"

## Fisher's three foundational principles

1. **Randomization** — randomly assign treatments to balance unknown confounders
2. **Replication** — independent repetition at the appropriate biological/technical level
3. **Blocking (local control)** — group similar units to remove nuisance variation

Violating any of these produces unreliable results regardless of sample size.

## Design Selection Guide

| Question type | Recommended design |
|---|---|
| Does treatment X affect outcome Y? | Randomized controlled trial (RCT) |
| Which of several treatments is best? | Multi-arm RCT or ANOVA |
| How do factors A and B interact? | Factorial design |
| Dose-response relationship? | Dose-escalation or response-surface |
| Genetic risk factors? | Case-control or cohort |
| Rare outcome, large population? | Case-control |
| Screening many compounds? | High-throughput with positive/negative controls |
| Optimizing a process? | Design of Experiments (DoE) |

## Workflow

### Step 1: Clarify the research question

Extract:
- **Primary endpoint**: what is the outcome measure?
- **Treatment factor(s)**: what are you manipulating?
- **Unit of randomization**: patient, animal, cell culture dish, batch?
- **Measurement level**: individual, aggregate, time series?
- **Confounders**: what variables might affect the outcome?

### Step 2: Select design

Use `references/design-patterns.md` for full decision tree.

Common designs:

**Completely Randomized Design (CRD)**
- All units randomly assigned to treatments
- Use when: homogeneous experimental units
- Analyse with: one-way ANOVA or t-test

**Randomized Complete Block Design (RCBD)**
- Units grouped into blocks; treatments assigned within blocks
- Use when: systematic variation exists (different operators, days, batches)
- Analyse with: two-way ANOVA (block + treatment)

**Factorial Design (2^k, 3^k, mixed)**
- All combinations of k factors at multiple levels
- Use when: interactions between factors are of interest
- Analyse with: multi-factor ANOVA

**Fractional Factorial (2^(k-p))**
- Subset of factorial combinations
- Use when: many factors, screening phase (run full factorial later)
- Confounding: main effects and 2-way interactions estimable if p selected correctly

**Latin Square**
- Two blocking factors, one treatment factor
- Use when: row and column blocking both needed (e.g., operator × day)

**Crossover**
- Each unit receives multiple treatments in sequence
- Use when: limited subjects, stable treatment effects (no carryover)

### Step 3: Calculate sample size

Power analysis requires:
- Effect size (Cohen's d for continuous; OR for binary; partial η² for factorial)
- Significance level α (typically 0.05)
- Power 1−β (typically 0.80 or 0.90)

```python
from scipy import stats
import numpy as np

def sample_size_ttest(effect_size, alpha=0.05, power=0.80):
    """Calculate n per group for two-sample t-test."""
    # Using scipy.stats.norm approximation
    z_alpha = stats.norm.ppf(1 - alpha/2)
    z_beta = stats.norm.ppf(power)
    n = ((z_alpha + z_beta) / effect_size) ** 2 * 2
    return int(np.ceil(n))

# Example: d=0.5, α=0.05, power=0.80 → n=64 per group
```

Use `scripts/randomization.py` for allocation.

### Step 4: Randomize

Generate allocation schedule — never use convenience ordering.

```python
# scripts/randomization.py
import random
import pandas as pd

def simple_randomization(n_per_group, treatments, seed=42):
    """Simple randomization — no blocking."""
    random.seed(seed)
    units = list(range(1, sum(n_per_group) + 1))
    allocation = []
    for t, n in zip(treatments, n_per_group):
        allocation.extend([t] * n)
    random.shuffle(allocation)
    return pd.DataFrame({"unit": units, "treatment": allocation})

def block_randomization(block_size, n_blocks, treatments, seed=42):
    """Block randomization — equal allocation within each block."""
    random.seed(seed)
    assert block_size % len(treatments) == 0, "Block size must be divisible by n treatments"
    reps_per_block = block_size // len(treatments)
    all_rows = []
    unit = 1
    for block in range(1, n_blocks + 1):
        block_alloc = treatments * reps_per_block
        random.shuffle(block_alloc)
        for t in block_alloc:
            all_rows.append({"block": block, "unit": unit, "treatment": t})
            unit += 1
    return pd.DataFrame(all_rows)
```

### Step 5: Identify confounders and controls

For each confounder, choose a control strategy:
- **Blocking** — include as a design variable
- **Randomization** — balanced across groups by randomization
- **Restriction** — limit sample to one stratum
- **Matching** — pair treated/untreated units with similar values
- **Covariate adjustment** — measure and include in analysis model

Essential controls:
- **Positive control** — confirms the assay works as expected
- **Negative control** — confirms no background signal
- **Vehicle/solvent control** — accounts for diluent effects
- **Time-matched control** — for longitudinal studies

### Step 6: Document the pre-registration plan

Write a pre-registration document before collecting data:

```markdown
# Pre-Registration: [Study Title]

**Registered:** YYYY-MM-DD

## Primary hypothesis
[H1: Treatment X will reduce outcome Y by Z% relative to control]

## Design
[CRD / RCBD / Factorial / ...]

## Sample size
[N = X per group; based on effect size δ = Y, α = 0.05, power = 0.80]

## Randomization
[Method: block randomization; block size: 4; seed: 42]

## Primary analysis
[Two-sample t-test / ANOVA / mixed model / ...]

## Secondary analyses
[List]

## Stopping rules
[None / DSMB review at 50% enrollment / ...]
```

## Critical errors to avoid

1. **Pseudoreplication** — treating repeated measurements of ONE unit as independent replicates. The unit of analysis must match the unit of randomization.
   - Wrong: 10 cell culture wells per dish, 2 dishes per treatment → n=10 per group
   - Right: n=2 per group (dishes are the biological replicates)

2. **Post-hoc design changes** — changing the primary endpoint after seeing the data inflates false positive rate.

3. **Unblinded measurement** — raters who know group assignment introduce systematic bias.

4. **Convenience sampling instead of randomization** — first-available animals, easiest-to-reach patients, etc.

5. **Ignoring carryover in crossover designs** — washout periods must be long enough.

6. **Technical vs. biological replicates** — technical replicates measure assay precision; only biological replicates measure biological variability.

## Output format

```markdown
# Experimental Design: [Study Title]

## Design Summary
- **Design type:** [CRD / RCBD / Factorial / ...]
- **Treatments:** [A, B, C]
- **Replicates:** N per group
- **Total units:** N total
- **Blocking factors:** [list or None]

## Randomization Schedule
[Table: unit → treatment assignment]

## Sample Size Justification
- Effect size: δ = [value]
- α = 0.05, Power = 0.80
- Required n = [value] per group

## Controls
- Positive: [description]
- Negative: [description]
- Vehicle: [description]

## Statistical Analysis Plan
[Pre-specified analysis method]

## Timeline
[Estimated duration by phase]
```
