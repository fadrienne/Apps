# Experimental Patterns for Hypothesis Testing

A reference of canonical experimental designs used to test common scientific hypothesis types.

## Causal Hypotheses ("X causes Y")

**Gold standard:** Randomized controlled trial (RCT) or controlled experiment with randomization.

| Context | Design | Key controls |
|---|---|---|
| Cell biology | Treatment vs. vehicle control; n ≥ 3 biological replicates | Negative control, positive control, DMSO vehicle |
| Mouse model | Randomized treatment assignment; littermate controls | Age/sex matching, blinded scoring |
| Observational epidemiology | Difference-in-differences, propensity score matching | Confounders: age, sex, SES |
| Clinical | Parallel RCT with allocation concealment | ITT analysis, CONSORT reporting |

**Causal inference checklist:**
1. Temporality — does X precede Y?
2. Dose-response — larger X → larger Y?
3. Reversibility — does removing X reverse Y?
4. Mechanism — is there a plausible pathway?
5. Consistency — replicated in independent systems?

## Mechanistic Hypotheses ("X works via M")

**Target:** Identify the intermediate (mediator M) linking X to Y.

| Approach | Method | When to use |
|---|---|---|
| Genetic knockdown/KO | siRNA, shRNA, CRISPR KO of M | When M is a gene product |
| Pharmacological inhibition | Specific small molecule inhibitor of M | When selective inhibitor exists |
| Rescue experiment | KO M, then re-express M → Y restored | Confirms causality of M |
| Mediation analysis | Path model: X→M→Y (causal mediation) | Observational human data |
| Biochemical interaction | Co-IP, pull-down, proximity ligation assay | Protein-protein interaction |

**Baron–Kenny mediation (observational):**
```
Step 1: X → Y (significant)
Step 2: X → M (significant)
Step 3: M → Y (controlling for X, significant)
Step 4: X → Y effect reduced when M included (partial/full mediation)
```

## Biomarker / Predictive Hypotheses ("M predicts Y")

**Target:** Validate a diagnostic or prognostic biomarker.

| Phase | Design | Key metric |
|---|---|---|
| Discovery | Case-control, retrospective cohort | AUROC > 0.80 |
| Validation | Independent cohort, prospective | Net reclassification improvement (NRI) |
| Clinical utility | Decision curve analysis | Net benefit vs. treat-all/treat-none |

**Key pitfalls:**
- Overfitting: always validate on independent test set
- Spectrum bias: discovery cohort should match intended use population
- Measurement error: pre-analytical variables (storage, hemolysis)

## Comparative Hypotheses ("A is better than B")

**For efficacy:**
- Primary endpoint defined prospectively
- Non-inferiority vs. superiority framing determines sample size
- Effect size + CI reported; p-value alone insufficient

**For performance benchmarks (ML/CS):**
```python
# Statistical comparison of models
from scipy.stats import wilcoxon  # paired non-parametric

model_a_scores = [0.82, 0.85, 0.80, 0.84, 0.83]
model_b_scores = [0.79, 0.81, 0.78, 0.82, 0.80]

stat, p = wilcoxon(model_a_scores, model_b_scores)
```

## Dose–Response Hypotheses

**Target:** Establish concentration-effect relationship.

```python
from scipy.optimize import curve_fit
import numpy as np

def hill_equation(x, bottom, top, ec50, n):
    """4-parameter logistic (4PL) / Hill equation."""
    return bottom + (top - bottom) / (1 + (ec50 / x) ** n)

# Fit dose-response curve
doses = np.array([0.001, 0.01, 0.1, 1, 10, 100])  # µM
response = np.array([2, 5, 25, 65, 89, 95])         # % effect

popt, pcov = curve_fit(hill_equation, doses, response,
                       p0=[0, 100, 1.0, 1.0],
                       bounds=([0, 50, 0, 0], [20, 110, 100, 10]))
bottom, top, ec50, n = popt
print(f"EC50 = {ec50:.3f} µM, Hill slope = {n:.2f}")
```

**Key parameters to report:**
- EC50/IC50 (effective/inhibitory concentration at 50%)
- Hill slope (cooperativity)
- Emax (maximum effect)
- R² of fit

## Genetic Association Hypotheses

**GWAS design:**
- Case-control or quantitative trait
- Population stratification: use principal components as covariates
- Multiple testing: Bonferroni (p < 5×10⁻⁸ for genome-wide) or FDR q < 0.05

**Mendelian Randomization:**
```
Hypothesis: Genetically elevated X causally increases Y
Instrument: SNPs (G) that robustly affect X (F-statistic > 10)
Estimate: IV estimator = β(G→Y) / β(G→X)
Assumption: G affects Y only through X (exclusion restriction)
```

## Negative Controls

Every experiment needs a negative control. Common patterns:

| Experiment type | Negative control |
|---|---|
| Cell treatment | Vehicle (DMSO, PBS) at same volume |
| siRNA knockdown | Non-targeting siRNA (scramble) |
| CRISPR KO | Non-targeting sgRNA |
| Western blot | No primary antibody |
| ELISA | Buffer without analyte |
| Animal model | Sham surgery (no treatment) |
| ML model | Random classifier / majority class |
