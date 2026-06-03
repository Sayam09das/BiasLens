#!/bin/bash
################################################################################
# Production-Grade Blue-Green Deployment Script
# Zero-downtime deployments with instant rollback capability
# Usage: ./scripts/deploy-blue-green.sh [service] [image-tag] [region] [--dry-run]
################################################################################

set -euo pipefail

# Configuration
SERVICE=${1:-backend}
IMAGE_TAG=${2:-latest}
REGION=${3:-us-east-1}
ENVIRONMENT=${4:-prod}
DRY_RUN=${5:-}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }

# Get current environment (blue or green)
get_current_environment() {
  local current=$(kubectl get svc ${SERVICE}-router -n ${ENVIRONMENT} \
    -o jsonpath='{.spec.selector.environment}' 2>/dev/null || echo "blue")
  echo "$current"
}

# Get target environment (opposite of current)
get_target_environment() {
  local current=$(get_current_environment)
  if [ "$current" = "blue" ]; then
    echo "green"
  else
    echo "blue"
  fi
}

# Deploy to target environment
deploy_to_target() {
  local target=$1
  local service=$2
  local image_tag=$3
  
  log_info "Deploying $service to $target environment..."
  
  if [ -n "$DRY_RUN" ]; then
    log_warning "DRY RUN: Would deploy to $target"
    return 0
  fi
  
  # Update deployment with new image and environment label
  kubectl set image deployment/${service}-${target} \
    ${service}=123456789.dkr.ecr.${REGION}.amazonaws.com/${service}:${image_tag} \
    -n ${ENVIRONMENT} \
    --record=true \
    || { log_error "Failed to update image"; return 1; }
  
  # Patch environment label for traffic routing
  kubectl patch deployment ${service}-${target} -n ${ENVIRONMENT} \
    -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"environment\":\"${target}\"}}}}}" \
    || { log_error "Failed to patch labels"; return 1; }
  
  log_success "Deployment updated for $target environment"
}

# Wait for target environment to be ready
wait_for_deployment() {
  local deployment=$1
  local namespace=$2
  local timeout=600  # 10 minutes
  
  log_info "Waiting for deployment to reach desired state..."
  
  kubectl rollout status deployment/$deployment -n $namespace --timeout=${timeout}s \
    || { log_error "Deployment failed to reach desired state"; return 1; }
  
  log_success "Deployment ready"
}

# Run smoke tests on target environment
run_smoke_tests() {
  local target=$1
  local service=$2
  
  log_info "Running smoke tests on $target environment..."
  
  # Get target service IP
  local service_ip=$(kubectl get svc ${service}-${target} -n ${ENVIRONMENT} \
    -o jsonpath='{.spec.clusterIP}' || echo "")
  
  if [ -z "$service_ip" ]; then
    log_error "Could not get service IP for ${service}-${target}"
    return 1
  fi
  
  log_info "Testing service at $service_ip"
  
  # Run health check
  local attempts=0
  local max_attempts=30
  
  while [ $attempts -lt $max_attempts ]; do
    if curl -sf http://$service_ip/health > /dev/null 2>&1; then
      log_success "Health check passed"
      return 0
    fi
    ((attempts++))
    sleep 2
  done
  
  log_error "Health check failed after $max_attempts attempts"
  return 1
}

# Warm up cache in target environment
warmup_cache() {
  local target=$1
  
  log_info "Warming up cache in $target environment..."
  
  # Get pods in target environment
  local pods=$(kubectl get pods -n ${ENVIRONMENT} \
    -l app=${SERVICE},environment=${target} \
    -o jsonpath='{.items[*].metadata.name}')
  
  for pod in $pods; do
    # Execute cache warmup script
    kubectl exec $pod -n ${ENVIRONMENT} -- \
      node /app/scripts/warmup-cache.js > /dev/null 2>&1 || true
  done
  
  log_success "Cache warmup complete"
}

# Gradually shift traffic to target environment
shift_traffic() {
  local target=$1
  local service=$2
  local steps=("5" "25" "50" "75" "100")
  
  log_info "Gradually shifting traffic to $target environment..."
  
  for percentage in "${steps[@]}"; do
    log_info "Shifting to $percentage% traffic..."
    
    # Use Flagger for gradual traffic shifting
    kubectl patch virtualservice ${service}-route -n ${ENVIRONMENT} \
      --type merge -p "{\"spec\":{\"hosts\":[{\"name\":\"${service}\",\"http\":[{\"match\":[],\"route\":[{\"destination\":{\"host\":\"${service}-${target}\",\"port\":{\"number\":80}},\"weight\":${percentage}},{\"destination\":{\"host\":\"$(get_current_environment)\",\"port\":{\"number\":80}},\"weight\":$((100 - percentage))}]}]}]}}" \
      2>/dev/null || {
      # Fallback: simple service selector update for final switch
      if [ "$percentage" = "100" ]; then
        log_info "Performing final traffic switch..."
        kubectl patch svc ${service}-router -n ${ENVIRONMENT} \
          -p "{\"spec\":{\"selector\":{\"environment\":\"${target}\"}}}"
      fi
    }
    
    # Monitor metrics for this percentage
    sleep 60
    
    # Check error rate
    local error_rate=$(kubectl exec -it -n ${ENVIRONMENT} \
      deployment/prometheus -- \
      promtool query instant \
      "rate(http_requests_total{status=~\"5..\"}[5m])" \
      2>/dev/null || echo "0")
    
    if (( $(echo "$error_rate > 0.01" | bc -l) 2>/dev/null )); then
      log_error "Error rate spike detected: $error_rate"
      log_warning "Rolling back to previous environment..."
      
      # Immediate rollback
      kubectl patch svc ${service}-router -n ${ENVIRONMENT} \
        -p "{\"spec\":{\"selector\":{\"environment\":\"$(get_current_environment)\"}}}"
      
      return 1
    fi
    
    log_success "Traffic at $percentage%: healthy"
  done
  
  log_success "All traffic shifted to $target environment"
  return 0
}

# Monitor target environment for X minutes post-deployment
monitor_deployment() {
  local target=$1
  local duration=${2:-5}  # 5 minutes default
  
  log_info "Monitoring $target environment for ${duration}m..."
  
  local end_time=$((SECONDS + (duration * 60)))
  
  while [ $SECONDS -lt $end_time ]; do
    # Check pod health
    local unhealthy=$(kubectl get pods -n ${ENVIRONMENT} \
      -l app=${SERVICE},environment=${target} \
      --field-selector=status.phase!=Running -q | wc -l)
    
    if [ $unhealthy -gt 0 ]; then
      log_error "Unhealthy pods detected in $target environment"
      return 1
    fi
    
    # Check error rate
    local error_rate=$(kubectl exec -it -n ${ENVIRONMENT} \
      deployment/prometheus -- \
      promtool query instant \
      "rate(http_requests_total{environment=\"${target}\",status=~\"5..\"}[5m])" \
      2>/dev/null || echo "0")
    
    if (( $(echo "$error_rate > 0.05" | bc -l) 2>/dev/null )); then
      log_warning "Error rate: $error_rate (threshold: 0.05)"
    fi
    
    sleep 30
  done
  
  log_success "Monitoring complete: $target environment is healthy"
  return 0
}

# Rollback to previous environment
rollback() {
  local current=$(get_current_environment)
  
  log_warning "INITIATING ROLLBACK TO $current ENVIRONMENT"
  
  if [ -n "$DRY_RUN" ]; then
    log_warning "DRY RUN: Would rollback to $current"
    return 0
  fi
  
  # Switch back to current (previous stable) environment
  kubectl patch svc ${SERVICE}-router -n ${ENVIRONMENT} \
    -p "{\"spec\":{\"selector\":{\"environment\":\"${current}\"}}}"
  
  log_success "Rollback complete: traffic restored to $current"
}

# Main execution
main() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ BiasLens Blue-Green Deployment                          ║${NC}"
  echo -e "${BLUE}║ Service: $SERVICE | Tag: $IMAGE_TAG | Env: $ENVIRONMENT $(printf '%*s' $((20 - ${#SERVICE} - ${#IMAGE_TAG} - ${#ENVIRONMENT}})) '')║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
  
  # Get environments
  local current=$(get_current_environment)
  local target=$(get_target_environment)
  
  log_info "Current (Live): $current"
  log_info "Target (Shadow): $target"
  
  # Update kubeconfig
  aws eks update-kubeconfig --cluster-name biaslens-${ENVIRONMENT} --region ${REGION}
  
  # Trap rollback on error
  trap 'log_error "Deployment failed"; rollback; exit 1' ERR
  
  # Deployment steps
  deploy_to_target "$target" "$SERVICE" "$IMAGE_TAG" || exit 1
  wait_for_deployment "${SERVICE}-${target}" "${ENVIRONMENT}" || exit 1
  warmup_cache "$target" || true
  run_smoke_tests "$target" "$SERVICE" || exit 1
  shift_traffic "$target" "$SERVICE" || exit 1
  monitor_deployment "$target" 5 || {
    log_warning "Issues detected, rolling back..."
    rollback
    exit 1
  }
  
  # Update current environment marker
  kubectl annotate deployment ${SERVICE}-${target} -n ${ENVIRONMENT} \
    --overwrite "deployment.biaslens.app/promoted-at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}✓ Deployment successful!${NC}"
  echo -e "${BLUE}║ Environment: $target is now LIVE                         ║${NC}"
  echo -e "${BLUE}║ Rollback available via: ./deploy-blue-green.sh rollback ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
}

# Handle rollback command
if [ "${SERVICE}" = "rollback" ]; then
  rollback
  exit 0
fi

# Run main
main
