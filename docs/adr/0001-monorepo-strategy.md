# ADR 0001: Monorepo Strategy

## Status

Accepted

## Context

BiasLens includes a frontend, backend, ML service, and infrastructure assets that evolve together and share deployment assumptions.

## Decision

Keep the platform in a single repository with service-level isolation by directory.

## Consequences

- Cross-service changes are easier to review and release together.
- Documentation and automation can live close to the code they describe.
- CI must remain selective enough to avoid unnecessary slowdowns.
