"""Basic PII redaction helpers for resume text."""

from __future__ import annotations

import re


EMAIL_PATTERN = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
PHONE_PATTERN = re.compile(r"(\+?\d[\d\s().-]{7,}\d)")


def redact_pii(text: str) -> str:
    """Redact obvious email addresses and phone numbers from text."""
    redacted = EMAIL_PATTERN.sub("[redacted-email]", text)
    return PHONE_PATTERN.sub("[redacted-phone]", redacted)
