# BiasLens Infrastructure Architecture

BiasLens is structured around three primary services:

- `client`: Next.js frontend
- `backend`: Node.js API
- `ml-service`: FastAPI/ML workload

Production rollout is expected to use Kubernetes, managed PostgreSQL, Redis, and a shared observability stack.
