---
name: experiment-tracking
description: "Log, compare, and manage ML/research experiment runs using MLflow or Weights & Biases (W&B). Use when tracking hyperparameters, metrics, and model artifacts across runs; comparing experiments; managing model versions; or reproducing a past run. MLflow for self-hosted/open-source setups; W&B for cloud collaboration and sweep management."
argument-hint: "<mlflow|wandb> <action: log|compare|sweep|registry>"
version: "1.0"
author: "K-Dense, Inc. (adapted)"
---

# /experiment-tracking

Track ML experiment runs — parameters, metrics, artifacts — and compare results across configurations.

## When to invoke

- "Track my training run with MLflow"
- "Compare all my experiment runs and find the best AUC"
- "Set up a hyperparameter sweep with W&B"
- "Log my model to the registry"
- "How do I reproduce run abc123?"
- "Add experiment tracking to my training script"

## Tool selection

| Use case | Tool |
|---|---|
| Self-hosted, no cloud, open source | MLflow |
| Team collaboration, richer sweeps | W&B |
| Privacy-sensitive data | MLflow (local) |
| Hugging Face Transformers | Either (both supported via `report_to`) |
| PyTorch Lightning | Either (WandbLogger or MLflowLogger) |
| sklearn | Either |

## Installation

```bash
uv pip install "mlflow>=2.10"    # MLflow
uv pip install "wandb>=0.17"     # W&B
```

## MLflow quick start

```python
import mlflow
mlflow.set_experiment("my-experiment")
with mlflow.start_run():
    mlflow.log_params({"lr": 0.01, "epochs": 50})
    mlflow.log_metric("val_loss", 0.23, step=50)
    mlflow.log_artifact("model.pkl")
# View UI: mlflow ui  →  http://localhost:5000
```

## W&B quick start

```python
import wandb
run = wandb.init(project="my-experiment", config={"lr": 0.01, "epochs": 50})
wandb.log({"val_loss": 0.23})
artifact = wandb.Artifact("model", type="model")
artifact.add_file("model.pkl")
run.log_artifact(artifact)
run.finish()
```

## Compare runs (MLflow)

```python
runs = mlflow.search_runs(experiment_names=["my-experiment"],
                          order_by=["metrics.val_loss ASC"])
print(runs[["run_id", "params.lr", "metrics.val_loss"]].head())
```

## Limitations

- W&B requires network access and a W&B account (free tier available)
- MLflow autolog captures most sklearn/PyTorch params automatically; call `mlflow.<framework>.autolog()` before training
- Sweep agents (`wandb agent`) block the process — run in a background terminal or as separate jobs
