# BiasLens

BiasLens is a multi-service hiring intelligence platform for resume auditing, explainability, fairness analysis, secure reporting, and decision traceability.

The repository is structured like a production platform rather than a single demo app. It separates product UI, backend orchestration, ML inference, and infrastructure concerns so each layer can evolve independently.

## What BiasLens Solves

Modern hiring pipelines often struggle with three recurring issues:

- decisions are hard to explain
- fairness risks are hard to inspect
- operational auditability is weak

BiasLens is designed to make model-assisted hiring workflows more reviewable, defensible, and easier to operate in real environments.

## Platform Summary

BiasLens is composed of four primary layers:

- `client/`: Next.js frontend for operators, reviewers, and hiring teams
- `backend/`: Node.js API for auth, audits, reports, orchestration, and settings
- `ml-service/`: FastAPI service for scoring, fairness analysis, explainability, and counterfactuals
- `infra/`: local Compose, Kubernetes, monitoring, scripts, and deployment scaffolding

## Core Capabilities

- resume audit workflows with lifecycle visibility
- fairness monitoring and bias-oriented reviewer signals
- explainability views for model reasoning and proxy inspection
- exportable reporting with audit-linked context
- authenticated user flows with verification, reset, and session handling
- production-oriented infrastructure scaffolding for deployment and observability

## Architecture

```text
┌──────────────────────┐
│      Frontend        │
│  Next.js Dashboard   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Backend        │
│ Auth / Audits / API  │
└───────┬───────┬──────┘
        │       │
        │       ▼
        │  ┌──────────────┐
        │  │  ML Service  │
        │  │ Scoring/XAI  │
        │  └──────────────┘
        │
        ▼
┌────────────────────────────┐
│ Data / Cache / File Store  │
│ Postgres / Redis / Assets  │
└────────────────────────────┘
```

## Repository Layout

```text
BiasLens/
├── client/                     # Frontend application
├── backend/                    # API platform and business logic
├── ml-service/                 # ML inference and analysis service
├── infra/                      # Infrastructure, operations, deployment assets
├── Makefile                    # Developer and operational shortcuts
├── INFRASTRUCTURE_IMPLEMENTATION.md
└── README.md
```

## Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- TanStack Query

### Backend

- Node.js
- Express 5
- Prisma
- Redis
- Zod

### ML Service

- FastAPI
- Python 3.11+
- SHAP and LIME oriented explainability workflows
- fairness and counterfactual analysis modules

### Infrastructure

- Docker Compose
- Kubernetes manifests and overlays
- Helm scaffolding
- Terraform starter layout
- Prometheus, Grafana, and Jaeger oriented observability assets

## Local Development

### Prerequisites

- Node.js 22 recommended for the frontend and backend
- npm
- Python 3.11 or newer
- Docker and Docker Compose for the full local stack

### Option 1: Run Services Individually

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### ML Service

```bash
cd ml-service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 2: Run the Local Platform Stack

```bash
make dev-up
```

Useful companion commands:

```bash
make help
make dev-logs
make dev-down
```

## Default Local Endpoints

- frontend: `http://localhost:3000`
- backend: `http://localhost:3001` via `make dev-up`
- backend: `http://localhost:4000` when run directly
- ml service: `http://localhost:8000`
- grafana: `http://localhost:3010`
- jaeger: `http://localhost:16686`
- prometheus: `http://localhost:9090`

## Service Responsibilities

### `client/`

The frontend provides:

- authenticated product surfaces
- audit upload and review flows
- fairness and explainability dashboards
- report viewing and sharing experiences
- account, security, and notification settings

### `backend/`

The backend is responsible for:

- authentication and session lifecycle handling
- audit orchestration and report coordination
- user, workspace, and settings management
- secure API boundaries, rate limiting, and CSRF-aware flows
- bridging product workflows to the ML service

### `ml-service/`

The ML service provides:

- prediction and scoring endpoints
- report generation from structured input or raw resume content
- fairness analysis outputs
- SHAP and LIME explanation payloads
- counterfactual and role-comparison workflows

### `infra/`

The infrastructure layer includes:

- local Compose topology
- deployment scaffolding for staged and production-style environments
- health checks, backup, restore, and rollout scripts
- monitoring and observability configuration

## Security and Production Posture

BiasLens is organized around production-minded concerns, including:

- layered service boundaries
- authenticated access patterns
- secure session handling
- reviewable decision outputs
- operational tooling for health, logs, metrics, and rollback

Not every scaffolded production path is fully active in the current application state, but the repository is intentionally shaped so product, ML, and infrastructure maturity can expand without a structural rewrite.

## Operational Shortcuts

The root [Makefile](/Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/BiasLens/Makefile) includes commands for:

- local environment startup and teardown
- health checks and logs
- scaling and rollout helpers
- database backup and restore
- unit, e2e, and load testing
- observability access

Start with:

```bash
make help
```

## Documentation Map

Use these documents for deeper service-specific detail:

- [client/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/client/README.md:1>)
- [backend/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/backend/README.md:1>)
- [ml-service/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/ml-service/README.md:1>)
- [infra/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/infra/README.md:1>)
- [INFRASTRUCTURE_IMPLEMENTATION.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/INFRASTRUCTURE_IMPLEMENTATION.md:1>)

## Engineering Principles

BiasLens is being built around a few core ideas:

- explainability should be first-class, not bolted on
- fairness visibility should be operational, not theoretical
- product, platform, and ML concerns should stay clearly separated
- local development and production deployment should share a coherent shape
- the repository should feel maintainable under real team ownership

## Current Direction

The platform is moving toward:

- human-in-the-loop hiring review workflows
- explainable and fairness-aware model governance
- stronger reporting and traceability for decision review
- more complete deployment, observability, and operational readiness

BiasLens is not positioned here as a toy demo. It is a serious platform codebase with active application logic, service integrations, and production-oriented scaffolding across the stack.
