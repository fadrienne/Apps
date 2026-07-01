---
name: statistical-power
description: "Sample size calculation, power analysis, and effect size conversion for scientific studies. Use BEFORE data collection (a priori) to determine required N, or after (post-hoc) to compute achieved power. Covers parametric tests (t-test, ANOVA, chi-square, proportions, correlation, regression), simulation-based power for complex/clustered/nested designs, and power curves. Use this skill when someone asks 'how many samples do I need', 'what is my power', 'what effect size can I detect', or any variant. Pairs with /experimental-design (choose design first, then compute power) and /statistical-analysis (analyze data after collection)."
allowed-tools: Read Write Edit Bash
compatibility: "Python >=3.10. Core: scipy, pingouin, statsmodels, numpy, matplotlib. Install with uv as shown below."
license: MIT license
metadata: {"version": "1.0", "skill-author": "K-Dense Inc."}
---

# Statistical Power

## Overview

Power analysis answers three questions before you collect data:

1. **A priori (most common)** — Given a desired power, significance level, and effect size, how large a sample do I need?
2. **Sensitivity** — Given my actual N and significance level, what is the smallest effect I can detect at 80% power?
3. **Post-hoc** — Given my actual N and effect size, what was my achieved power?

**Power (1 − β)** is the probability of correctly rejecting H₀ when the effect is real. Convention: 0.80 is the minimum acceptable; 0.90 or 0.95 for high-stakes decisions.

**Significance level (α)** is the tolerable Type I error rate. Convention: 0.05 for most research; 0.01 or lower for multiple-testing contexts.

**Effect size** is a standardized, scale-free measure of the magnitude of the effect. See the Effect Size Reference below.

---

## Installation

```bash
uv pip install "scipy>=1.11" "pingouin>=0.6" "statsmodels>=0.14" "numpy>=1.26" "matplotlib>=3.8"
```

---

## When to Use This Skill

- Designing a study and need to know how many subjects/samples to recruit
- Reviewer asks "was the study adequately powered?"
- Writing a grant or protocol that requires a power justification
- Computing the minimum detectable effect for a fixed budget (N is constrained)
- Powering a complex design (nested, clustered, repeated-measures) where formulas don't exist
- Plotting power curves to communicate the sample-size trade-off

---

## Workflow

### Step 1 — Identify the primary analysis

Ask (or infer) what statistical test will answer the primary research question. Power is test-specific. Common mappings:

| Research question | Test | Effect size metric |
|---|---|---|
| Compare two group means | Independent t-test | Cohen's d |
| Compare paired/pre-post means | Paired t-test | Cohen's d |
| Compare ≥3 group means | One-way ANOVA | Cohen's f |
| Test association in a contingency table | Chi-square | Cohen's w |
| Test difference in two proportions | Proportions z-test | h (arcsine diff) |
| Test correlation ≠ 0 | Pearson r test | r |
| Regression: does the model explain variance? | F-test (regression) | Cohen's f² |
| Survival comparison | Log-rank test | hazard ratio |
| Clustered/nested data | Simulation | ICC + design effect |

### Step 2 — Choose or estimate the effect size

Use one of these sources, in order of preference:

1. **Prior literature** — meta-analytic estimates, pilot data
2. **Minimum clinically / scientifically meaningful difference** — the smallest effect that would change decisions
3. **Cohen's conventions** (last resort) — small/medium/large (see table below). Note: conventions are field-specific and often under-powered.

### Step 3 — Run the calculation

Use the scripts in `scripts/power_analysis.py` or the inline patterns below.

### Step 4 — Report

Always report: test, α, target power (1−β), effect size and its source, resulting N per group/arm, and total N.

---

## Closed-Form Power Calculations

### Independent samples t-test

```python
from scipy.stats import norm
import numpy as np

def power_ttest(d, n, alpha=0.05, tails=2):
    """Power of an independent-samples t-test given Cohen's d and n per group."""
    se = np.sqrt(2 / n)
    ncp = d / se  # non-centrality parameter (approx, large N)
    crit = norm.ppf(1 - alpha / tails)
    power = 1 - norm.cdf(crit - ncp) + norm.cdf(-crit - ncp)
    return power

def n_ttest(d, power=0.80, alpha=0.05, tails=2):
    """Required n per group for an independent-samples t-test."""
    from statsmodels.stats.power import TTestIndPower
    analysis = TTestIndPower()
    n = analysis.solve_power(effect_size=d, power=power, alpha=alpha,
                             alternative='two-sided' if tails == 2 else 'larger')
    return np.ceil(n)

# Example: detect d=0.5 with 80% power, α=0.05
print(n_ttest(d=0.5))  # → 64 per group, 128 total
```

### Paired t-test

```python
from statsmodels.stats.power import TTestPower

def n_paired_ttest(d, power=0.80, alpha=0.05):
    analysis = TTestPower()
    n = analysis.solve_power(effect_size=d, power=power, alpha=alpha)
    return np.ceil(n)

print(n_paired_ttest(d=0.5))  # → 34 pairs
```

### One-way ANOVA

```python
from statsmodels.stats.power import FtestAnovaPower

def n_anova(f, k, power=0.80, alpha=0.05):
    """n per group for one-way ANOVA with k groups and Cohen's f."""
    analysis = FtestAnovaPower()
    n = analysis.solve_power(effect_size=f, power=power, alpha=alpha, k_groups=k)
    return np.ceil(n)

print(n_anova(f=0.25, k=3))  # → 52 per group, 156 total
```

### Chi-square test

```python
from statsmodels.stats.power import GofChisquarePower

def n_chisq(w, df, power=0.80, alpha=0.05):
    """N for a chi-square goodness-of-fit or association test.
    df = (rows-1)*(cols-1) for association tables."""
    analysis = GofChisquarePower()
    n = analysis.solve_power(effect_size=w, power=power, alpha=alpha, n_bins=df+1)
    return np.ceil(n)
```

### Proportions test

```python
from statsmodels.stats.proportion import proportion_effectsize
from statsmodels.stats.power import NormalIndPower

def n_proportions(p1, p2, power=0.80, alpha=0.05):
    """N per group to detect difference between proportions p1 and p2."""
    h = proportion_effectsize(p1, p2)
    analysis = NormalIndPower()
    n = analysis.solve_power(effect_size=h, power=power, alpha=alpha)
    return np.ceil(n), h

n, h = n_proportions(0.20, 0.35)
print(f"h={h:.3f}, n per group={n}")
```

### Pearson correlation

```python
import pingouin as pg

result = pg.power_corr(r=0.30, n=None, power=0.80, alpha=0.05, alternative='two-sided')
print(result)  # n=84
```

### Multiple regression (R² increment)

```python
from statsmodels.stats.power import FtestPower

def n_regression(f2, u, power=0.80, alpha=0.05):
    """N for testing R² increment in multiple regression.
    f2 = Cohen's f² for the tested predictors.
    u = degrees of freedom for the tested predictors."""
    analysis = FtestPower()
    n = analysis.solve_power(effect_size=f2, df_num=u, power=power, alpha=alpha)
    return np.ceil(n + u + 1)  # total N

print(n_regression(f2=0.15, u=3))
```

---

## Power Curves

Plot power vs. N for a range of effect sizes to communicate the trade-off:

```python
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.stats.power import TTestIndPower

analysis = TTestIndPower()
ns = np.arange(10, 200, 5)
fig, ax = plt.subplots(figsize=(7, 4))

for d, label in [(0.2, 'small (d=0.2)'), (0.5, 'medium (d=0.5)'), (0.8, 'large (d=0.8)')]:
    powers = [analysis.solve_power(effect_size=d, nobs1=n, alpha=0.05) for n in ns]
    ax.plot(ns, powers, label=label)

ax.axhline(0.80, color='gray', linestyle='--', label='80% power')
ax.axhline(0.90, color='gray', linestyle=':', label='90% power')
ax.set_xlabel('N per group')
ax.set_ylabel('Power (1 − β)')
ax.set_title('Power curves — independent t-test (α = 0.05)')
ax.legend()
ax.set_ylim(0, 1)
plt.tight_layout()
plt.savefig('power_curve.png', dpi=150)
```

---

## Simulation-Based Power

Use simulation when:
- The design is clustered, nested, or mixed (ICC matters)
- The outcome is non-normal (binary, count, ordinal, skewed)
- You have multiple primary outcomes
- The test statistic has no standard closed form

```python
import numpy as np
from scipy import stats

def simulate_power_clustered(n_clusters, n_per_cluster, icc, delta,
                              sigma_total=1.0, alpha=0.05, n_sim=2000, seed=42):
    """
    Power for comparing two arms of a cluster-randomized trial.
    
    Parameters
    ----------
    n_clusters : int   — clusters per arm
    n_per_cluster : int — subjects per cluster
    icc : float        — intraclass correlation (0 to 1)
    delta : float      — true mean difference between arms
    sigma_total : float — total SD
    """
    rng = np.random.default_rng(seed)
    sigma_b = np.sqrt(icc * sigma_total**2)          # between-cluster SD
    sigma_w = np.sqrt((1 - icc) * sigma_total**2)    # within-cluster SD
    reject = 0

    for _ in range(n_sim):
        # Arm 0
        cluster_effects_0 = rng.normal(0, sigma_b, n_clusters)
        arm0 = np.concatenate([
            rng.normal(cluster_effects_0[c], sigma_w, n_per_cluster)
            for c in range(n_clusters)
        ])
        # Arm 1
        cluster_effects_1 = rng.normal(delta, sigma_b, n_clusters)
        arm1 = np.concatenate([
            rng.normal(cluster_effects_1[c], sigma_w, n_per_cluster)
            for c in range(n_clusters)
        ])
        _, p = stats.ttest_ind(arm0, arm1)
        reject += p < alpha

    return reject / n_sim

# Example: 10 clusters/arm, 20 subjects/cluster, ICC=0.05, d=0.5
power = simulate_power_clustered(10, 20, icc=0.05, delta=0.5)
print(f"Simulated power: {power:.3f}")
```

**Design effect (DEFF) shortcut** — for a rough adjustment without simulation:

```python
def design_effect(icc, n_per_cluster):
    """DEFF = 1 + (n-1) * ICC. Multiply required N_simple by DEFF."""
    return 1 + (n_per_cluster - 1) * icc

# If simple t-test needs 64/arm, and DEFF=1.95:
n_simple = 64
deff = design_effect(icc=0.05, n_per_cluster=20)
n_adjusted = np.ceil(n_simple * deff)
print(f"DEFF={deff:.2f}, adjusted N per arm={n_adjusted}")
```

---

## Effect Size Reference

### Conventions (Cohen, 1988)

| Test | Metric | Small | Medium | Large |
|---|---|---|---|---|
| t-test | d | 0.20 | 0.50 | 0.80 |
| ANOVA | f | 0.10 | 0.25 | 0.40 |
| Chi-square / proportions | w | 0.10 | 0.30 | 0.50 |
| Correlation | r | 0.10 | 0.30 | 0.50 |
| Regression (R² increment) | f² | 0.02 | 0.15 | 0.35 |

**Warning**: Cohen's conventions are rough defaults derived from social psychology in 1988. They are not calibrated to your field. Always prefer an effect size from prior literature or a minimum clinically meaningful difference.

### Conversions

```python
import numpy as np

def d_from_means(m1, m2, sd_pooled):
    return (m1 - m2) / sd_pooled

def d_from_t(t, n1, n2):
    return t * np.sqrt((n1 + n2) / (n1 * n2))

def r_from_d(d):
    return d / np.sqrt(d**2 + 4)

def d_from_r(r):
    return 2 * r / np.sqrt(1 - r**2)

def f_from_eta2(eta2):
    return np.sqrt(eta2 / (1 - eta2))

def eta2_from_f(f):
    return f**2 / (1 + f**2)

def OR_to_d(OR):
    return np.log(OR) * (np.sqrt(3) / np.pi)
```

---

## Common Mistakes

1. **Using post-hoc power to interpret a null result** — post-hoc power is circular (it's entirely determined by the observed p-value) and tells you nothing about whether the null is true. Use confidence intervals on the effect size instead.

2. **Ignoring attrition** — inflate the required N by the expected dropout rate: `N_enrolled = N_required / (1 - dropout_rate)`.

3. **Single primary outcome** — power calculations apply to your *primary* outcome. Secondary outcomes will be underpowered. Do not adjust for multiplicity in the power calculation unless you are powering for a composite outcome.

4. **Using variance from a different population or measurement** — the SD estimate must match your specific population and measurement instrument.

5. **Ignoring the design effect for clustered data** — forgetting ICC inflates apparent power. Always compute DEFF for clustered designs.

---

## Integration

- **`/experimental-design`** — determines the study design; call `/statistical-power` after design is fixed
- **`/statistical-analysis`** — analyzes data after collection; reports observed effect size and CI
- **`/scientificwriting`** — includes the power justification in the Methods section
