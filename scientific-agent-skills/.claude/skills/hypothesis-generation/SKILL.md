---
name: hypothesis-generation
description: Generate 3–5 competing testable hypotheses from scientific observations, backed by literature evidence and experimental predictions.
argument-hint: "<observation or research question> [--domain biology|chemistry|physics|clinical|computational]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /hypothesis-generation

Formulate mechanistic, testable hypotheses from a scientific observation or question. Produce competing explanations grounded in current literature, with experimental designs to distinguish between them.

## When to invoke

- "why does X happen?"
- "generate hypotheses for [observation]"
- "what could explain [anomalous result]?"
- "formulate hypotheses about [phenomenon]"

## Eight-Step Workflow

### Step 1: Understand the phenomenon

Extract from the user's input:
- Core observation (what was observed)
- Context (biological system, experimental conditions, population)
- Constraints (what is already ruled out, if stated)
- Timeframe (acute vs. chronic, developmental stage, etc.)

Ask if critical context is missing.

### Step 2: Literature search

Search PubMed, arXiv, and Semantic Scholar for:
- Direct papers on the phenomenon
- Related mechanistic papers (pathway, molecular, cellular)
- Contradicting or null results

Target 20–30 relevant papers. Use `/paper-lookup` for specific references.

### Step 3: Synthesize evidence

Map the evidence landscape:
- What mechanisms are established (well-supported, reproducible)?
- What mechanisms are proposed but contested?
- What is genuinely unknown?
- What analogous phenomena in other systems suggest?

### Step 4: Generate competing hypotheses

Generate **3–5 distinct mechanistic hypotheses**. Each hypothesis must:
- Propose a specific causal mechanism
- Be logically consistent with known facts
- Make different predictions from the other hypotheses
- Not be obviously ruled out by existing evidence

Format each hypothesis:

```
Hypothesis N: [Title]
Mechanism: [Specific causal chain, e.g., "A activates B, which phosphorylates C, leading to D"]
Supporting evidence: [2–3 key papers]
Contradicting evidence: [If any]
Key prediction: [What this hypothesis uniquely predicts]
```

### Step 5: Evaluate hypothesis quality

Score each hypothesis 1–5 on:

| Criterion | Description |
|---|---|
| Testability | Can it be directly tested with available methods? |
| Falsifiability | Does it make predictions that could prove it wrong? |
| Mechanistic specificity | Does it specify the molecular/causal mechanism? |
| Parsimony | Is it the simplest explanation consistent with evidence? |
| Literature support | How well does existing evidence support it? |

See `references/quality-criteria.md` for scoring rubric.

### Step 6: Design distinguishing experiments

For each pair of competing hypotheses, design an experiment that would distinguish between them:

```
Experiment to distinguish H1 vs H2:
Design: [Specific experimental setup]
Expected result if H1 is true: [Prediction]
Expected result if H2 is true: [Prediction]
Confounds to control for: [List]
```

### Step 7: Formulate quantitative predictions

Make each prediction measurable:
- "If H1 is true, we expect a 2–3 fold increase in X under condition Y"
- "If H2 is true, knockdown of gene Z will rescue phenotype P"
- "If H3 is true, compound A will inhibit process B with IC50 < 100 nM"

Specify measurement units, expected magnitude, and acceptable range.

### Step 8: Present report

````markdown
# Hypothesis Report: [Topic]

**Date:** YYYY-MM-DD
**Domain:** [biology/chemistry/physics/clinical/computational]
**Observation:** [Stated observation]

## Background

[2–3 paragraphs on current understanding]

## Competing Hypotheses

### Hypothesis 1: [Title]

**Mechanism:** [Specific causal chain]

**Evidence for:**
- [Citation 1]: [Key finding]
- [Citation 2]: [Key finding]

**Evidence against / gaps:**
- [Gap or contradicting result]

**Key prediction:** [Unique, measurable prediction]

**Quality scores:** Testability 4/5, Falsifiability 5/5, Mechanism 4/5, Parsimony 3/5, Support 3/5

---

### Hypothesis 2: [Title]
[...]

## Distinguishing Experiments

### H1 vs H2: [Experiment title]
[...]

## Quantitative Predictions

| Hypothesis | Measurement | Expected value | Conditions |
|---|---|---|---|
| H1 | X fold-change | 2–3× | Treat with Y, compare to control |

## Recommended Next Steps

1. [Most cost-effective first experiment]
2. [Parallel computational test]
3. [Longer-term validation]

## References

[Full bibliography]
````

## Quality standards

- Each hypothesis must be **mechanistically specific** — not just "X increases Y" but "X phosphorylates Y at Ser123, activating Z"
- All supporting claims must be cited
- Predictions must be quantitative where possible
- Acknowledge uncertainty explicitly
