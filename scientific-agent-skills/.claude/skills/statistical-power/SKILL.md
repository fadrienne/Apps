---
name: statistical-power
description: "Sample size calculation, power analysis, and effect size conversion. Use when someone asks 'how many samples do I need', 'what is my power', or 'what effect size can I detect'. Covers a priori power (required N), sensitivity analysis (minimum detectable effect), post-hoc power, power curves, and simulation-based power for clustered/nested designs where formulas don't exist. Pairs with /experimental-design (design first, then power) and /statistical-analysis (analyze after collection)."
argument-hint: "<test-type> <effect-size> [--power 0.80] [--alpha 0.05] [--n <fixed-n>]"
version: "1.0"
author: "K-Dense, Inc. (adapted)"
---

# /statistical-power

Compute required sample size, achieved power, or minimum detectable effect for standard statistical tests. For complex designs, run Monte Carlo simulations.

## When to invoke

- "How many subjects do I need to detect d=0.5 with 80% power?"
- "What is my power given N=50 and I expect a medium effect?"
- "What's the smallest correlation I can detect with n=100?"
- "Power my clustered RCT — 10 clusters/arm, 20/cluster, ICC=0.05"
- "Show me a power curve for sample sizes 20–200"
- "How many participants drop out before I should inflate N?"

## Quick reference

| Test | Key input | Tool |
|---|---|---|
| Independent t-test | Cohen's d, n per group | `statsmodels.stats.power.TTestIndPower` |
| Paired t-test | Cohen's d, n pairs | `statsmodels.stats.power.TTestPower` |
| One-way ANOVA | Cohen's f, k groups, n/group | `statsmodels.stats.power.FtestAnovaPower` |
| Chi-square | Cohen's w, df | `statsmodels.stats.power.GofChisquarePower` |
| Two proportions | p1, p2 | `statsmodels.stats.proportion.proportion_effectsize` + `NormalIndPower` |
| Correlation | r | `pingouin.power_corr` |
| Regression F-test | Cohen's f², df_num | `statsmodels.stats.power.FtestPower` |
| Clustered/nested designs | ICC, cluster size | Simulation (see full SKILL.md) |

## Effect size conventions (last resort — prefer literature estimates)

| Test | Small | Medium | Large |
|---|---|---|---|
| d (t-test) | 0.20 | 0.50 | 0.80 |
| f (ANOVA) | 0.10 | 0.25 | 0.40 |
| w (chi-square) | 0.10 | 0.30 | 0.50 |
| r (correlation) | 0.10 | 0.30 | 0.50 |
| f² (regression) | 0.02 | 0.15 | 0.35 |

## Installation

```bash
uv pip install "scipy>=1.11" "pingouin>=0.6" "statsmodels>=0.14" "numpy>=1.26" "matplotlib>=3.8"
```

## Limitations

- Post-hoc power is circular and should not be used to interpret null results — use CIs on effect size instead
- Clustered/nested designs require ICC estimates; use simulation from the full SKILL.md scripts
- Always inflate N for expected attrition: `N_enroll = N_required / (1 − dropout_rate)`
