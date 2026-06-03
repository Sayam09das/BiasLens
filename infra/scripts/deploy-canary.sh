#!/usr/bin/env bash
set -euo pipefail

SERVICE="${1:-ml-service}"
VERSION="${2:-latest}"
echo "Canary deploy scaffold for ${SERVICE}:${VERSION}"
