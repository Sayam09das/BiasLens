"""Education extraction helpers using lightweight resume heuristics."""

from __future__ import annotations

import re

from core.types import EducationRecord

DEGREE_PATTERNS = {
    "B.Tech": r"\bb\.?\s?tech\b|\bbachelor of technology\b",
    "B.E.": r"\bb\.?\s?e\.?\b|\bbachelor of engineering\b",
    "BCA": r"\bbca\b|\bbachelor of computer applications\b",
    "B.Sc": r"\bb\.?\s?sc\b|\bbachelor of science\b",
    "M.Tech": r"\bm\.?\s?tech\b|\bmaster of technology\b",
    "MCA": r"\bmca\b|\bmaster of computer applications\b",
    "M.Sc": r"\bm\.?\s?sc\b|\bmaster of science\b",
    "MBA": r"\bmba\b|\bmaster of business administration\b",
    "PhD": r"\bph\.?d\b|\bdoctor of philosophy\b",
}

INSTITUTION_PATTERN = re.compile(
    r"\b([A-Z][A-Za-z&.,' -]{3,}(?:University|College|Institute|School))\b"
)
YEAR_PATTERN = re.compile(r"\b(19|20)\d{2}\b")


def extract_education_records(text: str) -> list[EducationRecord]:
    """Extract coarse education records from resume text."""
    records: list[EducationRecord] = []
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    for line in lines:
        lowered = line.lower()
        matched_degree = next(
            (degree for degree, pattern in DEGREE_PATTERNS.items() if re.search(pattern, lowered)),
            None,
        )
        if not matched_degree:
            continue

        institution_match = INSTITUTION_PATTERN.search(line)
        year_matches = YEAR_PATTERN.findall(line)
        graduation_year = ""
        if year_matches:
            full_year_matches = re.findall(r"\b(?:19|20)\d{2}\b", line)
            graduation_year = full_year_matches[-1] if full_year_matches else ""

        records.append(
            EducationRecord(
                degree=matched_degree,
                institution=institution_match.group(1) if institution_match else "",
                graduation_year=graduation_year,
            )
        )

    unique_records: list[EducationRecord] = []
    seen: set[tuple[str, str, str]] = set()
    for record in records:
        key = (record["degree"], record["institution"], record["graduation_year"])
        if key in seen:
            continue
        seen.add(key)
        unique_records.append(record)
    return unique_records
