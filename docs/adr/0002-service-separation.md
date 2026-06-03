# ADR 0002: Separate ML Service

## Status

Accepted

## Context

Inference, fairness analysis, and explainability workloads have different runtime and scaling characteristics than the product API.

## Decision

Run the ML capabilities in a separate Python service rather than embedding them inside the backend.

## Consequences

- Backend deployments remain lighter and operationally simpler.
- Model and Python dependency lifecycles can evolve independently.
- Network boundaries require explicit retries, timeouts, and contract tests.
