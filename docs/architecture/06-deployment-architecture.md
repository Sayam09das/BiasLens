# Deployment Architecture

## Environments

- `local`: Docker Compose developer stack
- `staging`: shared verification environment
- `production`: hardened environment with controlled rollout and rollback

## Expected Runtime Topology

- Frontend deployed as stateless web tier
- Backend deployed as horizontally scalable API tier
- ML service deployed independently to scale CPU and memory separately
- PostgreSQL, Redis, and object storage managed outside app containers
- Prometheus, Grafana, and tracing stack attached for observability

## Operational Rules

- Production releases should use blue-green or canary patterns where supported.
- Database migrations must be backward-compatible with in-flight application versions.
- Secrets must be injected through environment-specific secret stores, not committed manifests.
