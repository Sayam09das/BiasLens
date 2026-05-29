# BiasLens ML Service

Production-oriented FastAPI service for resume parsing, role-fit prediction, fairness analysis, explainability, and counterfactual generation.

This service is structured in the style of modern ML platform teams at companies like Google, Amazon, Microsoft, and Anthropic: clear separation between API, core modeling logic, training workflows, artifacts, tests, and observability scaffolding.

## Overview

`ml-service` is the decision and analysis engine behind BiasLens. It supports:

- structured prediction from engineered resume features
- raw resume text analysis
- uploaded resume file analysis for `.txt`, `.docx`, and `.pdf`
- role comparison across multiple target job families
- fairness metric reporting
- SHAP and LIME explainability
- counterfactual candidate generation
- model version control through artifact metadata

## Service Responsibilities

- Parse raw resume text and uploaded files into normalized feature sets
- Score candidates against role-aware skill profiles
- Surface fairness metrics from the reference dataset
- Provide interpretable outputs for product and audit workflows
- Expose stable API contracts for frontend and downstream backend layers

## Repository Layout

```text
ml-service/
├── app/            # FastAPI runtime, dependency wiring, schemas, route layer
├── core/           # Parsing, extraction, modeling, fairness, explainability logic
├── data/           # Raw, processed, synthetic, and sample datasets
├── artifacts/      # Saved models, explainers, metrics, version metadata
├── training/       # Model training, evaluation, and artifact export scripts
├── tests/          # Unit, integration, performance, contract, and smoke tests
├── scripts/        # Utility and operational scripts
├── monitoring/     # Monitoring and observability scaffolding
└── notebooks/      # Research and experimentation notebooks
```

## Runtime Architecture

### API Layer

The FastAPI application lives in [app/](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/app) and is split into:

- `main.py`: ASGI entry point
- `config.py`: environment-backed settings
- `dependencies.py`: model/cache/runtime dependency providers
- `lifespan.py`: startup and shutdown orchestration
- `api/routes/`: endpoint handlers
- `api/schemas/`: request and response contracts

### Core Layer

The reusable ML and analysis logic lives in [core/](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/core):

- `preprocessing/`: cleaning, parsing, normalization, feature construction
- `extraction/`: skills, experience, education, proxy detection
- `models/`: artifact loading, registry, wrappers, ensemble hooks
- `fairness/`: demographic parity, equalized odds, bias scoring
- `explainability/`: SHAP, LIME, feature importance, proxy attribution
- `counterfactual/`: perturbation and candidate generation logic
- `reporting/`: report payload construction and frontend-facing summaries
- `cache/`: compatibility wrapper over the active cache implementation

## Supported Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Root service metadata |
| `GET` | `/health` | Liveness/readiness check |
| `GET` | `/metrics` | Runtime and saved metrics summary |
| `GET` | `/fairness` | Fairness report snapshot |
| `POST` | `/predict` | Predict from engineered resume features |
| `POST` | `/report` | Combined prediction and fairness report |
| `POST` | `/report-from-text` | Build report directly from resume text |
| `POST` | `/upload-resume` | Build report from uploaded resume file |
| `POST` | `/compare-roles` | Compare one resume text across roles |
| `POST` | `/compare-upload-resume` | Compare one uploaded resume across roles |
| `POST` | `/explain` | Generate SHAP/LIME explanation payload |
| `POST` | `/counterfactual` | Generate counterfactuals from resume text |
| `POST` | `/counterfactual/upload` | Generate counterfactuals from uploaded resume |

### Core

- `GET /`
- `GET /health`
- `GET /metrics`

### Prediction and Reporting

- `POST /predict`
- `POST /report`
- `POST /report-from-text`
- `POST /upload-resume`

### Role Comparison

- `POST /compare-roles`
- `POST /compare-upload-resume`

### Explainability and What-If Analysis

- `POST /explain`
- `POST /counterfactual`
- `POST /counterfactual/upload`

### Fairness

- `GET /fairness`

## Quick Start

### 1. Install Dependencies

```bash
cd ml-service
python -m pip install -r requirements.txt
```

### 2. Start the Service

```bash
cd ml-service
python -m uvicorn app.main:app --reload
```

### 3. Open API Docs

```text
http://127.0.0.1:8000/docs
```

## Common Workflows

### Predict from Engineered Features

```json
{
  "skills": "Python, SQL, Tableau, Machine Learning, Data Analysis",
  "experience_years": 3,
  "job_role": "Data Scientist",
  "ai_score": 58
}
```

Send to:

```text
POST /predict
```

### Predict from Resume Text

```json
{
  "resume_text": "Data Scientist with 3 years of experience in Python, SQL, Tableau, machine learning, and data analysis.",
  "job_role": "Data Scientist"
}
```

Send to:

```text
POST /report-from-text
```

### Compare Roles from Text

```json
{
  "resume_text": "Candidate with experience in Python, SQL, React, machine learning, and dashboarding.",
  "job_roles": ["Data Scientist", "Machine Learning Engineer", "Full Stack Developer"]
}
```

Send to:

```text
POST /compare-roles
```

### Upload a Resume

Use multipart form data:

- `file`
- `job_role`

Send to:

```text
POST /upload-resume
```

Supported file types:

- `.txt`
- `.docx`
- `.pdf`

### Compare Roles from an Uploaded Resume

Use multipart form data:

- `file`
- `job_roles`

Where `job_roles` is a comma-separated string:

```text
Data Scientist, Machine Learning Engineer, Full Stack Developer
```

Send to:

```text
POST /compare-upload-resume
```

## Model and Artifact Management

Artifacts live under [artifacts/](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/artifacts):

- `models/`
- `explainers/`
- `encoders/`
- `metrics/`
- `versions.json`

Runtime model selection is controlled by:

- [artifacts/versions.json](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/artifacts/versions.json:1)

This allows the active model and explainer artifacts to be switched without rewriting API code.

## Training and Evaluation

### Baseline / Core Model Training

```bash
python training/train_baseline_model.py
python training/train_random_forest_model.py
```

### Evaluation

```bash
python training/evaluate_model.py
python training/evaluate_fairness.py
python training/cross_validate.py
```

### Explainer Export

```bash
python training/export_shap_explainer.py
python training/export_lime_explainer.py
```

### Artifact Export

```bash
python training/export_artifacts.py
```

## Testing

### Full Test Suite

```bash
cd ml-service
python -m pytest tests
```

### Fast Safety Check

```bash
python3 -m compileall ml-service
```

### Current Coverage Layers

- `tests/unit/`
- `tests/integration/`
- `tests/performance/`
- `tests/contract/`
- `tests/test_api_smoke.py`

## Data Pipeline

Raw datasets are kept in [data/raw/](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/data/raw).

To regenerate cleaned datasets:

```bash
python scripts/prepare_datasets.py
```

This produces processed artifacts in:

- `data/processed/`
- `data/samples/`

## Explainability

The service supports:

- real SHAP for the active tree-based model
- real LIME local explanations
- proxy attribution summaries

Single-analysis UI flows can surface:

- feature-level SHAP contributions
- local LIME explanations
- proxy-sensitive signal summaries
- counterfactual suggestion candidates

## Fairness

The fairness layer currently exposes:

- group selection rates
- demographic parity differences
- disparate impact ratios
- grouped score averages

The core scaffolding also includes:

- equalized odds helpers
- bias severity scoring
- counterfactual consistency support

## Monitoring and Operations

The [monitoring/](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/monitoring) package contains starter support for:

- service metrics
- tracing configuration
- structured logging
- health probe helpers

These are intentionally lightweight today, but the folder is already in the right place for production hardening.

## Environment Configuration

Reference environment files:

- [.env.example](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/.env.example:1)
- [.env.test](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/.env.test:1)

Current supported settings include:

- API title and version
- cache backend
- cache TTL
- Redis URL placeholder

## Development Commands

The [Makefile](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/ml-service/Makefile:1) includes:

- `make run`
- `make test`
- `make lint`
- `make train`

## Current State

This service is beyond the early prototype stage. It now has:

- a working FastAPI runtime
- stable report, fairness, explainability, and counterfactual flows
- real PDF resume upload support
- active random forest model selection through version metadata
- real SHAP and LIME integration
- a green automated test suite

## Known Limitations

- some role profiles are heuristic rather than learned from large labeled datasets
- performance tests are lightweight guardrails, not full load benchmarks
- monitoring integrations are scaffolded rather than fully wired to Prometheus/OpenTelemetry
- Poetry is not the active dependency manager, so `poetry.lock` is intentionally not present

## Recommended Next Steps

Inside `ml-service`, the highest-value future improvements would be:

1. add stronger learned role profiles and more training data
2. train and validate additional real model artifacts such as XGBoost
3. harden monitoring and metrics export
4. expand performance and regression testing
5. add deployment-ready CI/CD and container runtime checks
