# ML Service Architecture

## Role

The ML service packages model inference, fairness analysis, explainability workflows, and counterfactual generation behind an application boundary that can scale independently from the product API.

## Major Areas

- `app/`: API surface and runtime entry points
- `core/models/`: ATS proxy models and registries
- `core/fairness/`: parity, odds, severity, and consistency analysis
- `core/explainability/`: feature attribution and proxy-signal interpretation
- `core/counterfactual/`: perturbation and validation workflows
- `core/reporting/`: report payload shaping and artifact generation

## Production Priorities

- Deterministic model loading and version visibility
- Bounded inference latency and memory usage
- Reproducible analysis outputs for the same inputs and model version
- Controlled handling of sensitive resume-derived features
