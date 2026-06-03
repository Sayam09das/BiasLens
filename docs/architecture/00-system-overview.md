# System Overview

## Purpose

BiasLens is a multi-service platform for auditing AI-assisted hiring workflows. The system is designed to help reviewers inspect fairness, explainability, and operational traceability rather than only produce a prediction.

## Core Services

- `client/`: Next.js product surface for operators, reviewers, and administrators
- `backend/`: API and orchestration layer for auth, audits, reports, notifications, and governance workflows
- `ml-service/`: FastAPI-based inference and analysis service for scoring, fairness metrics, explainability, and counterfactuals
- `infra/`: local and production deployment assets for Compose, Kubernetes, Terraform, monitoring, and scripts

## Architectural Goals

- Separate user experience, orchestration, and ML responsibilities
- Preserve auditability across ingestion, scoring, report generation, and sharing flows
- Keep production deployment paths explicit and automation-friendly
- Make room for future multi-region deployment and stronger compliance controls

## System Context

```text
Users
  |
  v
Next.js Client
  |
  v
Backend API ---------------------> Storage / Cache / Queue
  |                                      |
  |                                      v
  +-------------------------------> Reports / Upload Assets
  |
  v
ML Service
```

## Data Flow

1. A user uploads a resume or opens an audit workflow in the client.
2. The backend validates identity, permissions, and request shape.
3. The backend delegates scoring or fairness analysis to the ML service.
4. Results are persisted, normalized for UI consumption, and attached to reports.
5. Operators review audit history, fairness indicators, and explainability artifacts in the client.

## Production Concerns

- Stateless frontend and backend deployments should scale horizontally.
- Shared state should live in durable systems such as PostgreSQL, Redis, and object storage.
- Observability should include logs, metrics, traces, and audit events.
- Sensitive data handling should treat resumes and reports as regulated artifacts.

## Related Documents

- [01-frontend-architecture.md](01-frontend-architecture.md)
- [02-backend-architecture.md](02-backend-architecture.md)
- [03-ml-service-architecture.md](03-ml-service-architecture.md)
- [06-deployment-architecture.md](06-deployment-architecture.md)
