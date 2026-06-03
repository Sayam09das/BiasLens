#!/bin/bash
################################################################################
# Production-Grade Health Check Script
# Validates all services across environments with comprehensive diagnostics
# Usage: ./scripts/health-check.sh [environment] [--all-regions] [--strict]
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
ALL_REGIONS=${2:-}
STRICT_MODE=${3:-}
REGIONS=("us-east-1" "eu-west-1" "ap-southeast-1" "ca-central-1")
TIMEOUT=30

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1"
  ((PASSED++))
}

log_error() {
  echo -e "${RED}[✗]${NC} $1"
  ((FAILED++))
}

log_warning() {
  echo -e "${YELLOW}[⚠]${NC} $1"
  ((WARNINGS++))
}

# Check HTTP endpoint
check_endpoint() {
  local url=$1
  local expected_code=${2:-200}
  local name=${3:-Endpoint}
  
  log_info "Checking $name: $url"
  
  if response=$(curl -s -w "\n%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null); then
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" == "$expected_code" ]; then
      log_success "$name returned HTTP $http_code"
      return 0
    else
      log_error "$name returned HTTP $http_code (expected $expected_code)"
      return 1
    fi
  else
    log_error "$name: Connection timeout or error"
    return 1
  fi
}

# Check Kubernetes pod health
check_k8s_pods() {
  local namespace=$1
  local region=${2:-us-east-1}
  
  log_info "Checking K8s pods in $region/$namespace"
  
  # Update kubeconfig
  aws eks update-kubeconfig --cluster-name biaslens-${ENVIRONMENT} --region $region 2>/dev/null || {
    log_warning "Could not access EKS cluster in $region"
    return 1
  }
  
  # Check pod status
  local not_ready=$(kubectl get pods -n $namespace --field-selector=status.phase!=Running,status.phase!=Succeeded -q 2>/dev/null | wc -l)
  
  if [ "$not_ready" -eq 0 ]; then
    log_success "All pods are healthy in $namespace"
    return 0
  else
    log_error "$not_ready pods not running in $namespace"
    kubectl get pods -n $namespace -o wide
    return 1
  fi
}

# Check database connectivity
check_database() {
  local region=${1:-us-east-1}
  
  log_info "Checking PostgreSQL database in $region"
  
  # Get RDS endpoint from Terraform state or AWS CLI
  local db_host=$(aws rds describe-db-instances \
    --db-instance-identifier biaslens-${ENVIRONMENT} \
    --region $region \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text 2>/dev/null)
  
  if [ -z "$db_host" ] || [ "$db_host" == "None" ]; then
    log_warning "Could not find database endpoint"
    return 1
  fi
  
  # Check connectivity
  if timeout 5 bash -c "echo > /dev/tcp/$db_host/5432" 2>/dev/null; then
    log_success "PostgreSQL database reachable at $db_host"
    
    # Check replication lag if replica
    if [ "$ENVIRONMENT" == "prod" ]; then
      local lag=$(psql -h $db_host -U admin -d biaslens -c \
        "SELECT EXTRACT(EPOCH FROM (NOW() - pg_last_wal_receive_lsn())) as lag" \
        -t -A 2>/dev/null || echo "N/A")
      
      if [ "$lag" != "N/A" ]; then
        if (( $(echo "$lag < 30" | bc -l) )); then
          log_success "Database replication lag: ${lag}s (healthy)"
        else
          log_warning "Database replication lag: ${lag}s (expected < 30s)"
        fi
      fi
    fi
    return 0
  else
    log_error "Cannot connect to database at $db_host:5432"
    return 1
  fi
}

# Check Redis connectivity
check_redis() {
  local region=${1:-us-east-1}
  
  log_info "Checking Redis cache in $region"
  
  local redis_endpoint=$(aws elasticache describe-cache-clusters \
    --cache-cluster-id biaslens-${ENVIRONMENT}-redis \
    --region $region \
    --show-cache-node-info \
    --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
    --output text 2>/dev/null)
  
  if [ -z "$redis_endpoint" ] || [ "$redis_endpoint" == "None" ]; then
    log_warning "Could not find Redis endpoint"
    return 1
  fi
  
  if redis-cli -h $redis_endpoint ping > /dev/null 2>&1; then
    log_success "Redis cache healthy at $redis_endpoint"
    
    # Check memory usage
    local memory=$(redis-cli -h $redis_endpoint INFO stats | grep used_memory_human | cut -d: -f2)
    log_info "Redis memory usage: $memory"
    
    return 0
  else
    log_error "Cannot connect to Redis at $redis_endpoint"
    return 1
  fi
}

# Check API response times
check_latency() {
  local base_url=$1
  local name=${2:-API}
  
  log_info "Measuring $name latency"
  
  local times=()
  for i in {1..5}; do
    local time=$(curl -s -w "%{time_total}" -o /dev/null --max-time $TIMEOUT "$base_url/health" 2>/dev/null || echo "0")
    times+=("$time")
  done
  
  # Calculate average
  local avg=0
  for t in "${times[@]}"; do
    avg=$(echo "$avg + $t" | bc)
  done
  avg=$(echo "scale=3; $avg / ${#times[@]}" | bc)
  
  if (( $(echo "$avg < 0.5" | bc -l) )); then
    log_success "$name average latency: ${avg}s (excellent)"
    return 0
  elif (( $(echo "$avg < 1.0" | bc -l) )); then
    log_success "$name average latency: ${avg}s (good)"
    return 0
  else
    log_warning "$name average latency: ${avg}s (slow)"
    return 1
  fi
}

# Check error rates from Prometheus
check_error_rates() {
  local region=${1:-us-east-1}
  
  log_info "Checking error rates from Prometheus"
  
  local prometheus_url="http://prometheus.${ENVIRONMENT}.internal:9090"
  
  # Query 5-minute error rate
  local error_rate=$(curl -s "${prometheus_url}/api/v1/query?query=rate(http_requests_total%7Bstatus%3D~%225..%22%7D%5B5m%5D)" | grep -o '"value":\[.*\]' | head -1)
  
  if [ -n "$error_rate" ]; then
    log_success "Error rate: $error_rate (checking threshold)"
  else
    log_warning "Could not retrieve error rate from Prometheus"
  fi
}

# Main execution
main() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ BiasLens Production Health Check                       ║${NC}"
  echo -e "${BLUE}║ Environment: $ENVIRONMENT$(printf '%*s' $((45 - ${#ENVIRONMENT})) '')║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
  
  # Check frontend
  check_endpoint "https://biaslens.app/health" 200 "Frontend"
  
  # Check backend API
  check_endpoint "https://api.biaslens.app/health" 200 "Backend API"
  
  # Check ML service
  check_endpoint "https://ml.biaslens.app/health" 200 "ML Service"
  
  # Check monitoring stack
  check_endpoint "https://grafana.${ENVIRONMENT}.internal/api/health" 200 "Grafana"
  
  # Check latency
  check_latency "https://api.biaslens.app" "API"
  
  # Kubernetes checks
  if command -v kubectl &> /dev/null; then
    check_k8s_pods "biaslens-${ENVIRONMENT}"
  fi
  
  # Database checks
  check_database "us-east-1"
  
  # Redis checks
  if command -v redis-cli &> /dev/null; then
    check_redis "us-east-1"
  fi
  
  # Check other regions if requested
  if [ -n "$ALL_REGIONS" ]; then
    for region in "${REGIONS[@]:1}"; do
      log_info "\nChecking region: $region"
      check_database "$region" || true
    done
  fi
  
  # Summary
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ Health Check Summary                                    ║${NC}"
  echo -e "${GREEN}✓ Passed: $PASSED${NC}"
  echo -e "${RED}✗ Failed: $FAILED${NC}"
  echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
  
  # Exit code
  if [ $FAILED -gt 0 ]; then
    exit 1
  elif [ $WARNINGS -gt 0 ] && [ -n "$STRICT_MODE" ]; then
    exit 1
  else
    exit 0
  fi
}

# Run main
main "$@"
