# Deployment Guide

## Environments

- Local: `make dev-up`
- Staging: `make deploy-staging`
- Production: `make deploy-prod`

## Release Expectations

1. Validate lint, typecheck, and automated tests.
2. Confirm environment-specific configuration and secrets.
3. Apply backward-compatible database changes before dependent code paths.
4. Roll out using blue-green or canary process when available.
5. Verify health, logs, traces, and key dashboards after release.

## Rollback

Rollback must be rehearsed, fast, and documented. If a deployment risks incorrect audit outcomes or platform instability, rollback takes priority over continued debugging in production.
