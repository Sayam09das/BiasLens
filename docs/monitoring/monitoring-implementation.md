# Monitoring Implementation

## Signals

- Metrics for latency, throughput, saturation, and error rate
- Logs with request IDs, audit IDs, and severity levels
- Distributed traces across client-edge, backend, and ML-service boundaries
- Audit events for sensitive actions such as sharing and report generation

## Tooling Direction

- Prometheus for metrics
- Grafana for dashboards
- tracing stack for cross-service troubleshooting
- Sentry or equivalent for application exceptions
