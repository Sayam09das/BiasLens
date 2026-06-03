# API Documentation

## Scope

BiasLens APIs span three concerns:

- authentication and account security
- audits, reports, and sharing workflows
- ML analysis and supporting contracts

## Standards

- External endpoints should be versioned.
- Request validation must be explicit and fail closed.
- Error responses should be stable enough for UI and automation clients.
- Contract tests should cover backend-to-ML-service expectations.

## Source Of Truth

- Backend routes and schemas in `backend/src/`
- ML service endpoints in `ml-service/app/`
- Contract and integration tests in `backend/tests/` and `ml-service/tests/`

## Planned Additions

- OpenAPI export for the backend API
- machine-readable contracts under `api/contracts/`
- pagination, rate limiting, and error code references
