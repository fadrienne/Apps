---
name: clinical-decision-support
description: Evidence-based clinical decision support using clinical guidelines, drug databases, and medical literature. Covers drug interactions, dosing, contraindications, and differential diagnosis support.
argument-hint: "<clinical question> [--type drug-interaction|dosing|differential|guideline|contraindication]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /clinical-decision-support

Provide evidence-based clinical decision support by querying medical databases, clinical guidelines, and drug references.

**IMPORTANT: This skill provides decision SUPPORT only. All clinical decisions must be made by licensed healthcare professionals. Never use this tool as a substitute for clinical judgment, professional consultation, or established institutional protocols.**

## When to invoke

- "drug interaction between X and Y"
- "dosing for X in renal impairment"
- "contraindications for X"
- "differential diagnosis for symptoms Y"
- "latest guideline for condition Z"

## Data sources

| Source | Content | Access |
|---|---|---|
| OpenFDA | Drug adverse events, recalls, labeling | `https://api.fda.gov/drug/` |
| RxNorm (NLM) | Drug names, interactions | `https://rxnav.nlm.nih.gov/REST/` |
| PubMed | Clinical literature | `https://eutils.ncbi.nlm.nih.gov/` |
| ClinicalTrials.gov | Active trials | `https://clinicaltrials.gov/api/v2/` |
| AHRQ Effective Health Care | Comparative effectiveness | `https://effectivehealthcare.ahrq.gov/` |
| WHO Essential Medicines | Drug formulary | Available as PDF |
| SNOMED CT | Clinical terminology | `https://browser.ihtsdotools.org/` |

## Workflows

### Drug interaction checking

```python
import requests

def get_drug_interactions(drug1, drug2=None):
    """Check drug interactions via RxNorm API."""
    
    # Step 1: Resolve drug names to RxNorm CUIs
    def get_rxcui(drug_name):
        r = requests.get(
            "https://rxnav.nlm.nih.gov/REST/rxcui.json",
            params={"name": drug_name, "search": 1}
        )
        data = r.json()
        ids = data.get("idGroup", {}).get("rxnormId", [])
        return ids[0] if ids else None
    
    cui1 = get_rxcui(drug1)
    
    if drug2:
        cui2 = get_rxcui(drug2)
        # Check interaction between two specific drugs
        r = requests.get(
            "https://rxnav.nlm.nih.gov/REST/interaction/interaction.json",
            params={"rxcui": cui1}
        )
        interactions = r.json()
    else:
        # Get all known interactions for one drug
        r = requests.get(
            f"https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui={cui1}"
        )
        interactions = r.json()
    
    return interactions

# FDA drug labeling
def get_fda_label(drug_name):
    r = requests.get(
        "https://api.fda.gov/drug/label.json",
        params={"search": f'openfda.brand_name:"{drug_name}"', "limit": 1}
    )
    if r.status_code == 200:
        result = r.json()["results"][0]
        return {
            "warnings": result.get("warnings", []),
            "contraindications": result.get("contraindications", []),
            "drug_interactions": result.get("drug_interactions", []),
            "dosage_and_administration": result.get("dosage_and_administration", []),
        }
```

### Drug adverse event analysis

```python
def get_adverse_events(drug_name, limit=100):
    """Get FDA adverse event reports for a drug."""
    r = requests.get(
        "https://api.fda.gov/drug/event.json",
        params={
            "search": f'patient.drug.medicinalproduct:"{drug_name}"',
            "count": "patient.reaction.reactionmeddrapt.exact",
            "limit": 20,
        }
    )
    if r.status_code == 200:
        results = r.json()["results"]
        print(f"Top adverse events for {drug_name}:")
        for item in results[:15]:
            print(f"  {item['term']}: {item['count']} reports")
        return results
```

### Clinical trial search

```python
def search_clinical_trials(condition=None, intervention=None, status="RECRUITING", limit=20):
    """Search ClinicalTrials.gov for active trials."""
    params = {
        "query.cond": condition,
        "query.intr": intervention,
        "filter.overallStatus": status,
        "pageSize": limit,
        "format": "json",
        "fields": "NCTId,BriefTitle,Phase,EnrollmentCount,StartDate,PrimaryCompletionDate,LocationCity",
    }
    params = {k: v for k, v in params.items() if v}
    
    r = requests.get("https://clinicaltrials.gov/api/v2/studies", params=params)
    
    if r.status_code == 200:
        trials = r.json()["studies"]
        return trials
```

### Literature search for clinical evidence

```python
def search_clinical_evidence(query, study_types=None, n_papers=20):
    """Search PubMed for clinical evidence on a topic."""
    
    # Add study type filters
    type_filters = {
        "rct": "randomized controlled trial[pt]",
        "meta": "meta-analysis[pt]",
        "systematic": "systematic review[pt]",
        "guideline": "practice guideline[pt]",
        "cohort": "cohort studies[mh]",
    }
    
    search_term = query
    if study_types:
        type_str = " OR ".join(type_filters[t] for t in study_types if t in type_filters)
        search_term = f"({query}) AND ({type_str})"
    
    from Bio import Entrez
    import os
    Entrez.email = os.environ.get("NCBI_EMAIL", "user@domain.com")
    
    handle = Entrez.esearch(db="pubmed", term=search_term, 
                            retmax=n_papers, sort="relevance")
    record = Entrez.read(handle)
    
    if record["IdList"]:
        handle = Entrez.efetch(db="pubmed", id=",".join(record["IdList"]),
                               rettype="abstract", retmode="text")
        return handle.read()
```

## Output format

````markdown
# Clinical Decision Support Report

**Query:** [Clinical question]
**Date:** YYYY-MM-DD
**Evidence level:** [A-D grade]

⚠️ **DISCLAIMER:** This is decision SUPPORT only. All clinical decisions must be made by licensed healthcare professionals.

---

## Summary

[2–3 sentence summary of key findings]

## Drug Information

### [Drug Name]

**Mechanism:** [MOA]
**FDA-approved indications:** [list]
**Common dose range:** [dose]

### Contraindications
[List of absolute and relative contraindications]

### Drug Interactions
| Drug | Severity | Mechanism | Clinical effect |
|---|---|---|---|
| [Drug2] | Major | CYP3A4 inhibition | Increased [Drug] exposure |

### Adverse Effects (>5% incidence)
[Ranked by frequency, from FDA label]

## Clinical Evidence

### Guideline Recommendations
[Most recent relevant guideline, with citation]

### Key Trials
| Trial | N | Design | Key finding |
|---|---|---|---|

## Active Clinical Trials

[Relevant recruiting trials from ClinicalTrials.gov]

## References

[Full citations]
````
