"""Monitoring metric definitions and lightweight helpers."""

from __future__ import annotations


SERVICE_METRICS = {
    "requests_total": "Total API requests served by the ML service.",
    "prediction_requests_total": "Prediction and report requests served.",
    "inference_latency_ms": "Observed inference latency in milliseconds.",
}
