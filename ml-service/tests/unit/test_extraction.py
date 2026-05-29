"""Unit tests for extraction helpers."""

from core.extraction.education_extractor import extract_education_records
from core.extraction.skills_extractor import list_supported_skills


def test_list_supported_skills_is_not_empty() -> None:
    assert list_supported_skills()


def test_extract_education_records_finds_degree_hint() -> None:
    records = extract_education_records("Completed BCA (Hons.) from Example University in 2024.")
    assert records
