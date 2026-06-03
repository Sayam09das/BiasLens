# Compose Stacks

- `docker-compose.dev.yml`: local developer stack
- `docker-compose.prod.yml`: production-like service composition
- `docker-compose.monitoring.yml`: standalone observability services
- `docker-compose.test.yml`: test execution stack
- `docker-compose.override.yml`: local overrides

Example:

```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d
docker compose -f infra/compose/docker-compose.monitoring.yml up -d
```
