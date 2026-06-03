# BiasLens Production Operational Runbook

**Purpose**: Standardized procedures for common operational scenarios  
**Audience**: DevOps Engineers, On-Call Engineers, Platform Team  
**Last Updated**: 2026-06-03  

---

## Table of Contents

1. [Incident Response](#incident-response)
2. [Deployment Procedures](#deployment-procedures)
3. [Database Operations](#database-operations)
4. [Scaling Operations](#scaling-operations)
5. [Monitoring & Alerting](#monitoring--alerting)
6. [Disaster Recovery](#disaster-recovery)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## Incident Response

### Alert: High Error Rate (> 1%)

**Alert Trigger**: `rate(http_requests_total{status=~"5.."}[5m]) > 0.01`

**Severity**: Critical  
**Response Time**: < 5 minutes  

**Response Procedure**:

```bash
# 1. Gather information
make health-check --all-regions
make logs COMPONENT=backend | tail -100

# 2. Check service status
kubectl get pods -n biaslens-prod -l app=backend
kubectl describe pod -n biaslens-prod <pod-name>

# 3. Check recent deployments
kubectl rollout history deployment/biaslens-backend -n biaslens-prod

# 4. Check application logs in Loki
# Dashboard: Grafana > Explore > Loki > {app="backend", level="error"}

# 5. If caused by recent deployment, rollback
make rollback

# 6. If not deployment-related, investigate:
# - Database connectivity
# - External service errors
# - Resource constraints
```

**Resolution Priority**:
1. Immediate rollback if caused by deployment
2. Scale up if CPU/memory exhausted
3. Failover if specific region impacted
4. Incident post-mortem after resolution

---

### Alert: Pod CrashLoop

**Alert Trigger**: Pod restarting > 5 times in 5 minutes  
**Severity**: Critical

**Response Procedure**:

```bash
# 1. Identify crashing pod
kubectl get pods -n biaslens-prod --field-selector=status.phase=Failed

# 2. Inspect pod logs
kubectl logs -n biaslens-prod <pod-name> --previous
kubectl logs -n biaslens-prod <pod-name> --tail=50

# 3. Check events
kubectl describe pod -n biaslens-prod <pod-name>

# 4. Common causes and fixes:
#    - OOMKilled: Scale deployment, increase memory limits
#    - ImagePullBackOff: Check image availability in registry
#    - CrashLoopBackOff: Check application startup logs

# 5. If issue persists:
# Delete pod to force recreation
kubectl delete pod -n biaslens-prod <pod-name>

# Or scale deployment down then up
kubectl scale deployment biaslens-backend -n biaslens-prod --replicas=0
kubectl scale deployment biaslens-backend -n biaslens-prod --replicas=5
```

---

### Alert: High Database Connection Pool Exhaustion (> 80%)

**Severity**: Warning → Critical

**Response Procedure**:

```bash
# 1. Check connection usage
kubectl exec -n biaslens-prod <backend-pod> -- \
  curl http://localhost:9090/metrics | grep pg_pool_connections

# 2. Identify long-running queries
kubectl exec -n biaslens-prod -c postgres <postgres-pod> -- \
  psql -c "SELECT pid, usename, query, query_start FROM pg_stat_activity WHERE state = 'active';"

# 3. Scale backend up to distribute load
make scale REPLICAS=20

# 4. Kill long-running queries if necessary (cautious!)
# SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query_start < NOW() - INTERVAL '30 minutes';

# 5. Review application code for connection leaks
# Look for missing connection.close() or connection pool misconfiguration
```

---

### Alert: Database Replication Lag > 30 seconds

**Severity**: Warning

**Response Procedure**:

```bash
# 1. Check replication status
aws rds describe-db-instances \
  --db-instance-identifier biaslens-prod \
  --query 'DBInstances[0].StatusInfos' \
  --output table

# 2. Check replica status
aws rds describe-db-instances \
  --filters Name=db-instance-read-replica-of,Values=biaslens-prod \
  --output table

# 3. If lag > 5 minutes, investigate:
# - Network connectivity between primary and replicas
# - Replica instance size/resources
# - Checkpoint/WAL configuration

# 4. Failover if lag unrecoverable
# WARNING: This causes brief downtime
aws rds failover-db-cluster --db-cluster-identifier biaslens-prod
```

---

## Deployment Procedures

### Standard Deployment to Staging

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Commit and push
git push origin feature/my-feature

# 3. Create Pull Request (GitHub Actions auto-tests)

# 4. After approval and tests pass
git merge --squash feature/my-feature
git push origin staging

# GitHub Actions auto-deploys to staging
# Monitor: make health-check

# 5. Verify in staging
make logs COMPONENT=backend
```

### Production Deployment (Blue-Green)

```bash
# 1. Tag release
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# 2. GitHub Actions builds and pushes image

# 3. Deploy (interactive prompt)
make deploy-prod

# 4. Watch deployment
kubectl get pods -n biaslens-prod -w

# 5. Monitor dashboards
make open-grafana
# Watch: Request Rate, Error Rate, Latency, Pod Status

# 6. Verify success
curl https://api.biaslens.app/health
```

### Canary Deployment (ML Service)

```bash
# 1. Build new ML model
cd ml-service
python train.py --output-model model-v2.pkl

# 2. Tag and push
docker tag biaslens-ml-service:v2 <registry>/biaslens-ml-service:v2
docker push <registry>/biaslens-ml-service:v2

# 3. Deploy as canary (5% traffic)
make deploy-canary

# 4. Monitor metrics
# Grafana > ML Service > Error Rate (vs baseline)
# Prometheus: avg(rate(model_inference_duration[5m])) by (version)

# 5. If metrics healthy, promote to stable
kubectl patch virtualservice ml-service-route -n biaslens-prod \
  -p '{"spec":{"hosts":[{"name":"ml-service","http":[{"match":[],"route":[{"destination":{"host":"ml-service-v2","port":{"number":8000}},"weight":100}]}]}]}}'

# Or if issues, rollback
kubectl patch virtualservice ml-service-route -n biaslens-prod \
  -p '{"spec":{"hosts":[{"name":"ml-service","http":[{"match":[],"route":[{"destination":{"host":"ml-service-v1","port":{"number":8000}},"weight":100}]}]}]}}'
```

---

## Database Operations

### Create Backup

```bash
# Automatic backups run hourly
# Manual backup:
make backup-db

# Backup locations:
# - S3: s3://biaslens-backups/biaslens_prod_<timestamp>/
# - RDS Snapshots: via AWS Console
```

### Restore from Backup

```bash
# List available backups
aws s3 ls s3://biaslens-backups/ --recursive

# Restore
make restore-db
# Follow prompts to select backup

# Verify restoration
psql -h <restored-db-endpoint> -U admin -d biaslens -c "SELECT COUNT(*) FROM users;"
```

### Run Migrations

```bash
# Before deployment (automatic via Helm hooks)
make migrate-db

# Manual execution
kubectl exec -n biaslens-prod deployment/biaslens-backend -- \
  npx prisma migrate deploy

# Check migration status
kubectl exec -n biaslens-prod deployment/biaslens-backend -- \
  npx prisma migrate status
```

---

## Scaling Operations

### Manual Scaling

```bash
# Scale backend to 20 replicas
make scale REPLICAS=20

# Verify
kubectl get pods -n biaslens-prod -l app=backend
kubectl top pods -n biaslens-prod -l app=backend
```

### Enable Auto-Scaling

```bash
# Enable HPA (Horizontal Pod Autoscaler)
make scale-auto

# Check HPA status
kubectl get hpa -n biaslens-prod
kubectl describe hpa backend-hpa -n biaslens-prod

# Current scaling metrics
kubectl get hpa -n biaslens-prod -w
```

### Scaling Limits

```yaml
Backend:
  Min Replicas: 5 (required for HA)
  Max Replicas: 50 (cost control)
  Target CPU: 75%
  Target Memory: 85%

ML Service:
  Min Replicas: 2
  Max Replicas: 10
  Target CPU: 60%
```

---

## Monitoring & Alerting

### Dashboards

```bash
# Local development
make open-grafana      # http://localhost:3010
make open-prometheus   # http://localhost:9090
make open-jaeger       # http://localhost:16686

# Production (via bastion/VPN)
# Grafana: https://grafana.prod.internal
# Prometheus: https://prometheus.prod.internal
# Jaeger: https://jaeger.prod.internal
```

### Key Metrics to Monitor

```
Frontend:
  - Page Load Time (P95 < 3s)
  - JS Errors (< 0.1%)
  - API Response Time (P99 < 500ms)

Backend:
  - Request Rate (RPS)
  - Error Rate (< 0.1%)
  - Response Latency (P99 < 500ms)
  - DB Connection Pool (< 80%)
  - Cache Hit Rate (> 80%)

ML Service:
  - Model Inference Time (< 2s)
  - Model Accuracy (baseline - 2%)
  - Prediction Error Rate (< 0.5%)

Infrastructure:
  - Node CPU (< 75%)
  - Node Memory (< 85%)
  - Pod CrashLoop Count (0)
  - Network I/O (healthy)
  - Disk I/O (< 80%)
```

---

## Disaster Recovery

### Test DR Procedures (Monthly)

```bash
# Full region failover test (non-production impact)
make dr-test

# This will:
# 1. Simulate primary region failure
# 2. Promote secondary region to primary
# 3. Route all traffic to secondary
# 4. Run full smoke tests
# 5. Restore to original state
```

### Failover to DR Region (Emergency Only)

```bash
# WARNING: Only execute if primary region is completely unavailable
make dr-failover

# Manual steps if automated failover fails:
aws rds promote-read-replica --db-instance-identifier biaslens-prod-replica-us-west-2
aws route53 change-resource-record-sets --hosted-zone-id <zone-id> \
  --change-batch file://failover-routing.json
```

---

## Troubleshooting Guide

### Service is Slow

```bash
# 1. Check response times
kubectl exec -it -n monitoring prometheus -- \
  promtool query instant 'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))'

# 2. Check database query performance
# Slow Query Log:
make db-shell
SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# 3. Check network latency
kubectl exec -it -n biaslens-prod <pod> -- \
  curl -w "@curl-format.txt" https://api.biaslens.app/health

# 4. Check cache effectiveness
# Grafana > Backend > Cache Hit Rate

# 5. Possible fixes:
#    - Add database index
#    - Optimize query
#    - Increase cache TTL
#    - Scale up service
```

### High Memory Usage

```bash
# 1. Identify heavy pod
kubectl top pods -n biaslens-prod --sort-by=memory

# 2. Check pod memory usage history
kubectl describe pod -n biaslens-prod <pod-name>

# 3. Check for memory leaks
kubectl exec -it -n biaslens-prod <pod-name> -- \
  node --inspect=0.0.0.0:9229 /app/server.js

# 4. Connect debugger and check heap

# 5. Possible fixes:
#    - Increase pod memory limit
#    - Fix memory leak in code
#    - Scale deployment
#    - Reduce cache size
```

### High CPU Usage

```bash
# 1. Identify heavy pod
kubectl top pods -n biaslens-prod --sort-by=cpu

# 2. Profile CPU usage
kubectl exec -it -n biaslens-prod <pod-name> -- \
  node --prof /app/server.js

# 3. Check for hot loops/inefficient code
# Run: node --prof-process isolate-*.log > processed.txt

# 4. Possible fixes:
#    - Optimize hot path code
#    - Reduce computational work
#    - Scale deployment
#    - Use caching for expensive operations
```

---

## Emergency Contacts

- **On-Call Engineer**: PagerDuty (biaslens-prod)
- **Database Team**: #infra-database on Slack
- **Platform Team**: #platform-eng on Slack
- **Incident Commander**: Ops Lead

---

## Related Documentation

- [Architecture Overview](architecture-overview.md)
- [Deployment Guide](deployment-guide.md)
- [Blue-Green Guide](blue-green-guide.md)
- [Disaster Recovery](disaster-recovery.md)
- [Security Hardening](security-hardening.md)
