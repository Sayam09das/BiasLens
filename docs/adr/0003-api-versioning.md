# ADR 0003: URL-Based API Versioning

## Status

Accepted

## Context

BiasLens will expose multiple API consumers over time, including the web client, automation clients, and shared report workflows.

## Decision

Use explicit URL-based versioning for externally consumed APIs and keep internal service evolution behind tested contracts.

## Consequences

- Breaking changes become easier to communicate and deprecate.
- Route ownership stays visible in logs and dashboards.
- Version sprawl must be managed with deprecation policy and documentation.
