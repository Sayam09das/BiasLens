# Training Notes

The dataset prep step is complete when `scripts/prepare_datasets.py` has written the processed files.

The next training milestone is:

1. Load `data/processed/resume_screening_clean.csv`.
2. Build a baseline classifier for `Recruiter Decision`.
3. Evaluate fairness against `data/processed/recruitment_bias_clean.csv`.

## Scripts

- `train_baseline_model.py`
  Trains a first-pass logistic regression model and saves model/metric artifacts.

- `train_ats_model.py`
  Alias entry point for the current ATS-style baseline model.

- `evaluate_fairness.py`
  Computes group-level fairness metrics from the recruitment bias dataset and saves a JSON report.

- `evaluate_model.py`
  Merges saved predictive and fairness outputs into one evaluation artifact.

- `cross_validate.py`
  Runs 5-fold cross-validation for the current baseline pipeline.

- `export_artifacts.py`
  Writes a simple manifest of saved artifact files.

- `run_ablation.py`
  Saves a scaffold for ablation experiments on the baseline pipeline.

- `hyperparameter_tuning.py`
  Saves the current hyperparameter tuning plan/search space.

- `train_fairness_models.py`
  Saves a scaffold plan for fairness-aware model training.

## Run manually

```bash
python3 ml-service/training/train_baseline_model.py
python3 ml-service/training/evaluate_fairness.py
```
