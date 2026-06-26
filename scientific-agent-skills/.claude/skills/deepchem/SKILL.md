---
name: deepchem
description: Deep learning for drug discovery and molecular property prediction using DeepChem. Covers molecular property prediction, virtual screening, QSAR modeling, and generative chemistry.
argument-hint: "<task: predict|screen|train|generate> <molecules or dataset>"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /deepchem

Apply deep learning to drug discovery problems: molecular property prediction, QSAR modeling, virtual screening, and molecular generation.

## Installation

```bash
pip install deepchem[torch]
# Or with TensorFlow:
pip install deepchem[tensorflow]
```

## Core concepts

### Featurizers — convert molecules to ML features

```python
import deepchem as dc

# Morgan circular fingerprints (ECFP-like)
featurizer = dc.feat.CircularFingerprint(size=2048, radius=2)

# Graph convolutional features (for GNN models)
featurizer = dc.feat.MolGraphConvFeaturizer(use_edges=True, use_chirality=True)

# RDKit descriptors (200 physicochemical features)
featurizer = dc.feat.RDKitDescriptors()

# SMILES transformer (for language model-based models)
featurizer = dc.feat.SmilesToSeq(max_len=250)

# Atomic charge features
featurizer = dc.feat.CoulombMatrix(max_atoms=23)
```

### Datasets — wrap data for DeepChem models

```python
# From SMILES + labels
smiles = ["CC(=O)Oc1ccccc1C(=O)O", "c1ccccc1", "CCO"]
labels = [1, 0, 0]  # e.g., active/inactive

X = featurizer.featurize(smiles)
dataset = dc.data.NumpyDataset(X=X, y=np.array(labels), ids=smiles)

# From MoleculeNet benchmark datasets
tasks, datasets, transformers = dc.molnet.load_tox21()
train, valid, test = datasets

# Available MoleculeNet datasets:
# - load_bbbp()          Blood-brain barrier penetration
# - load_tox21()         12 toxicity endpoints
# - load_clintox()       Clinical trial toxicity
# - load_hiv()           HIV inhibition
# - load_sider()         Drug side effects
# - load_esol()          Aqueous solubility (regression)
# - load_lipophilicity() logD at pH 7.4 (regression)
# - load_pdbbind()       Protein-ligand binding (regression)
# - load_muv()           17 biological activities
```

### Models — train and predict

```python
# Graph Convolutional Network (best for activity prediction)
model = dc.models.AttentiveFPModel(
    n_tasks=1,
    mode="classification",
    learning_rate=0.001,
    batch_size=32,
)
model.fit(train, nb_epoch=30)

# Evaluate
metric = dc.metrics.Metric(dc.metrics.roc_auc_score)
print(f"Train ROC-AUC: {model.evaluate(train, [metric])}")
print(f"Test ROC-AUC: {model.evaluate(test, [metric])}")

# Predict on new molecules
test_smiles = ["CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=CC=C3)C(F)(F)F"]
pred_feats = featurizer.featurize(test_smiles)
pred_dataset = dc.data.NumpyDataset(X=pred_feats, ids=test_smiles)
predictions = model.predict(pred_dataset)
```

## Common workflows

### Workflow 1: QSAR model for bioactivity

```python
import deepchem as dc
import numpy as np

# Load ChEMBL activity data (or your own)
tasks, datasets, transformers = dc.molnet.load_bbbp()
train, valid, test = datasets

# Train a graph neural network
model = dc.models.AttentiveFPModel(
    n_tasks=1,
    mode="classification",
    num_layers=3,
    num_timesteps=2,
    learning_rate=0.0003,
    dropout=0.2,
    batch_size=64,
)

for epoch in range(1, 51):
    loss = model.fit(train, nb_epoch=1, restore=False)
    if epoch % 10 == 0:
        roc = model.evaluate(valid, [dc.metrics.Metric(dc.metrics.roc_auc_score)])
        print(f"Epoch {epoch}: loss={loss:.4f}, valid ROC-AUC={roc:.4f}")

# Final evaluation
metrics = [
    dc.metrics.Metric(dc.metrics.roc_auc_score),
    dc.metrics.Metric(dc.metrics.accuracy_score),
    dc.metrics.Metric(dc.metrics.average_precision_score),
]
results = model.evaluate(test, metrics)
print(f"\nTest results: {results}")
```

### Workflow 2: Molecular property regression

```python
# Predict aqueous solubility (ESOL dataset)
tasks, datasets, transformers = dc.molnet.load_esol()
train, valid, test = datasets

# Graph Convolution for regression
model = dc.models.GraphConvModel(
    n_tasks=1,
    mode="regression",
    learning_rate=0.001,
    batch_size=32,
)
model.fit(train, nb_epoch=100)

# Evaluate with RMSE
metric = dc.metrics.Metric(dc.metrics.rms_score, np.mean)
print(f"Test RMSE: {model.evaluate(test, [metric])}")

# Predict logS for new compounds
new_smiles = ["c1ccc2ccccc2c1", "CCO", "CC(=O)O"]
featurizer = dc.feat.MolGraphConvFeaturizer()
X = featurizer.featurize(new_smiles)
pred_ds = dc.data.NumpyDataset(X=X, ids=new_smiles)
predicted_logS = model.predict(pred_ds)

for smi, logS in zip(new_smiles, predicted_logS):
    print(f"{smi}: predicted logS = {logS[0]:.3f}")
```

### Workflow 3: Virtual screening

```python
def virtual_screen(library_smiles, model, featurizer, threshold=0.7):
    """Screen a library of compounds and return predicted actives."""
    # Featurize all compounds
    X = featurizer.featurize(library_smiles)
    valid_mask = [x is not None and x.shape[0] > 0 for x in X]
    
    valid_smiles = [s for s, v in zip(library_smiles, valid_mask) if v]
    valid_X = np.array([x for x, v in zip(X, valid_mask) if v])
    
    # Predict activity probability
    dataset = dc.data.NumpyDataset(X=valid_X, ids=valid_smiles)
    predictions = model.predict(dataset)
    
    # Filter by threshold
    actives = [
        {"smiles": smi, "score": float(pred[1])}
        for smi, pred in zip(valid_smiles, predictions)
        if pred[1] >= threshold
    ]
    return sorted(actives, key=lambda x: x["score"], reverse=True)

# Load and screen
with open("compound_library.txt") as f:
    library = [line.strip() for line in f]

hits = virtual_screen(library, model, featurizer)
print(f"Found {len(hits)} hits out of {len(library)} compounds")
```

### Workflow 4: Multi-task toxicity prediction

```python
# Tox21: predict 12 toxicity endpoints simultaneously
tasks, datasets, transformers = dc.molnet.load_tox21(featurizer="GraphConv")
train, valid, test = datasets

model = dc.models.AttentiveFPModel(
    n_tasks=len(tasks),
    mode="classification",
    learning_rate=0.0001,
    batch_size=64,
)
model.fit(train, nb_epoch=50)

# Evaluate per task
for i, task in enumerate(tasks):
    metric = dc.metrics.Metric(dc.metrics.roc_auc_score, np.mean, mode="classification")
    # Subset to task i...
    print(f"Task {task}: ROC-AUC = {roc:.4f}")

# Predict for a compound
smiles = "CC(N)Cc1ccc(O)cc1"  # tyrosine
X = dc.feat.MolGraphConvFeaturizer().featurize([smiles])
ds = dc.data.NumpyDataset(X=X, ids=[smiles])
probs = model.predict(ds)[0]  # [n_tasks] array of probabilities

for task, p in zip(tasks, probs):
    print(f"{task}: p(toxic) = {p:.3f}")
```

## Available model architectures

| Model | Best for | Notes |
|---|---|---|
| `GraphConvModel` | Binary classification | Fast, good baseline |
| `AttentiveFPModel` | Property prediction | State-of-the-art for many benchmarks |
| `MPNNModel` | Molecular energy | Good for QM properties |
| `ChemCeption` | Image-based learning | Treats molecule as 2D image |
| `TextCNNModel` | SMILES-based | No featurization needed |
| `DTNN` | QM9 properties | Good for quantum chemistry |
| `GATModel` | Graph attention | Good interpretability |
| `MultitaskClassifier` | Many tasks | Classic ML on fingerprints |
| `MultitaskRegressor` | Regression | Classic ML baseline |

## Transfer learning

```python
# Load pre-trained model from DeepChem model hub
pretrained = dc.models.ChemBERTaModel.load_from_pretrained("ChemBERTa-77M-MLM")

# Fine-tune on your data
pretrained.fit(your_train_dataset, nb_epoch=10)
```
