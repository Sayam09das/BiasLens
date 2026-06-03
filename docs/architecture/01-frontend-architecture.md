# Frontend Architecture

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Zustand for client state
- TanStack Query for server-state workflows

## Responsibilities

- Present audit, fairness, explainability, reporting, and settings experiences
- Guard authenticated routes and session transitions
- Provide resilient client-side states for loading, empty, error, and partial-data cases
- Emit analytics and observability signals without leaking sensitive payloads

## Design Principles

- Keep route-level composition in `client/app/`
- Keep reusable UI in `client/components/`
- Keep hooks and stores focused on a single operational concern
- Prefer server-safe defaults and explicit client boundaries

## Production Expectations

- Pages should degrade gracefully when APIs partially fail.
- Analytics and error tracking must not block primary user flows.
- Performance budgets should be reviewed for dashboard routes and public landing pages.
