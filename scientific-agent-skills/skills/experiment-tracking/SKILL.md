---
name: experiment-tracking
description: "Log, compare, and manage ML/research experiment runs using MLflow or Weights & Biases (W&B). Use when someone needs to track hyperparameters, metrics, and artifacts across multiple training runs; compare experiments; manage model versions; or reproduce a past run. Covers setup, run logging, experiment comparison, artifact management, hyperparameter sweeps, and model registry. Use MLflow for self-hosted/open-source setups; use W&B when cloud collaboration and sweep management are priorities."
allowed-tools: Read Write Edit Bash
compatibility: "Python >=3.10. MLflow: open source, self-hostable. W&B: cloud service, free tier available. Install with uv as shown below."
license: MIT license
metadata: {"version": "1.0", "skill-author": "K-Dense Inc."}
---

# Experiment Tracking

## Overview

Experiment tracking solves the reproducibility problem in iterative research and ML workflows: when you run 50 variants of an analysis, which configuration produced the best result, and can you reproduce it?

Both MLflow and W&B record:
- **Parameters** — hyperparameters, config values, dataset versions
- **Metrics** — loss, accuracy, R², AUC, any scalar tracked over time
- **Artifacts** — model files, plots, data splits, checkpoints
- **Environment** — code version, package versions, hardware

**Choose based on your situation:**

| | MLflow | Weights & Biases |
|---|---|---|
| Hosting | Self-hosted or local | Cloud (W&B servers) |
| Cost | Free, open source | Free tier; paid for teams |
| Best for | Local ML, privacy-sensitive work | Collaborative teams, sweeps |
| Sweep management | Basic (via mlflow projects) | First-class (`wandb sweep`) |
| UI | Local/hosted web UI | Cloud dashboard |
| Framework support | scikit-learn, PyTorch, TF, HF, XGBoost | Same + richer integrations |

---

## Installation

```bash
# MLflow
uv pip install "mlflow>=2.10"

# Weights & Biases
uv pip install "wandb>=0.17"

# Both (common in multi-framework projects)
uv pip install "mlflow>=2.10" "wandb>=0.17"
```

---

## MLflow

### Setup

```bash
# Start local tracking server (opens at http://localhost:5000)
mlflow ui

# Or point to a remote server
export MLFLOW_TRACKING_URI="http://your-server:5000"
```

MLflow stores runs under `./mlruns/` by default when no URI is set — useful for quick local experiments with no server needed.

### Basic run logging

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score

# Optional: set experiment name (creates it if it doesn't exist)
mlflow.set_experiment("protein-classifier")

with mlflow.start_run(run_name="rf-baseline"):
    # Log parameters
    params = {"n_estimators": 100, "max_depth": 5, "random_state": 42}
    mlflow.log_params(params)

    # Train
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    proba = model.predict_proba(X_test)[:, 1]

    # Log metrics
    mlflow.log_metric("accuracy", accuracy_score(y_test, preds))
    mlflow.log_metric("auc", roc_auc_score(y_test, proba))

    # Log artifacts (files)
    mlflow.log_artifact("feature_importance.png")
    mlflow.log_artifact("data/processed/train.csv")

    # Log model (enables serving + registry)
    mlflow.sklearn.log_model(model, "model", registered_model_name="ProteinClassifier")
```

### Logging metrics over time (training curves)

```python
with mlflow.start_run():
    for epoch in range(100):
        train_loss = train_one_epoch(model, optimizer, train_loader)
        val_loss = evaluate(model, val_loader)
        mlflow.log_metric("train_loss", train_loss, step=epoch)
        mlflow.log_metric("val_loss", val_loss, step=epoch)
```

### Tagging runs for filtering

```python
with mlflow.start_run():
    mlflow.set_tags({
        "model_type": "random_forest",
        "dataset": "uniprot-2024",
        "developer": "alice",
        "status": "baseline"
    })
```

### Querying and comparing runs programmatically

```python
import mlflow
import pandas as pd

client = mlflow.tracking.MlflowClient()

# Get all runs in an experiment sorted by AUC
runs = mlflow.search_runs(
    experiment_names=["protein-classifier"],
    order_by=["metrics.auc DESC"]
)

# runs is a DataFrame — inspect best run
best = runs.iloc[0]
print(f"Best run: {best['run_id']}, AUC={best['metrics.auc']:.4f}")
print(best[['params.n_estimators', 'params.max_depth']])
```

### Reproducing a run

```python
# Load a logged model by run ID
run_id = "abc123..."
model = mlflow.sklearn.load_model(f"runs:/{run_id}/model")

# Or load the latest registered model version
model = mlflow.sklearn.load_model("models:/ProteinClassifier/latest")
```

### Model registry lifecycle

```python
client = mlflow.tracking.MlflowClient()

# Transition a model version to Staging or Production
client.transition_model_version_stage(
    name="ProteinClassifier",
    version=3,
    stage="Production"
)

# Add a description
client.update_model_version(
    name="ProteinClassifier",
    version=3,
    description="Best-performing RF on uniprot-2024; AUC=0.923"
)
```

### Auto-logging (framework integrations)

```python
# sklearn — logs params, metrics, model automatically
mlflow.sklearn.autolog()

# PyTorch Lightning
mlflow.pytorch.autolog()

# Hugging Face Transformers — set env var
import os
os.environ["MLFLOW_EXPERIMENT_NAME"] = "bert-finetune"
# MLflow autologs when Trainer.train() is called

# XGBoost
mlflow.xgboost.autolog()
```

---

## Weights & Biases

### Setup

```bash
wandb login   # opens browser for API key; or set WANDB_API_KEY env var
```

### Basic run logging

```python
import wandb

run = wandb.init(
    project="protein-classifier",
    name="rf-baseline",
    config={
        "n_estimators": 100,
        "max_depth": 5,
        "dataset": "uniprot-2024",
    }
)

# Log metrics (use wandb.log for each step/epoch)
wandb.log({"accuracy": 0.91, "auc": 0.923})

# Log artifacts
artifact = wandb.Artifact("model", type="model")
artifact.add_file("model.pkl")
run.log_artifact(artifact)

run.finish()
```

### Training loop metrics

```python
run = wandb.init(project="bert-finetune", config={"lr": 3e-5, "epochs": 10})

for epoch in range(config.epochs):
    train_loss = train(model, optimizer)
    val_metrics = evaluate(model, val_loader)
    wandb.log({
        "epoch": epoch,
        "train/loss": train_loss,
        "val/loss": val_metrics["loss"],
        "val/f1": val_metrics["f1"],
    })

run.finish()
```

### Hyperparameter sweeps

```python
# Define sweep config
sweep_config = {
    "method": "bayes",           # or 'grid', 'random'
    "metric": {"name": "val/auc", "goal": "maximize"},
    "parameters": {
        "lr": {"min": 1e-5, "max": 1e-2, "distribution": "log_uniform_values"},
        "n_estimators": {"values": [50, 100, 200, 500]},
        "max_depth": {"values": [3, 5, 7, 10]},
    }
}

def train_sweep():
    with wandb.init() as run:
        config = run.config
        model = RandomForestClassifier(
            n_estimators=config.n_estimators,
            max_depth=config.max_depth,
            random_state=42
        )
        model.fit(X_train, y_train)
        auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
        wandb.log({"val/auc": auc})

sweep_id = wandb.sweep(sweep_config, project="protein-classifier")
wandb.agent(sweep_id, train_sweep, count=50)  # run 50 trials
```

### Framework integrations

```python
# Hugging Face Transformers
from transformers import TrainingArguments, Trainer
training_args = TrainingArguments(
    output_dir="./results",
    report_to="wandb",
    run_name="bert-protein-v1",
)

# PyTorch Lightning
from pytorch_lightning.loggers import WandbLogger
logger = WandbLogger(project="protein-classifier")
trainer = pl.Trainer(logger=logger)

# scikit-learn (manual logging as above — no autolog)
```

### Downloading artifacts from a past run

```python
api = wandb.Api()
artifact = api.artifact("username/protein-classifier/model:latest")
artifact.download("./downloaded_model/")
```

---

## Best Practices

### Naming and organization

- Use **experiment names** to group related runs (e.g., `"bert-finetune-v2"`)
- Use **tags / config** for run metadata (dataset version, developer, git commit)
- Log the git commit hash:
  ```python
  import subprocess
  git_hash = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
  mlflow.set_tag("git_commit", git_hash)  # or wandb.config.update({"git_commit": git_hash})
  ```

### Reproducibility

- Log the full config dict, not individual params
- Log the random seed
- Log dataset versions or hashes
- Log the requirements file as an artifact:
  ```python
  mlflow.log_artifact("requirements.txt")
  ```

### When to log what

| Item | Log as | When |
|---|---|---|
| Hyperparameters | param / config | At run start |
| Loss/accuracy over time | metric with step | Each epoch/batch |
| Final evaluation | metric (no step) | After training |
| Model file | artifact | After training |
| Plots / figures | artifact | After generation |
| Data splits | artifact | Once, with version tag |

---

## Integration

- **`/exploratory-data-analysis`** — understand and prepare data before tracking experiments
- **`/statistical-analysis`** — for statistical tests on experiment results (e.g., comparing two model configurations)
- **`/matplotlib`** — generate figures that get logged as artifacts
- **`/scientificwriting`** — report experiment results in Methods and Results sections
