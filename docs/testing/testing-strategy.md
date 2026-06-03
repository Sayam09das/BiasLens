# Testing Strategy

## Goals

- Catch regressions close to the layer where they originate
- Verify service contracts across backend and ML boundaries
- Protect critical audit and report workflows with end-to-end coverage

## Test Pyramid

- Unit tests for business logic, utilities, hooks, and ML primitives
- Integration tests for storage, auth, job flows, and inter-service orchestration
- Contract tests for backend and ML-service request-response compatibility
- E2E tests for user-visible critical flows
- Performance tests for audit throughput and report generation

## Quality Gates

- Lint and typecheck for all primary services
- CI test execution on pull requests to protected branches
- Production releases require passing automated checks and rollback readiness
