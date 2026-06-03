# Developer FAQ

## Why are there three services?

The frontend, backend, and ML workloads have different runtime concerns, release cadences, and scaling behavior.

## Where should new documentation go?

Put architectural choices in `docs/adr/` or `docs/architecture/`, and operational guidance in `docs/operations/` or `docs/deployment/`.

## What makes this production-oriented?

The repo includes explicit deployment, monitoring, testing, and security guidance in addition to application code.
