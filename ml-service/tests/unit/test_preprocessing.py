"""Unit tests for preprocessing helpers."""

from core.preprocessing.cleaner import normalize_text
from core.preprocessing.pii_redactor import redact_pii


def test_normalize_text_normalizes_whitespace() -> None:
    cleaned = normalize_text("Python   SQL\n\nTableau")
    assert "  " not in cleaned


def test_redact_pii_hides_email() -> None:
    redacted = redact_pii("Reach me at test@example.com")
    assert "example.com" not in redacted
