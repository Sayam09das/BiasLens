# Environment Variables

## Guidance

- Keep `.env` files local and uncommitted.
- Use per-environment secret stores for shared deployments.
- Document ownership and rotation requirements for sensitive variables.

## Common Categories

- database connection strings
- Redis and cache endpoints
- auth secrets and token settings
- ML-service base URLs and timeouts
- object storage configuration
- observability DSNs and exporters
