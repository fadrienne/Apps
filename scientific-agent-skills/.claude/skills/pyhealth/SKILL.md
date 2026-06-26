---
name: pyhealth
description: Healthcare machine learning using PyHealth. Covers clinical prediction models, EHR data processing, patient risk scoring, and health outcome modeling.
argument-hint: "<dataset or task> [--task mortality|readmission|los|drug_rec|diagnosis] [--model CNN|Transformer|LSTM|GRU]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /pyhealth

Build clinical prediction models from EHR data using PyHealth. Supports mortality prediction, readmission risk, length of stay, drug recommendation, and diagnosis prediction.

## Installation

```bash
pip install pyhealth torch
```

## Overview

PyHealth supports three major clinical datasets and custom data:
- **MIMIC-III** — 40K ICU patients, 11 years
- **MIMIC-IV** — 315K patients (extended MIMIC)
- **eICU** — 200K ICU admissions across 335 hospitals

## Core workflow

### Step 1: Load and process clinical data

```python
from pyhealth.datasets import MIMIC3Dataset, MIMIC4Dataset, eICUDataset

# Load MIMIC-III (requires local access to PhysioNet data)
dataset = MIMIC3Dataset(
    root="/path/to/mimic-iii/",
    tables=["DIAGNOSES_ICD", "PROCEDURES_ICD", "PRESCRIPTIONS", "LABEVENTS"],
    code_mapping={"NDC": "ATC3"},   # normalize drug codes
)
print(dataset)
# patients: 46,520
# visits: 58,976
```

### Step 2: Define clinical task

```python
from pyhealth.tasks import (
    mortality_prediction_mimic3_fn,
    readmission_prediction_mimic3_fn,
    length_of_stay_prediction_mimic3_fn,
    drug_recommendation_mimic3_fn,
)

# In-hospital mortality prediction (binary)
dataset.set_task(mortality_prediction_mimic3_fn)
print(f"Samples: {len(dataset)}, Positive rate: {dataset.pos_frac:.3f}")

# 30-day readmission prediction (binary)
dataset.set_task(readmission_prediction_mimic3_fn)

# Length of stay (multi-class: <1d, 1-7d, 7-14d, >14d)
dataset.set_task(length_of_stay_prediction_mimic3_fn)

# Drug recommendation (multi-label)
dataset.set_task(drug_recommendation_mimic3_fn)
```

### Step 3: Split and create DataLoaders

```python
from pyhealth.datasets import split_by_patient, get_dataloader

# 70/15/15 split by patient (no data leakage)
train_dataset, val_dataset, test_dataset = split_by_patient(
    dataset, ratios=[0.7, 0.15, 0.15], seed=42
)

# Create PyTorch DataLoaders
train_loader = get_dataloader(train_dataset, batch_size=32, shuffle=True)
val_loader = get_dataloader(val_dataset, batch_size=32, shuffle=False)
test_loader = get_dataloader(test_dataset, batch_size=32, shuffle=False)
```

### Step 4: Build and train model

```python
from pyhealth.models import Transformer, CNN, RNN, MLP, RETAIN, SafeDrug, GAMENet

# Transformer model (state-of-the-art for EHR)
model = Transformer(
    dataset=dataset,
    feature_keys=["conditions", "procedures", "drugs"],  # use these features
    label_key="label",
    mode="binary",              # binary classification
    embedding_dim=128,
    num_heads=4,
    num_encoder_layers=2,
    dropout=0.1,
)

# Or LSTM-based model
model = RNN(
    dataset=dataset,
    feature_keys=["conditions", "procedures"],
    label_key="label",
    mode="binary",
    embedding_dim=128,
    hidden_dim=256,
    num_layers=2,
    rnn_type="lstm",
)

# Train
from pyhealth.trainer import Trainer

trainer = Trainer(
    model=model,
    metrics=["pr_auc", "roc_auc", "accuracy", "f1"],
)
trainer.train(
    train_dataloader=train_loader,
    val_dataloader=val_loader,
    epochs=50,
    optimizer_params={"lr": 1e-4},
    early_stopping=True,
    patience=10,
    monitor="pr_auc",   # optimize for AUPRC (better for imbalanced)
)
```

### Step 5: Evaluate

```python
# Test set evaluation
metrics = trainer.evaluate(test_loader)
print(f"Test AUROC: {metrics['roc_auc']:.4f}")
print(f"Test AUPRC: {metrics['pr_auc']:.4f}")
print(f"Test F1: {metrics['f1']:.4f}")

# Per-patient predictions
predictions = trainer.inference(test_loader)
# Returns: list of (patient_id, y_true, y_prob)

# Calibration plot
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt

y_true = [p[1] for p in predictions]
y_prob = [p[2] for p in predictions]
fraction_positive, mean_predicted = calibration_curve(y_true, y_prob, n_bins=10)
```

## Specialized models

### RETAIN (interpretable attention model)

```python
from pyhealth.models import RETAIN

model = RETAIN(
    dataset=dataset,
    feature_keys=["conditions", "drugs"],
    label_key="label",
    mode="binary",
    embedding_dim=128,
)
# RETAIN provides visit-level and code-level attention weights
# for clinical interpretability
```

### SafeDrug (drug recommendation with safety constraints)

```python
from pyhealth.models import SafeDrug

model = SafeDrug(
    dataset=dataset,
    feature_keys=["conditions", "procedures", "drugs"],
    label_key="drugs",
    mode="multilabel",
)
# SafeDrug models drug-drug interactions to avoid unsafe recommendations
```

### GAMENet (drug recommendation with graph)

```python
from pyhealth.models import GAMENet

model = GAMENet(
    dataset=dataset,
    feature_keys=["conditions", "procedures", "drugs"],
    label_key="drugs",
    mode="multilabel",
    use_graph=True,          # incorporate DDI graph
    use_memory=True,         # use patient memory module
)
```

## Custom dataset support

```python
from pyhealth.datasets import SampleDataset

# Define your own clinical data
samples = [
    {
        "patient_id": "P001",
        "visit_id": "V001",
        "conditions": ["I10", "E11", "N18"],  # ICD-10 codes
        "procedures": ["3E0U3GZ"],             # ICD-10-PCS
        "drugs": ["warfarin", "metformin"],    # drug names or NDC
        "label": 0,                            # 0 = survived
    },
    # ...
]

dataset = SampleDataset(
    samples=samples,
    code_vocs={"conditions": "ICD10CM", "procedures": "ICD10PCS"},
)
```

## Output metrics

For binary classification:
- AUROC — area under ROC curve (overall discrimination)
- AUPRC — area under precision-recall (better for imbalanced classes)
- F1 score (at 0.5 threshold)
- Calibration (how well probabilities match actual rates)

For multi-label (drug recommendation):
- Jaccard index — overlap between predicted and actual drug sets
- F1 (micro, macro)
- PRAUC per drug class

## Important considerations

1. **Data governance**: MIMIC requires PhysioNet credentialing (physionet.org/settings/credentialing)
2. **Class imbalance**: Mortality rates ~10-15%; use AUPRC over AUROC for primary metric
3. **Temporal leakage**: Always split by patient, not by visit
4. **External validation**: Models degrade across hospital systems; validate on held-out sites
5. **Clinical deployment**: All models require prospective validation and IRB approval before clinical use
