.PHONY: help dev-up dev-down deploy-staging deploy-prod health-check logs scale backup restore test load-test

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

# Configuration
ENVIRONMENT ?= staging
REGION ?= us-east-1
REPLICAS ?= 5
CLUSTER_NAME ?= biaslens-$(ENVIRONMENT)

help:
	@echo "$(BLUE)BiasLens Production Operations$(NC)"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make dev-up                    - Start local dev environment (Docker Compose)"
	@echo "  make dev-down                  - Stop local dev environment"
	@echo "  make dev-logs                  - View dev logs (all services)"
	@echo ""
	@echo "$(GREEN)Deployment:$(NC)"
	@echo "  make deploy-staging            - Deploy to staging environment"
	@echo "  make deploy-prod               - Deploy to production (blue-green)"
	@echo "  make deploy-canary             - Deploy ML model as canary (5%)"
	@echo "  make rollback                  - Rollback to previous version"
	@echo ""
	@echo "$(GREEN)Monitoring & Health:$(NC)"
	@echo "  make health-check              - Run comprehensive health checks"
	@echo "  make logs                      - Stream logs (usage: make logs COMPONENT=backend)"
	@echo "  make metrics                   - Show real-time metrics"
	@echo "  make traces                    - Query distributed traces"
	@echo ""
	@echo "$(GREEN)Scaling:$(NC)"
	@echo "  make scale REPLICAS=10         - Scale backend to N replicas"
	@echo "  make scale-auto                - Enable auto-scaling"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  make backup-db                 - Create database backup"
	@echo "  make restore-db                - Restore from backup"
	@echo "  make migrate-db                - Run database migrations"
	@echo "  make db-shell                  - Connect to database"
	@echo ""
	@echo "$(GREEN)Testing:$(NC)"
	@echo "  make test-unit                 - Run unit tests"
	@echo "  make test-e2e                  - Run E2E tests"
	@echo "  make load-test                 - Run load testing"
	@echo ""
	@echo "$(GREEN)Observability:$(NC)"
	@echo "  make open-grafana              - Open Grafana dashboard"
	@echo "  make open-jaeger               - Open Jaeger tracing UI"
	@echo ""

# ============================================================================
# DEVELOPMENT
# ============================================================================

dev-up:
	@echo "$(BLUE)Starting local development environment...$(NC)"
	docker-compose -f infra/compose/docker-compose.dev.yml up -d
	@echo "$(GREEN)✓ Services are running:$(NC)"
	@echo "  Backend:    http://localhost:3001"
	@echo "  Frontend:   http://localhost:3000"
	@echo "  ML Service: http://localhost:8000"
	@echo "  Grafana:    http://localhost:3010 (admin/admin)"
	@echo "  Jaeger:     http://localhost:16686"
	@echo "  Prometheus: http://localhost:9090"

dev-down:
	@echo "$(BLUE)Stopping local development environment...$(NC)"
	docker-compose -f infra/compose/docker-compose.dev.yml down
	@echo "$(GREEN)✓ Stopped$(NC)"

dev-logs:
	docker-compose -f infra/compose/docker-compose.dev.yml logs -f

dev-rebuild:
	@echo "$(BLUE)Rebuilding all containers...$(NC)"
	docker-compose -f infra/compose/docker-compose.dev.yml build --no-cache
	@echo "$(GREEN)✓ Rebuild complete$(NC)"

# ============================================================================
# DEPLOYMENT
# ============================================================================

deploy-staging:
	@echo "$(BLUE)Deploying to staging environment...$(NC)"
	aws eks update-kubeconfig --cluster-name biaslens-staging --region $(REGION)
	helm repo add biaslens s3://biaslens-helm-charts/
	helm repo update
	helm upgrade --install biaslens biaslens/biaslens \
		--namespace staging \
		--values infra/helm/values-staging.yaml \
		--wait --timeout 10m
	@echo "$(GREEN)✓ Staging deployment complete$(NC)"

deploy-prod:
	@echo "$(RED)⚠ Production Deployment$(NC)"
	@echo "This will perform a blue-green deployment to production."
	@read -p "Continue? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		./infra/scripts/deploy-blue-green.sh backend latest $(REGION) prod; \
	fi

deploy-canary:
	@echo "$(BLUE)Deploying ML service as canary (5%)...$(NC)"
	./infra/scripts/deploy-canary.sh ml-service latest

rollback:
	@echo "$(RED)INITIATING ROLLBACK$(NC)"
	./infra/scripts/deploy-blue-green.sh rollback

# ============================================================================
# MONITORING & HEALTH
# ============================================================================

health-check:
	@echo "$(BLUE)Running comprehensive health checks...$(NC)"
	./infra/scripts/health-check.sh $(ENVIRONMENT) --strict

health-check-all-regions:
	@echo "$(BLUE)Running health checks across all regions...$(NC)"
	./infra/scripts/health-check.sh $(ENVIRONMENT) --all-regions --strict

logs:
	@echo "$(BLUE)Streaming logs for $(COMPONENT)...$(NC)"
	kubectl logs -f -n biaslens-$(ENVIRONMENT) \
		-l app=$(COMPONENT) \
		--all-containers=true --timestamps=true

metrics:
	@echo "$(BLUE)Real-time metrics:$(NC)"
	kubectl top pods -n biaslens-$(ENVIRONMENT) --containers --sort-by=memory

traces:
	@echo "$(BLUE)Querying traces in Jaeger...$(NC)"
	@echo "Service: $(SERVICE) | Span: $(SPAN) | Tags: $(TAGS)"
	curl -s "http://localhost:16686/api/traces?service=$(SERVICE)&tags=$(TAGS)" | jq .

# ============================================================================
# SCALING
# ============================================================================

scale:
	@echo "$(BLUE)Scaling backend to $(REPLICAS) replicas...$(NC)"
	kubectl scale deployment biaslens-backend \
		-n biaslens-$(ENVIRONMENT) \
		--replicas=$(REPLICAS)
	kubectl rollout status deployment/biaslens-backend \
		-n biaslens-$(ENVIRONMENT) --timeout=5m
	@echo "$(GREEN)✓ Scaling complete$(NC)"

scale-auto:
	@echo "$(BLUE)Enabling auto-scaling...$(NC)"
	kubectl autoscale deployment biaslens-backend \
		-n biaslens-$(ENVIRONMENT) \
		--min=5 --max=50 --cpu-percent=75 || echo "Auto-scaling already enabled"

# ============================================================================
# DATABASE
# ============================================================================

backup-db:
	@echo "$(BLUE)Creating database backup...$(NC)"
	./infra/scripts/backup-db.sh $(ENVIRONMENT)

restore-db:
	@echo "$(RED)Database Restore$(NC)"
	@read -p "Backup ID: " BACKUP_ID; \
	./infra/scripts/restore-db.sh $(ENVIRONMENT) $$BACKUP_ID

migrate-db:
	@echo "$(BLUE)Running database migrations...$(NC)"
	kubectl exec -it -n biaslens-$(ENVIRONMENT) \
		deployment/biaslens-backend -- \
		npx prisma migrate deploy

db-shell:
	@echo "$(BLUE)Connecting to PostgreSQL...$(NC)"
	@DB_HOST=$$(aws rds describe-db-instances \
		--db-instance-identifier biaslens-$(ENVIRONMENT) \
		--region $(REGION) \
		--query 'DBInstances[0].Endpoint.Address' \
		--output text); \
	psql -h $$DB_HOST -U admin -d biaslens

# ============================================================================
# TESTING
# ============================================================================

test-unit:
	@echo "$(BLUE)Running unit tests...$(NC)"
	npm run test:unit --workspaces

test-e2e:
	@echo "$(BLUE)Running E2E tests...$(NC)"
	npm run test:e2e --workspaces

test-performance:
	@echo "$(BLUE)Running performance tests...$(NC)"
	k6 run infra/scripts/load-test.js --vus 100 --duration 5m

load-test:
	@echo "$(BLUE)Starting load test (100 VUs, 5 minutes)...$(NC)"
	k6 run infra/scripts/load-test.js \
		--vus 100 \
		--duration 5m \
		--ramp-up 1m

# ============================================================================
# OBSERVABILITY
# ============================================================================

open-grafana:
	@echo "$(BLUE)Opening Grafana...$(NC)"
	open http://localhost:3010 || xdg-open http://localhost:3010

open-jaeger:
	@echo "$(BLUE)Opening Jaeger...$(NC)"
	open http://localhost:16686 || xdg-open http://localhost:16686

open-prometheus:
	@echo "$(BLUE)Opening Prometheus...$(NC)"
	open http://localhost:9090 || xdg-open http://localhost:9090

# ============================================================================
# CI/CD
# ============================================================================

lint:
	@echo "$(BLUE)Linting all services...$(NC)"
	npm run lint --workspaces

type-check:
	@echo "$(BLUE)Type checking...$(NC)"
	npm run type-check --workspaces

build:
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker build -t biaslens-backend:latest backend/
	docker build -t biaslens-client:latest client/
	docker build -t biaslens-ml-service:latest ml-service/

push-images:
	@echo "$(BLUE)Pushing images to ECR...$(NC)"
	@AWS_ACCOUNT_ID=$$(aws sts get-caller-identity --query Account --output text); \
	aws ecr get-login-password --region $(REGION) | \
	docker login --username AWS --password-stdin $$AWS_ACCOUNT_ID.dkr.ecr.$(REGION).amazonaws.com; \
	docker tag biaslens-backend:latest $$AWS_ACCOUNT_ID.dkr.ecr.$(REGION).amazonaws.com/biaslens-backend:latest; \
	docker push $$AWS_ACCOUNT_ID.dkr.ecr.$(REGION).amazonaws.com/biaslens-backend:latest

# ============================================================================
# DISASTER RECOVERY
# ============================================================================

dr-test:
	@echo "$(RED)Testing Disaster Recovery procedures...$(NC)"
	./infra/scripts/disaster-recovery-test.sh $(ENVIRONMENT)

dr-failover:
	@echo "$(RED)INITIATING FAILOVER TO DR REGION$(NC)"
	@read -p "Confirm failover? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		./infra/scripts/failover-to-dr.sh $(ENVIRONMENT); \
	fi

# ============================================================================
# MAINTENANCE
# ============================================================================

cleanup-old-images:
	@echo "$(BLUE)Cleaning up old Docker images...$(NC)"
	docker image prune -a --force --filter "until=720h"

cleanup-dangling-volumes:
	@echo "$(BLUE)Cleaning up dangling volumes...$(NC)"
	docker volume prune -f

update-dependencies:
	@echo "$(BLUE)Updating dependencies...$(NC)"
	npm update --workspaces

security-scan:
	@echo "$(BLUE)Running security scans...$(NC)"
	npm audit --workspaces
	docker scan biaslens-backend || true

# ============================================================================
# DEBUGGING
# ============================================================================

debug-backend:
	@echo "$(BLUE)Debugging backend pod...$(NC)"
	@POD=$$(kubectl get pods -n biaslens-$(ENVIRONMENT) -l app=backend -o jsonpath='{.items[0].metadata.name}'); \
	kubectl exec -it -n biaslens-$(ENVIRONMENT) $$POD -- sh

debug-logs-backend:
	@echo "$(BLUE)Backend logs (last 100 lines):$(NC)"
	kubectl logs -n biaslens-$(ENVIRONMENT) -l app=backend --tail=100 --all-containers=true

debug-describe-pod:
	@echo "$(BLUE)Describe backend pod:$(NC)"
	@POD=$$(kubectl get pods -n biaslens-$(ENVIRONMENT) -l app=backend -o jsonpath='{.items[0].metadata.name}'); \
	kubectl describe pod -n biaslens-$(ENVIRONMENT) $$POD
