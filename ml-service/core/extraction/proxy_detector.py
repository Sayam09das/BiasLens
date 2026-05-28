"""Simple proxy-signal detection for potentially sensitive resume hints."""

from __future__ import annotations

import re

from core.extraction.education_extractor import extract_education_records
from core.extraction.entity_extractor import extract_entities
from core.types import ProxySignal

LOCATION_PATTERN = re.compile(
    r"\b(?:india|kolkata|delhi|mumbai|bangalore|bengaluru|chennai|hyderabad|pune|new york|london)\b",
    re.IGNORECASE,
)
GENDERED_TITLES_PATTERN = re.compile(r"\b(?:mr|mrs|ms|miss)\.?\b", re.IGNORECASE)


def detect_proxy_signals(text: str) -> list[ProxySignal]:
    """Detect coarse resume signals that may act as proxies for sensitive traits."""
    signals: list[ProxySignal] = []
    entities = extract_entities(text)
    education_records = extract_education_records(text)

    if entities["emails"]:
        signals.append(
            ProxySignal(
                name="contact_email",
                value=entities["emails"][0],
                reason="Email addresses can reveal personal identifiers and should be handled carefully.",
            )
        )
    if entities["phone_numbers"]:
        signals.append(
            ProxySignal(
                name="contact_phone",
                value=entities["phone_numbers"][0],
                reason="Phone numbers are direct personal identifiers.",
            )
        )
    if education_records:
        first_degree = education_records[0]
        signals.append(
            ProxySignal(
                name="education_history",
                value=first_degree["degree"] or "education entry detected",
                reason="Education information can indirectly reveal age or socioeconomic background.",
            )
        )

    location_match = LOCATION_PATTERN.search(text)
    if location_match:
        signals.append(
            ProxySignal(
                name="location_reference",
                value=location_match.group(0),
                reason="Location cues can correlate with protected or demographic attributes.",
            )
        )

    title_match = GENDERED_TITLES_PATTERN.search(text)
    if title_match:
        signals.append(
            ProxySignal(
                name="gendered_title",
                value=title_match.group(0),
                reason="Titles like Mr or Ms can act as direct gender proxies.",
            )
        )

    return signals


def build_proxy_report(text: str) -> dict[str, object]:
    """Return a compact proxy-signal report suitable for API use."""
    signals = detect_proxy_signals(text)
    return {
        "proxy_signal_count": len(signals),
        "signals": signals,
    }
