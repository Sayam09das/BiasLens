# Horizontal Scaling

## Principles

- Keep frontend and backend instances stateless
- Offload queues, cache, and persistent state to shared infrastructure
- Scale the ML service independently based on CPU, memory, and latency signals

## Primary Levers

- Kubernetes replica counts and HPA
- backend connection pool tuning
- cache hit-rate improvements
- request shaping and async job offloading
