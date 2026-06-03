# Security Model

## Principles

- Least privilege across users, services, and environments
- Defense in depth for APIs, data stores, and deployment boundaries
- Secure-by-default configuration for auth, secrets, and audit logging
- Minimize exposure of resume and report data

## Control Areas

- Authentication: MFA-ready user flows, token lifecycle control, session timeout handling
- Authorization: role-aware access paths for audits, reports, and shared artifacts
- Data protection: encryption in transit, encryption at rest, scoped storage access
- Platform hardening: network policies, secret injection, and dependency scanning
- Detection: structured logs, anomaly alerts, and incident runbooks

## Sensitive Data

BiasLens handles resume content, scoring outputs, fairness indicators, reports, and account metadata. These artifacts should be treated as confidential by default.
