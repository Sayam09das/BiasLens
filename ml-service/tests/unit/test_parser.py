"""Unit tests for parsing helpers."""

from core.preprocessing.parser import extract_experience_years, extract_skills_from_text


def test_extract_skills_from_text_returns_expected_skill() -> None:
    skills = extract_skills_from_text("Built dashboards with Python, SQL, and Tableau.")
    assert "python" in skills


def test_extract_experience_years_detects_inline_years() -> None:
    years = extract_experience_years("Data Scientist with 3 years of experience.")
    assert years >= 3
