#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-staging}"
BACKUP_ID="${2:-}"

if [[ -z "${BACKUP_ID}" ]]; then
  echo "Usage: $0 <environment> <backup-id>"
  exit 1
fi

echo "Restore scaffold for ${ENVIRONMENT} using backup ${BACKUP_ID}"
