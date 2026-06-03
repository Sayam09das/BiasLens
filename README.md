# BiasLens

BiasLens is a production-oriented hiring intelligence platform for resume auditing, model explainability, fairness analysis, secure report generation, and decision traceability.

It is designed as a multi-service system rather than a single app:

- a modern frontend for operators, reviewers, and hiring teams
- an API platform for auth, audits, reports, settings, and orchestration
- an ML service for inference, scoring, and explanation workflows
- an infrastructure layer for deployment, observability, security, and operations

## Why BiasLens

Hiring systems are increasingly automated, but most pipelines still fail on the same three problems:

- opaque model decisions
- weak fairness visibility
- poor operational traceability

BiasLens addresses those gaps by combining:

- resume audit workflows
- explainability monitoring
- fairness dashboards
- exportable decision reports
- authenticated, auditable user and session management

The goal is not just to score resumes, but to make those decisions reviewable, defensible, and production-safe.

## Platform Overview

### Frontend

`client/`

- Next.js application
- authenticated dashboard
- audit upload and history flows
- fairness and explainability views
- reports and settings surfaces
- production-oriented auth UX including verification and password recovery

### Backend

`backend/`

- Node.js API platform
- auth, session, and user management
- audit lifecycle and report services
- fairness and explainability aggregation
- secure cookies, refresh flows, rate limiting, and CSRF protection

### ML Service

`ml-service/`

- Python inference service
- scoring and explanation workflows
- ML-facing endpoints used by the backend
- a foundation for model experiments, monitoring, and rollout

### Infrastructure

`infra/`

- Docker image definitions
- local and production-style Compose stacks
- Nginx edge scaffolding
- Kubernetes base, overlays, and Helm starters
- Terraform starter layout
- monitoring, alerting, and operations scripts

## Architecture

```text
                ┌──────────────────────┐
                │      Frontend        │
                │   Next.js Dashboard  │
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
              │ Postgres / Redis / Storage │
              └────────────────────────────┘
```

## Core Capabilities

- Resume auditing with structured lifecycle tracking
- Explainability surfaces for model reasoning and signal inspection
- Fairness monitoring for risk visibility and reviewer guidance
- Exportable reports with audit-linked traceability
- User settings, notifications, and account controls
- Production-style auth with:
  - email verification
  - resend verification
  - forgot password
  - reset password
  - refresh-token session recovery
  - middleware-based route protection

## Repository Layout

```text
BiasLens/
├── client/       # Frontend application
├── backend/      # API and business logic
├── ml-service/   # ML inference and explanation service
├── infra/        # Infrastructure, ops, and deployment scaffolding
├── Makefile      # Operational shortcuts
└── README.md     # Main project entrypoint
```

## Quick Start

### 1. Frontend

```bash
cd client
npm install
npm run dev
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Infrastructure Helpers

```bash
make help
make dev-up
```

## Local Endpoints

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- ML Service: `http://localhost:8000`

## Engineering Principles

BiasLens is being shaped around the same qualities expected from high-trust product teams:

- clear boundaries between product, platform, and ML concerns
- explicit auth and security controls
- observable systems over black-box behavior
- explainable outputs instead of score-only workflows
- infrastructure that can evolve from local development to staged deployment

This repository is meant to feel like a serious platform codebase, not a demo folder.

## Production Posture

The repository currently contains a mix of:

- implemented product features
- working service integrations
- production-oriented scaffolding for infra and observability

Some areas are already active in the app today, while others are intentionally scaffolded for staged rollout. The project is structured so it can mature cleanly without needing a full repo rewrite later.

## Documentation Map

For deeper details, start with:

- [client/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/client/README.md:1>)
- [backend/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/backend/README.md:1>)
- [ml-service/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/ml-service/README.md:1>)
- [infra/README.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/infra/README.md:1>)
- [INFRASTRUCTURE_IMPLEMENTATION.md](</Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/INFRASTRUCTURE_IMPLEMENTATION.md:1>)

## Current Direction

BiasLens is evolving toward a platform that can support:

- human-in-the-loop hiring workflows
- explainable ML governance
- fairness-aware decision review
- enterprise-style deployment and observability

The repo now reflects that direction at the application, service, and infrastructure levels.
