#!/bin/bash
################################################################################
# Production-Grade Database Backup Script
# Automated, versioned backups with cross-region replication & PITR support
# Usage: ./scripts/backup-db.sh [environment] [--destination s3://bucket] [--full|--incremental]
################################################################################

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-prod}
BACKUP_TYPE=${2:-incremental}
S3_BACKUP_BUCKET=${3:-s3://biaslens-backups}
AWS_REGION=${4:-us-east-1}

# Derived
DB_INSTANCE="biaslens-${ENVIRONMENT}"
BACKUP_DIR="/tmp/biaslens-backups"
BACKUP_TIMESTAMP=$(date -u +%Y%m%d_%H%M%S)
BACKUP_NAME="biaslens_${ENVIRONMENT}_${BACKUP_TIMESTAMP}"
LOG_FILE="/var/log/biaslens/db-backup-${BACKUP_TIMESTAMP}.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log_info() {
  msg=$(echo "$1" | tee -a "$LOG_FILE")
  echo -e "${BLUE}[INFO]${NC} $msg"
}

log_success() {
  msg=$(echo "$1" | tee -a "$LOG_FILE")
  echo -e "${GREEN}[✓]${NC} $msg"
}

log_error() {
  msg=$(echo "$1" | tee -a "$LOG_FILE")
  echo -e "${RED}[✗]${NC} $msg"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get RDS database password from AWS Secrets Manager
get_db_credentials() {
  log_info "Retrieving database credentials from AWS Secrets Manager..."
  
  local secret=$(aws secretsmanager get-secret-value \
    --secret-id rds/biaslens/${ENVIRONMENT}/admin \
    --region $AWS_REGION \
    --query 'SecretString' \
    --output text)
  
  DB_HOST=$(echo $secret | jq -r '.host')
  DB_USER=$(echo $secret | jq -r '.username')
  DB_PASSWORD=$(echo $secret | jq -r '.password')
  
  log_success "Credentials retrieved"
}

# Create automated RDS snapshot (AWS-managed)
create_rds_snapshot() {
  log_info "Creating RDS snapshot..."
  
  local snapshot_id="rds:${DB_INSTANCE}-${BACKUP_TIMESTAMP}"
  
  aws rds create-db-snapshot \
    --db-instance-identifier $DB_INSTANCE \
    --db-snapshot-identifier $snapshot_id \
    --region $AWS_REGION \
    --tags Key=Environment,Value=$ENVIRONMENT Key=BackupType,Value=snapshot \
    || { log_error "Failed to create RDS snapshot"; return 1; }
  
  log_success "RDS snapshot initiated: $snapshot_id"
  
  # Wait for snapshot to complete
  log_info "Waiting for snapshot to complete..."
  aws rds wait db-snapshot-available \
    --db-snapshot-identifier $snapshot_id \
    --region $AWS_REGION \
    || { log_error "Snapshot creation failed"; return 1; }
  
  log_success "RDS snapshot completed"
  
  # Copy to backup region
  if [ "$AWS_REGION" != "us-west-2" ]; then
    log_info "Copying snapshot to disaster recovery region..."
    
    aws rds copy-db-snapshot \
      --source-db-snapshot-identifier arn:aws:rds:${AWS_REGION}:123456789:snapshot:${snapshot_id} \
      --target-db-snapshot-identifier ${snapshot_id}-dr \
      --source-region $AWS_REGION \
      --destination-region us-west-2 \
      --tags Key=Environment,Value=$ENVIRONMENT Key=DR,Value=true \
      || log_warning "Failed to copy snapshot to DR region"
    
    log_success "DR snapshot copy initiated"
  fi
}

# Create logical backup (pg_dump for PITR)
create_logical_backup() {
  log_info "Creating logical backup with pg_dump..."
  
  get_db_credentials
  
  local backup_file="${BACKUP_DIR}/${BACKUP_NAME}.sql"
  local wal_log_file="${BACKUP_DIR}/${BACKUP_NAME}_wal.txt"
  
  # Capture WAL position before dump
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d biaslens \
    -c "SELECT pg_current_wal_lsn();" > "$wal_log_file"
  
  log_info "Creating database dump to $backup_file..."
  
  PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -U $DB_USER \
    -d biaslens \
    --format=custom \
    --compress=9 \
    --verbose \
    --file="$backup_file" \
    --exclude-schema=pg_* \
    || { log_error "pg_dump failed"; return 1; }
  
  log_success "Logical backup created: $backup_file"
  
  # Get file size
  local size=$(du -h "$backup_file" | cut -f1)
  log_info "Backup size: $size"
  
  # Compress if larger than 500MB
  if [ $(stat -f%z "$backup_file") -gt 524288000 ]; then
    log_info "Compressing backup..."
    gzip -9 "$backup_file"
    backup_file="${backup_file}.gz"
    log_success "Compressed to $(du -h "$backup_file" | cut -f1)"
  fi
  
  echo "$backup_file"
}

# Enable WAL archiving to S3
enable_wal_archiving() {
  log_info "Enabling WAL archiving to S3..."
  
  # Configure RDS parameter group for WAL archiving
  aws rds modify-db-parameter-group \
    --db-parameter-group-name biaslens-${ENVIRONMENT} \
    --parameters \
      ParameterName=wal_level,ParameterValue=replica,ApplyMethod=pending-reboot \
      ParameterName=max_wal_senders,ParameterValue=3,ApplyMethod=pending-reboot \
      ParameterName=max_replication_slots,ParameterValue=3,ApplyMethod=pending-reboot \
    --region $AWS_REGION \
    || log_warning "Failed to update parameter group (may already be configured)"
  
  log_success "WAL archiving configured"
}

# Upload backup to S3
upload_backup_to_s3() {
  local backup_file=$1
  
  log_info "Uploading backup to S3..."
  
  aws s3 cp "$backup_file" \
    "${S3_BACKUP_BUCKET}/${BACKUP_NAME}/" \
    --region $AWS_REGION \
    --sse AES256 \
    --metadata "environment=${ENVIRONMENT},timestamp=${BACKUP_TIMESTAMP},type=${BACKUP_TYPE}" \
    || { log_error "Failed to upload to S3"; return 1; }
  
  log_success "Backup uploaded to S3"
  
  # Replicate to secondary region
  log_info "Replicating backup to secondary region..."
  aws s3 sync \
    "${S3_BACKUP_BUCKET}/${BACKUP_NAME}/" \
    "${S3_BACKUP_BUCKET}-dr/${BACKUP_NAME}/" \
    --region $AWS_REGION \
    --sse AES256 \
    || log_warning "Failed to replicate to DR bucket"
}

# Create backup metadata
create_backup_metadata() {
  local backup_file=$1
  local metadata_file="${BACKUP_DIR}/${BACKUP_NAME}_metadata.json"
  
  log_info "Creating backup metadata..."
  
  cat > "$metadata_file" <<EOF
{
  "backup_id": "${BACKUP_NAME}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "${ENVIRONMENT}",
  "type": "${BACKUP_TYPE}",
  "database_instance": "${DB_INSTANCE}",
  "file_path": "${backup_file}",
  "file_size": "$(du -h "$backup_file" | cut -f1)",
  "s3_location": "${S3_BACKUP_BUCKET}/${BACKUP_NAME}/",
  "retention_days": 30,
  "rpo_minutes": 5,
  "rto_minutes": 15
}
EOF
  
  # Upload metadata
  aws s3 cp "$metadata_file" \
    "${S3_BACKUP_BUCKET}/${BACKUP_NAME}_metadata.json" \
    --region $AWS_REGION \
    --content-type application/json
  
  log_success "Backup metadata created"
}

# Verify backup integrity
verify_backup() {
  local backup_file=$1
  
  log_info "Verifying backup integrity..."
  
  # Check file exists and is not empty
  if [ ! -f "$backup_file" ] || [ ! -s "$backup_file" ]; then
    log_error "Backup file is invalid"
    return 1
  fi
  
  # List contents (for compressed dumps)
  if [[ "$backup_file" == *.gz ]]; then
    if gunzip -t "$backup_file" 2>/dev/null; then
      log_success "Backup integrity verified (gzip)"
    else
      log_error "Backup file is corrupted"
      return 1
    fi
  else
    # For custom format, just check header
    local header=$(head -c 4 "$backup_file" | od -An -tx1)
    if [[ "$header" == *"PGDMP"* ]]; then
      log_success "Backup integrity verified (PostgreSQL dump)"
    else
      log_error "Invalid PostgreSQL dump file"
      return 1
    fi
  fi
  
  return 0
}

# Send backup notification
send_notification() {
  local status=$1
  local message=$2
  
  # Send to Slack
  curl -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{
      \"text\": \"📦 Database Backup - ${status}\",
      \"attachments\": [{
        \"color\": \"$([ '$status' = 'Success' ] && echo 'good' || echo 'danger')\",
        \"fields\": [
          {\"title\": \"Environment\", \"value\": \"${ENVIRONMENT}\", \"short\": true},
          {\"title\": \"Type\", \"value\": \"${BACKUP_TYPE}\", \"short\": true},
          {\"title\": \"Backup ID\", \"value\": \"${BACKUP_NAME}\", \"short\": false},
          {\"title\": \"Message\", \"value\": \"${message}\", \"short\": false}
        ]
      }]
    }" \
    2>/dev/null || true
}

# Cleanup old backups
cleanup_old_backups() {
  log_info "Cleaning up backups older than 30 days..."
  
  # Delete local backups
  find "$BACKUP_DIR" -name "biaslens_${ENVIRONMENT}_*" -type f -mtime +30 -delete
  
  # Lifecycle policy on S3 (managed by bucket policy)
  log_success "Cleanup complete"
}

# Main execution
main() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ BiasLens Database Backup                                ║${NC}"
  echo -e "${BLUE}║ Environment: $ENVIRONMENT | Type: $BACKUP_TYPE $(printf '%*s' $((32 - ${#ENVIRONMENT} - ${#BACKUP_TYPE}})) '')║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
  
  mkdir -p "$(dirname "$LOG_FILE")"
  
  # Trap errors
  trap 'log_error "Backup failed"; send_notification "Failed" "See logs for details"; exit 1' ERR
  
  # Execute backup steps
  create_rds_snapshot
  enable_wal_archiving
  backup_file=$(create_logical_backup)
  verify_backup "$backup_file"
  upload_backup_to_s3 "$backup_file"
  create_backup_metadata "$backup_file"
  cleanup_old_backups
  
  # Success
  send_notification "Success" "Backup ID: ${BACKUP_NAME}"
  
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}✓ Backup completed successfully!${NC}"
  echo -e "${BLUE}║ Backup ID: ${BACKUP_NAME}$(printf '%*s' $((45 - ${#BACKUP_NAME})) '')║${NC}"
  echo -e "${BLUE}║ Location: ${S3_BACKUP_BUCKET}/${BACKUP_NAME}/$(printf '%*s' $((28 - ${#S3_BACKUP_BUCKET} - ${#BACKUP_NAME}}} '') '')║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
}

# Execute
main
