# Hypothesis Quality Criteria

A rubric for evaluating scientific hypotheses. Each criterion is scored 1–5.

## Criterion 1: Testability (weight 0.25)

The hypothesis must generate specific, measurable predictions that can be tested within current technological constraints.

| Score | Description |
|---|---|
| 5 | Predicts exact numerical outcomes with specified conditions; test is straightforward with existing tools |
| 4 | Clear experimental test exists; predictions are quantitative but test is challenging |
| 3 | Testable in principle; predictions are semi-quantitative; test requires significant effort |
| 2 | Testable but only indirectly; predictions are qualitative |
| 1 | Cannot be tested with current technology or lacks concrete predictions |

**Questions to ask:**
- What experiment would provide a definitive test?
- What instrument or assay measures the predicted outcome?
- Can the key variable be manipulated or only observed?

## Criterion 2: Falsifiability (weight 0.20)

A good hypothesis must be capable of being proven wrong. Unfalsifiable hypotheses make no scientific progress.

| Score | Description |
|---|---|
| 5 | States explicit conditions under which it is false; negative result would be unambiguous |
| 4 | Clear falsifying condition exists; interpretation might require additional controls |
| 3 | Could be falsified but would require ruling out several alternative explanations first |
| 2 | Difficult to falsify because the hypothesis is too broad or has escape clauses |
| 1 | Unfalsifiable (e.g., "could be caused by unknown factors") |

**Red flags:**
- "X may play a role in Y" — too vague to falsify
- "Under some conditions..." — escape clause
- Post-hoc modification of predictions after seeing data

## Criterion 3: Mechanistic Specificity (weight 0.25)

Explains *how* and *why*, not just *what*. A mechanistic hypothesis identifies the biological/chemical/physical mechanism.

| Score | Description |
|---|---|
| 5 | Full molecular/mechanistic chain specified; pathway, molecule, and modification identified |
| 4 | Mechanism proposed at molecular level with one or two gaps |
| 3 | General mechanism proposed (e.g., "via phosphorylation") without full pathway |
| 2 | Correlational only ("X is associated with Y") with no proposed mechanism |
| 1 | Black box / no mechanism |

**Example scoring:**
- "Caffeine increases alertness" → Score 2 (correlational)
- "Caffeine blocks adenosine A1/A2A receptors, preventing adenosine-mediated inhibition of dopamine release in the striatum" → Score 5

## Criterion 4: Parsimony (weight 0.15)

Prefers the simplest explanation that accounts for all observations (Occam's Razor).

| Score | Description |
|---|---|
| 5 | Minimal assumptions; explains all observations with a single principle |
| 4 | One or two reasonable assumptions beyond established knowledge |
| 3 | Multiple assumptions; some are speculative |
| 2 | Requires many assumptions or invokes novel entities without necessity |
| 1 | More complex than needed; simpler alternative exists that explains the data |

## Criterion 5: Literature Support (weight 0.15)

Not just whether the hypothesis is consistent with known facts, but whether prior work motivates it.

| Score | Description |
|---|---|
| 5 | Directly motivated by 3+ recent high-quality studies; no contradicting evidence |
| 4 | Motivated by published evidence; one or two conflicting reports |
| 3 | Plausible given background knowledge; limited direct evidence |
| 2 | Speculative; consistent with known biology but no direct evidence |
| 1 | Contradicts published evidence |

## Composite Score

```
Score = 0.25 × Testability + 0.20 × Falsifiability + 0.25 × Mechanism + 0.15 × Parsimony + 0.15 × Literature

Thresholds:
  ≥ 4.0 → Strong hypothesis; proceed to experimental design
  3.0–3.9 → Develop further before testing; identify weakest criterion
  < 3.0 → Rethink; consider whether the question is well-posed
```

## Common Hypothesis Flaws

| Flaw | Example | Fix |
|---|---|---|
| Too broad | "Stress affects cancer" | "Chronic glucocorticoid signaling promotes tumor invasion via upregulation of MMP-9 in breast cancer cells" |
| Circular | "Patients feel pain because they have a low pain threshold" | Define the threshold independently |
| No mechanism | "Drug X improves outcomes" | State the target and pathway |
| Multiple phenomena | "X affects A, B, and C via multiple pathways" | Break into separate hypotheses, one per mechanism |
| Assumes conclusion | "Patients with high X have poor outcomes *due to* X" | "X is associated with outcome Z; we hypothesize X *causes* Z via mechanism M" |
