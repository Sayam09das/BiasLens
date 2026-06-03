# Docker Assets

This directory contains shared Docker image definitions for BiasLens services.

- `Dockerfile.backend`: Express/Node backend image
- `Dockerfile.frontend`: Next.js frontend image
- `Dockerfile.ml-service`: FastAPI/ML service image
- `Dockerfile.nginx`: reverse-proxy edge image
- `buildx.yml`: multi-arch build targets

Recommended usage:

```bash
docker build -f infra/docker/Dockerfile.backend -t biaslens-backend .
docker build -f infra/docker/Dockerfile.frontend -t biaslens-frontend .
docker build -f infra/docker/Dockerfile.ml-service -t biaslens-ml-service .
```
