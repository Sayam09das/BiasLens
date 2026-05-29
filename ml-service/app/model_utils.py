"""Shared helpers used by training and prediction code."""

from __future__ import annotations

from datetime import date
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree

import pandas as pd

SKILL_PATTERNS = {
    "python": [r"\bpython\b"],
    "sql": [r"\bsql\b", r"\bmysql\b", r"\bpostgresql\b", r"\bpostgres\b"],
    "tableau": [r"\btableau\b"],
    "machine learning": [r"\bmachine learning\b", r"\bml\b"],
    "data analysis": [r"\bdata analysis\b", r"\banalytics\b", r"\bdata analyst\b"],
    "excel": [r"\bexcel\b", r"\bms excel\b"],
    "power bi": [r"\bpower\s*bi\b"],
    "tensorflow": [r"\btensorflow\b"],
    "pytorch": [r"\bpytorch\b"],
    "nlp": [r"\bnlp\b", r"\bnatural language processing\b"],
    "statistics": [r"\bstatistics\b", r"\bstatistical\b"],
    "scikit-learn": [r"\bscikit-learn\b", r"\bsklearn\b"],
    "aws": [r"\baws\b", r"\bamazon web services\b"],
    "spark": [r"\bspark\b", r"\bapache spark\b"],
    "java": [r"\bjava\b"],
    "javascript": [r"\bjavascript\b"],
    "typescript": [r"\btypescript\b"],
    "react": [r"\breact(?:\.js)?\b"],
    "next.js": [r"\bnext(?:\.js)?\b"],
    "node.js": [r"\bnode(?:\.js)?\b"],
    "express": [r"\bexpress(?:\.js)?\b", r"\bexpress\b"],
    "mongodb": [r"\bmongodb\b", r"\bmongo\b"],
    "html": [r"\bhtml\b", r"\bhtml5\b"],
    "css": [r"\bcss\b", r"\bcss3\b"],
    "git": [r"\bgit\b", r"\bgithub\b"],
    "docker": [r"\bdocker\b"],
    "api development": [r"\bapi\b", r"\brest api\b", r"\bbackend\b"],
    "full-stack development": [r"\bfull[- ]stack\b", r"\bfull stack\b"],
}

ROLE_SKILL_WEIGHTS = {
    "data scientist": {
        "high_value": {
            "python",
            "sql",
            "machine learning",
            "data analysis",
            "statistics",
            "tableau",
            "power bi",
            "tensorflow",
            "pytorch",
            "scikit-learn",
            "nlp",
            "spark",
        },
        "medium_value": {"aws", "excel", "java"},
        "low_value": {
            "react",
            "next.js",
            "node.js",
            "express",
            "mongodb",
            "html",
            "css",
            "full-stack development",
            "api development",
            "javascript",
            "typescript",
            "docker",
            "git",
        },
    },
    "full stack developer": {
        "high_value": {
            "javascript",
            "typescript",
            "react",
            "next.js",
            "node.js",
            "express",
            "mongodb",
            "html",
            "css",
            "api development",
            "full-stack development",
            "git",
        },
        "medium_value": {"python", "sql", "docker", "aws", "java"},
        "low_value": {
            "tableau",
            "power bi",
            "statistics",
            "nlp",
            "tensorflow",
            "pytorch",
            "scikit-learn",
            "spark",
            "data analysis",
        },
    },
    "machine learning engineer": {
        "high_value": {
            "python",
            "machine learning",
            "tensorflow",
            "pytorch",
            "scikit-learn",
            "nlp",
            "statistics",
            "sql",
            "spark",
        },
        "medium_value": {
            "aws",
            "docker",
            "data analysis",
            "java",
            "api development",
        },
        "low_value": {
            "react",
            "next.js",
            "node.js",
            "express",
            "mongodb",
            "html",
            "css",
            "full-stack development",
            "javascript",
            "typescript",
            "git",
            "tableau",
            "power bi",
        },
    },
    "backend developer": {
        "high_value": {
            "node.js",
            "express",
            "mongodb",
            "sql",
            "api development",
            "docker",
            "git",
            "javascript",
            "typescript",
            "python",
        },
        "medium_value": {
            "aws",
            "java",
            "html",
            "css",
            "full-stack development",
        },
        "low_value": {
            "react",
            "next.js",
            "tableau",
            "power bi",
            "statistics",
            "nlp",
            "tensorflow",
            "pytorch",
            "scikit-learn",
            "spark",
            "data analysis",
            "machine learning",
        },
    },
    "data analyst": {
        "high_value": {
            "sql",
            "data analysis",
            "excel",
            "tableau",
            "power bi",
            "python",
            "statistics",
        },
        "medium_value": {
            "machine learning",
            "aws",
            "java",
            "scikit-learn",
        },
        "low_value": {
            "react",
            "next.js",
            "node.js",
            "express",
            "mongodb",
            "html",
            "css",
            "full-stack development",
            "api development",
            "javascript",
            "typescript",
            "docker",
            "git",
            "tensorflow",
            "pytorch",
            "nlp",
            "spark",
        },
    },
}


def combine_text_columns(frame: pd.DataFrame) -> pd.Series:
    """Join text fields into one string per row in a pickle-safe way."""
    return frame["Skills"].fillna("") + " " + frame["Job Role"].fillna("")


def normalize_text(value: str) -> str:
    """Collapse repeated whitespace for more stable text matching."""
    return " ".join(value.split())


def extract_skills_from_text(text: str) -> list[str]:
    """Pull a broader set of skills from resume text using regex aliases."""
    lowered = text.lower()
    matches: list[str] = []
    for skill, patterns in SKILL_PATTERNS.items():
        if any(re.search(pattern, lowered) for pattern in patterns):
            matches.append(skill)
    return sorted(dict.fromkeys(matches))


def extract_experience_years(text: str) -> float:
    """Infer years of experience from summary phrases and date ranges."""
    patterns = [
        r"(\d+(?:\.\d+)?)\+?\s+years?\s+of\s+experience",
        r"experience\s+of\s+(\d+(?:\.\d+)?)\+?\s+years?",
        r"(\d+(?:\.\d+)?)\+?\s+years?\s+experience",
        r"over\s+(\d+(?:\.\d+)?)\+?\s+years?",
        r"(\d+(?:\.\d+)?)\+?\s+yrs?\b",
    ]

    lowered = text.lower()
    explicit_years: list[float] = []
    for pattern in patterns:
        for match in re.finditer(pattern, lowered):
            explicit_years.append(float(match.group(1)))

    inferred_from_dates = infer_experience_from_date_ranges(lowered)
    if explicit_years and inferred_from_dates > 0:
        return min(max(explicit_years), inferred_from_dates)
    if explicit_years:
        return min(max(explicit_years), 12.0)
    return inferred_from_dates


def estimate_ai_score(
    skills: list[str],
    experience_years: float,
    job_role: str | None = None,
) -> float:
    """Create a more conservative, role-aware heuristic score."""
    normalized_role = (job_role or "").strip().lower()
    role_config = ROLE_SKILL_WEIGHTS.get(normalized_role)

    if not role_config:
        skill_points = min(len(skills) * 4.5, 45)
        experience_points = min(experience_years * 6, 30)
        diversity_bonus = 4 if len(skills) >= 6 else 0
        score = skill_points + experience_points + diversity_bonus
        return round(max(0.0, min(score, 85.0)), 2)

    skill_set = set(skills)
    high_value_hits = len(skill_set & role_config["high_value"])
    medium_value_hits = len(skill_set & role_config["medium_value"])
    low_value_hits = len(skill_set & role_config["low_value"])

    skill_points = min(high_value_hits * 7 + medium_value_hits * 3 + low_value_hits * 1, 50)
    experience_points = min(experience_years * 5, 25)
    alignment_bonus = 8 if high_value_hits >= 4 else 4 if high_value_hits >= 2 else 0
    diversity_bonus = 4 if len(skill_set) >= 7 else 0
    score = skill_points + experience_points + alignment_bonus + diversity_bonus
    return round(max(0.0, min(score, 100.0)), 2)


def explain_role_fit(skills: list[str], job_role: str | None = None) -> dict[str, list[str] | str]:
    """Explain why a role scored the way it did based on matched and missing signals."""
    normalized_role = (job_role or "").strip().lower()
    role_config = ROLE_SKILL_WEIGHTS.get(normalized_role)
    skill_set = set(skills)

    if not role_config:
        return {
            "summary": "This role is using generic scoring because no role-specific profile is configured yet.",
            "matched_strengths": sorted(skill_set)[:5],
            "weaker_alignment": [],
        }

    matched_high = sorted(skill_set & role_config["high_value"])
    matched_medium = sorted(skill_set & role_config["medium_value"])
    missing_high = sorted(role_config["high_value"] - skill_set)

    matched_strengths = (matched_high + matched_medium)[:6]
    weaker_alignment = missing_high[:4]

    if matched_high:
        summary = f"Strongest alignment comes from core {job_role} skills such as {', '.join(matched_high[:3])}."
    elif matched_medium:
        summary = f"This resume shows partial {job_role} alignment through supporting skills like {', '.join(matched_medium[:3])}."
    else:
        summary = f"This resume has limited direct alignment with the core skill profile for {job_role}."

    return {
        "summary": summary,
        "matched_strengths": matched_strengths,
        "weaker_alignment": weaker_alignment,
    }


def infer_experience_from_date_ranges(text: str) -> float:
    """Estimate experience by reading ranges such as '2023 - Present'."""
    current_year = date.today().year
    max_years = 0.0

    year_ranges = re.findall(
        r"\b(20\d{2})\s*[-–]\s*(present|current|now|20\d{2})\b",
        text,
        flags=re.IGNORECASE,
    )
    for start_raw, end_raw in year_ranges:
        start_year = int(start_raw)
        end_year = current_year if end_raw.lower() in {"present", "current", "now"} else int(end_raw)
        if end_year >= start_year:
            max_years = max(max_years, float(end_year - start_year))

    month_ranges = re.findall(
        r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+(20\d{2})\s*[-–]\s*(?:present|current|now|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+(20\d{2}))\b",
        text,
        flags=re.IGNORECASE,
    )
    for start_raw, end_raw in month_ranges:
        start_year = int(start_raw)
        end_year = current_year if not end_raw else int(end_raw)
        if end_year >= start_year:
            max_years = max(max_years, float(end_year - start_year))

    if max_years <= 0:
        return 0.0

    return min(round(max_years, 1), 12.0)


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
