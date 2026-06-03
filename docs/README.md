# BiasLens Documentation

BiasLens now includes a top-level documentation system intended for product, engineering, platform, ML, and operations teams.

## Start Here

- [architecture/00-system-overview.md](architecture/00-system-overview.md): platform architecture and service boundaries
- [api/README.md](api/README.md): API surface, versioning, and contract ownership
- [operations/runbooks/incident-response-template.md](operations/runbooks/incident-response-template.md): incident workflow baseline
- [security/security-model.md](security/security-model.md): security principles and control areas
- [testing/testing-strategy.md](testing/testing-strategy.md): test pyramid and quality gates
- [deployment/deployment-guide.md](deployment/deployment-guide.md): deployment workflow across environments
- [onboarding/developer-guide.md](onboarding/developer-guide.md): developer onboarding path

## Documentation Domains

```text
docs/
├── architecture/    System design, component boundaries, deployment topology
├── adr/             Architecture decision records
├── api/             API standards, contracts, and lifecycle guidance
├── operations/      Runbooks, SLOs, incident response, operational checklists
├── performance/     Performance goals and optimization guidance
├── security/        Threat model, controls, retention, and auditability
├── research/        Product and research framing for the fairness domain
├── testing/         Test strategy, coverage expectations, and QA practices
├── deployment/      Delivery patterns, rollout plans, and rollback procedures
├── scaling/         Horizontal and vertical scaling decisions
├── monitoring/      Metrics, logs, traces, and dashboard conventions
├── multi-region/    Disaster recovery and failover guidance
├── onboarding/      Developer onboarding and team conventions
├── setup/           Environment setup and configuration references
├── releases/        Versioning and release management
├── faq/             Common engineering and product questions
└── glossary.md      Shared terminology
```

## Current Status

This documentation layer is intentionally seeded with the highest-value production content first. It is designed to be expanded as the system matures, while keeping section names stable so links and team habits do not churn.

## Authoring Guidelines

- Prefer short, decision-oriented documents over long narrative dumps.
- Keep platform facts aligned with the code in `client/`, `backend/`, `ml-service/`, and `infra/`.
- When a major architectural choice changes, add or update an ADR.
- When a runbook changes operational behavior, update the deployment or incident references in the same change.
