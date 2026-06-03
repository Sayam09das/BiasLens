# Backend Architecture

## Role

The backend is the control plane for product workflows. It owns authentication, audit lifecycle orchestration, report generation, sharing, notifications, and coordination with the ML service.

## Layers

- `modules/`: route and domain entry points
- `services/`: reusable business logic and integrations
- `jobs/`: async workflows such as audit, reporting, cleanup, and notifications
- `prisma/`: schema, migrations, and seed flows

## Production Priorities

- Strong validation at request boundaries
- Clear separation between synchronous APIs and background work
- Idempotent job handling where retries are possible
- Structured logging with request and audit identifiers
- Explicit timeout and retry behavior for ML-service calls
