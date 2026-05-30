# BiasLens Backend

Production-oriented Node.js and TypeScript backend for BiasLens. This service handles authentication, audit workflows, report delivery, upload orchestration, integration with the ML service, and backend operational concerns such as middleware, events, queues, and typed contracts.

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- MongoDB Atlas
- Redis-ready cache hooks
- SMTP/Brevo mail delivery

## Structure

- `src/` application code
- `prisma/` schema, migrations, and seeds
- `tests/` unit, integration, contract, e2e, and performance test scaffolding
- `uploads/` temporary upload workspace
- `reports/` generated report artifacts
- `logs/` runtime log output

## Development

```bash
npm install
npm run prisma:generate
npm run dev
```

Server defaults:

- API: `http://localhost:4000`
- Health: `http://localhost:4000/health`
- Versioned API: `http://localhost:4000/v1`

## Environment

Copy the template and fill in real values:

```bash
cp .env.example .env
```

Use `.env.test` for test-specific values.

## Build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
npm run test:unit
npm run test:integration
```

Note:

- some integration tests require local port binding
- in restricted shells they may skip automatically

## Docker

```bash
docker build -t biaslens-backend .
docker run --env-file .env -p 4000:4000 biaslens-backend
```

## Operational Notes

- Prisma uses `MONGODB_URI` as the active datasource URL
- request IDs, structured logs, audit events, and queue scaffolding are already present
- the ML client is retry/circuit-breaker aware and expects the ML service to be reachable at `ML_SERVICE_URL`

## Next Production Steps

- replace queue scaffolding with BullMQ workers
- wire Redis-backed rate limiting and cache storage
- add real Prometheus metrics export
- add PDF/CSV report generation workers
- add CI coverage enforcement for the Jest config if you adopt Jest fully
