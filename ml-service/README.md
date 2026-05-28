# BiasLens ML Service

This directory is the starting point for the Python-side data and model workflow.

## Current status

- Raw CSV datasets are stored in `data/raw/`.
- `scripts/prepare_datasets.py` validates those files and creates cleaned, smaller outputs in `data/processed/` and `data/samples/`.
- The API and training layers are not built out yet; this step prepares the data foundation for them.

## Dataset prep

Run:

```bash
python3 scripts/prepare_datasets.py
```

This will generate:

- `data/processed/dataset_summary.json`
- `data/processed/resume_screening_clean.csv`
- `data/processed/recruitment_bias_clean.csv`
- `data/processed/job_descriptions_sample.csv`
- `data/processed/resume_ranking_sample.csv`
- `data/samples/modeling_candidates.json`

## Why this is the next step

The raw files are large and inconsistent. Before training a model or exposing an API, we need:

- schema validation
- lightweight cleaning
- smaller working datasets
- a quick summary of what can drive scoring and fairness analysis

## Next steps after this

1. Build feature engineering in `training/`.
2. Train a first baseline screening model.
3. Expose prediction and fairness endpoints from `app/`.

## Manual prediction

After training the baseline model, you can test one sample prediction with:

```bash
python3 ml-service/app/predictor.py
```

## API prediction

You can also expose the trained model as a local API:

```bash
cd ml-service
uvicorn app.main:app --reload
```

Then send a request to `POST /predict` with JSON like:

```json
{
  "skills": "Python, SQL, Tableau, Machine Learning, Data Analysis",
  "experience_years": 3,
  "job_role": "Data Scientist",
  "ai_score": 82
}
```

You can also fetch the saved fairness analysis from:

```bash
GET /fairness
```

For a single UI-friendly payload, use:

```bash
POST /report
```

with the same request body as `/predict`. The response includes:

- prediction label
- prediction probabilities
- latest fairness summary
