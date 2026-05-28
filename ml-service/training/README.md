# Training Notes

The dataset prep step is complete when `scripts/prepare_datasets.py` has written the processed files.

The next training milestone is:

1. Load `data/processed/resume_screening_clean.csv`.
2. Build a baseline classifier for `Recruiter Decision`.
3. Evaluate fairness against `data/processed/recruitment_bias_clean.csv`.

## Scripts

- `train_baseline_model.py`
  Trains a first-pass logistic regression model and saves model/metric artifacts.

- `evaluate_fairness.py`
  Computes group-level fairness metrics from the recruitment bias dataset and saves a JSON report.

## Run manually

```bash
python3 ml-service/training/train_baseline_model.py
python3 ml-service/training/evaluate_fairness.py
```
