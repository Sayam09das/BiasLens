"""Shared helpers used by training and prediction code."""

from __future__ import annotations

import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree

import pandas as pd

KNOWN_SKILLS = [
    "python",
    "sql",
    "tableau",
    "machine learning",
    "data analysis",
    "excel",
    "power bi",
    "tensorflow",
    "pytorch",
    "nlp",
    "statistics",
    "scikit-learn",
    "aws",
    "spark",
    "java",
]


def combine_text_columns(frame: pd.DataFrame) -> pd.Series:
    """Join text fields into one string per row in a pickle-safe way."""
    return frame["Skills"].fillna("") + " " + frame["Job Role"].fillna("")


def normalize_text(value: str) -> str:
    """Collapse repeated whitespace for more stable text matching."""
    return " ".join(value.split())


def extract_skills_from_text(text: str) -> list[str]:
    """Pull a small set of known skills from resume text using keyword matches."""
    lowered = text.lower()
    matches = [skill for skill in KNOWN_SKILLS if skill in lowered]
    return sorted(dict.fromkeys(matches))


def extract_experience_years(text: str) -> float:
    """Infer years of experience from common resume text patterns."""
    patterns = [
        r"(\d+(?:\.\d+)?)\+?\s+years?\s+of\s+experience",
        r"experience\s+of\s+(\d+(?:\.\d+)?)\+?\s+years?",
        r"(\d+(?:\.\d+)?)\+?\s+years?\s+experience",
    ]

    lowered = text.lower()
    for pattern in patterns:
        match = re.search(pattern, lowered)
        if match:
            return float(match.group(1))

    return 0.0


def estimate_ai_score(skills: list[str], experience_years: float) -> float:
    """Create a simple heuristic score for raw-text requests."""
    skill_points = min(len(skills) * 12, 72)
    experience_points = min(experience_years * 4, 28)
    score = skill_points + experience_points
    return round(max(0.0, min(score, 100.0)), 2)


def extract_text_from_docx(path: Path) -> str:
    """Read document text from a .docx file without extra dependencies."""
    paragraphs: list[str] = []
    with zipfile.ZipFile(path) as archive:
        xml_bytes = archive.read("word/document.xml")

    root = ElementTree.fromstring(xml_bytes)
    namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    for paragraph in root.findall(".//w:p", namespace):
        parts = [node.text for node in paragraph.findall(".//w:t", namespace) if node.text]
        if parts:
            paragraphs.append("".join(parts))

    return normalize_text("\n".join(paragraphs))


def extract_text_from_pdf(path: Path) -> str:
    """Read document text from a .pdf file if pypdf is installed."""
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise RuntimeError(
            "PDF parsing requires the 'pypdf' package. Install it to enable PDF uploads."
        ) from exc

    reader = PdfReader(str(path))
    text_parts = [page.extract_text() or "" for page in reader.pages]
    return normalize_text("\n".join(text_parts))


def extract_text_from_resume_file(path: Path) -> str:
    """Extract raw text from a supported resume file."""
    suffix = path.suffix.lower()
    if suffix == ".txt":
        return normalize_text(path.read_text(encoding="utf-8", errors="ignore"))
    if suffix == ".docx":
        return extract_text_from_docx(path)
    if suffix == ".pdf":
        return extract_text_from_pdf(path)
    raise ValueError("Unsupported file type. Use .pdf, .docx, or .txt")
