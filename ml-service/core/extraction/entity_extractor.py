"""Entity extraction helpers for contact and profile details."""

from __future__ import annotations

import re

from core.types import EntityExtractionResult

EMAIL_PATTERN = re.compile(r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_PATTERN = re.compile(r"(?:\+?\d{1,3}[\s-]?)?(?:\d[\s-]?){9,14}\d")
URL_PATTERN = re.compile(r"\b(?:https?://|www\.)\S+\b", re.IGNORECASE)
LINKEDIN_PATTERN = re.compile(r"\blinkedin(?:\.com/in/)?[/:\s-]*([A-Za-z0-9_-]+)", re.IGNORECASE)
GITHUB_PATTERN = re.compile(r"\bgithub(?:\.com/)?[/:\s-]*([A-Za-z0-9_-]+)", re.IGNORECASE)


def extract_entities(text: str) -> EntityExtractionResult:
    """Extract common resume entities such as contact info and profile links."""
    return EntityExtractionResult(
        emails=sorted(set(EMAIL_PATTERN.findall(text))),
        phone_numbers=sorted(set(_normalize_phone_numbers(PHONE_PATTERN.findall(text)))),
        links=sorted(set(URL_PATTERN.findall(text))),
        linkedin_handles=sorted(set(LINKEDIN_PATTERN.findall(text))),
        github_handles=sorted(set(GITHUB_PATTERN.findall(text))),
    )


def _normalize_phone_numbers(phone_matches: list[str]) -> list[str]:
    normalized: list[str] = []
    for value in phone_matches:
        cleaned = re.sub(r"\s+", " ", value).strip(" -")
        if len(re.sub(r"\D", "", cleaned)) >= 10:
            normalized.append(cleaned)
    return normalized
