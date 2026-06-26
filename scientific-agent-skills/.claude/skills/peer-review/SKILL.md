---
name: peer-review
description: Conduct structured peer review of scientific manuscripts following journal standards. Evaluates scientific rigor, statistical methods, reproducibility, and writing quality.
argument-hint: "<manuscript file or text> [--journal Nature|Science|PLOS|generic] [--depth brief|standard|detailed]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /peer-review

Review a scientific manuscript as a rigorous but fair peer reviewer. Provide structured critique of scientific merit, methodology, reproducibility, and presentation.

## When to invoke

- "review this paper"
- "peer review this manuscript"
- "give me feedback on this paper"
- "critique this draft"

## Review Philosophy

- Be rigorous but constructive — identify problems AND suggest how to fix them
- Distinguish major concerns (affect scientific conclusions) from minor concerns (improve clarity)
- Evaluate what was done, not what you would have done differently
- Assume good faith: authors likely know their system better than you

## Review Structure

### Section 1: Summary (1–2 paragraphs)

Summarize:
- Research question
- Approach/methodology
- Key claims
- Significance of the work

This section shows authors you understood their paper before critiquing it.

### Section 2: Major Concerns

Issues that affect the scientific validity or interpretability of conclusions. Each concern must:
1. Identify the specific problem
2. Explain why it matters
3. Suggest a remedy (experiment, analysis, or clarification)

Common major concerns:
- **Statistical issues**: underpowered study, inappropriate test, multiple testing not corrected
- **Controls**: missing positive/negative controls, confounded controls
- **Reproducibility**: insufficient methods detail, no code/data deposited
- **Overinterpretation**: conclusions not supported by the data shown
- **Alternative explanations**: plausible mechanisms not considered or ruled out
- **Generalizability**: results shown in one cell line/species/condition claimed as general

### Section 3: Minor Concerns

Issues that affect clarity or completeness but not scientific conclusions:
- Figure clarity (axis labels, color choice, legend completeness)
- Writing (unclear sentences, undefined acronyms, inconsistent terminology)
- Citation gaps (obvious relevant work not cited)
- Supplementary organization

### Section 4: Statistical Review

Specifically evaluate:

| Aspect | Questions to ask |
|---|---|
| Sample size | Is n sufficient? Was power analysis done? |
| Statistical test | Is the test appropriate for the data distribution and design? |
| Multiple comparisons | Are post-hoc corrections applied when testing multiple hypotheses? |
| Error bars | Are SD vs SEM vs 95% CI clearly labeled? Is the choice appropriate? |
| Individual data points | Are individual replicates shown (not just means)? |
| P-value reporting | Are exact p-values given or just "p < 0.05"? |
| Effect sizes | Are effect sizes reported alongside p-values? |
| Normality | Are parametric tests justified for the sample size? |

### Section 5: Reproducibility Checklist

- [ ] All materials, reagents, cell lines, organisms specified with source
- [ ] Key methods have sufficient detail to replicate
- [ ] Custom code available (GitHub/Zenodo link or deposit required)
- [ ] Raw data available (repository link)
- [ ] Statistical analysis code available
- [ ] Sample identifiers and randomization documented

### Section 6: Recommendation

Choose one:
- **Accept** — ready for publication with no/minor changes
- **Minor Revision** — specific changes needed, no new experiments required
- **Major Revision** — substantial new experiments or major reanalysis needed
- **Reject** — fundamental flaws not addressable with revision

Justify with reference to specific concerns listed above.

## Output Format

````markdown
# Peer Review: [Paper Title]

**Reviewer assessment:** [Accept / Minor Revision / Major Revision / Reject]
**Review type:** [blind / open]
**Date:** YYYY-MM-DD

---

## Summary

[2–3 paragraph summary of the paper's research question, approach, and claims]

---

## Major Concerns

### MC1: [Short title]

[Description of the problem, why it matters, suggested remedy]

### MC2: [Short title]
[...]

---

## Minor Concerns

### mn1: [Short title]
[Description and suggestion]

---

## Statistical Review

| Aspect | Assessment |
|---|---|
| Sample size | [Adequate / Inadequate / Unclear] |
| Statistical tests | [Appropriate / See concern MC1] |
| Multiple comparisons | [Corrected / Not corrected — flagged in MC2] |
| Error bars | [Clearly labeled / Unclear] |
| Effect sizes | [Reported / Missing] |
| Raw data | [Available / Missing — see reproducibility] |

---

## Reproducibility

- [x] Methods detail sufficient
- [x] Materials specified
- [ ] Code available — MISSING: custom analysis scripts not deposited
- [ ] Raw data available — MISSING: mass spec raw files not in repository

---

## Minor Suggestions for Figures and Writing

- Figure 2B: y-axis label missing units
- Line 203: "significant" used without threshold — specify α
- Supplementary Figure S4 is referenced but not provided

---

## Recommendation

**Major Revision**

The research question is important and the experimental approach is largely sound. However, the statistical analysis (MC1) and missing controls (MC2) must be addressed before the conclusions are defensible.
````

## Calibration by field

**Biomedical/clinical:** Stricter on sample size, blinding, and placebo controls. IRB/ethics statement required.

**Computational/CS:** Emphasis on baseline comparisons, ablation studies, dataset leakage, reproducibility (code + data + seed).

**Chemistry:** Emphasis on compound characterization (NMR, HRMS), yield reproducibility, reagent purity.

**Physics:** Emphasis on uncertainty quantification, calibration data, reproducibility of key measurements.
