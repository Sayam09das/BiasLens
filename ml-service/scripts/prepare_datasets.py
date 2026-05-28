"""Validate and prepare raw CSV datasets for initial model development."""

from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
SAMPLES_DIR = ROOT / "data" / "samples"

REQUIRED_FILES = {
    "resume_data_for_ranking.csv": {
        "required_columns": {"skills", "positions", "responsibilities", "job_position_name", "matched_score"},
    },
    "AI_Resume_Screening.csv": {
        "required_columns": {
            "Skills",
            "Experience (Years)",
            "Job Role",
            "Recruiter Decision",
            "AI Score (0-100)",
        },
    },
    "recruitment_bias_fairness.csv": {
        "required_columns": {
            "gender",
            "age",
            "education_level",
            "experience_years",
            "screening_score",
            "shortlisted",
        },
    },
    "job_descriptions.csv": {
        "required_columns": {"Job Title", "Role", "Job Description", "skills", "Responsibilities"},
    },
}


def ensure_directories() -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)


def count_rows(path: Path) -> int:
    with path.open("r", encoding="utf-8", errors="ignore", newline="") as handle:
        return max(sum(1 for _ in handle) - 1, 0)


def read_header(path: Path) -> list[str]:
    with path.open("r", encoding="utf-8", errors="ignore", newline="") as handle:
        reader = csv.reader(handle)
        return next(reader)


def normalize_space(value: str) -> str:
    return " ".join((value or "").split())


def write_selected_rows(
    source_path: Path,
    destination_path: Path,
    fieldnames: list[str],
    row_limit: int,
    transform,
) -> int:
    written = 0
    with source_path.open("r", encoding="utf-8", errors="ignore", newline="") as src:
        reader = csv.DictReader(src)
        with destination_path.open("w", encoding="utf-8", newline="") as dst:
            writer = csv.DictWriter(dst, fieldnames=fieldnames)
            writer.writeheader()
            for row in reader:
                cleaned = transform(row)
                if cleaned is None:
                    continue
                writer.writerow(cleaned)
                written += 1
                if written >= row_limit:
                    break
    return written


def parse_numeric(value: str) -> float | None:
    try:
        return float(str(value).strip())
    except (TypeError, ValueError):
        return None


def validate_datasets() -> dict[str, dict[str, object]]:
    summary: dict[str, dict[str, object]] = {}
    for filename, config in REQUIRED_FILES.items():
        path = RAW_DIR / filename
        if not path.exists():
            raise FileNotFoundError(f"Missing dataset: {path}")

        header = read_header(path)
        header_set = set(header)
        missing = sorted(config["required_columns"] - header_set)
        if missing:
            raise ValueError(f"{filename} is missing required columns: {missing}")

        summary[filename] = {
            "path": str(path.relative_to(ROOT)),
            "rows": count_rows(path),
            "columns": len(header),
            "required_columns_verified": True,
        }
    return summary


def prepare_resume_screening() -> dict[str, object]:
    source = RAW_DIR / "AI_Resume_Screening.csv"
    destination = PROCESSED_DIR / "resume_screening_clean.csv"
    fieldnames = [
        "Resume_ID",
        "Job Role",
        "Skills",
        "Experience (Years)",
        "Recruiter Decision",
        "AI Score (0-100)",
    ]

    role_counts: Counter[str] = Counter()

    def transform(row: dict[str, str]) -> dict[str, str] | None:
        role = normalize_space(row.get("Job Role", ""))
        decision = normalize_space(row.get("Recruiter Decision", ""))
        skills = normalize_space(row.get("Skills", ""))
        if not role or not decision or not skills:
            return None

        role_counts[role] += 1
        return {
            "Resume_ID": normalize_space(row.get("Resume_ID", "")),
            "Job Role": role,
            "Skills": skills,
            "Experience (Years)": normalize_space(row.get("Experience (Years)", "")),
            "Recruiter Decision": decision,
            "AI Score (0-100)": normalize_space(row.get("AI Score (0-100)", "")),
        }

    written = write_selected_rows(source, destination, fieldnames, row_limit=1000, transform=transform)
    return {
        "output": str(destination.relative_to(ROOT)),
        "rows_written": written,
        "top_job_roles": role_counts.most_common(10),
    }


def prepare_recruitment_bias() -> dict[str, object]:
    source = RAW_DIR / "recruitment_bias_fairness.csv"
    destination = PROCESSED_DIR / "recruitment_bias_clean.csv"
    fieldnames = [
        "gender",
        "age",
        "education_level",
        "experience_years",
        "screening_score",
        "shortlisted",
    ]

    gender_counts: Counter[str] = Counter()
    shortlisted_counts: Counter[str] = Counter()

    def transform(row: dict[str, str]) -> dict[str, str] | None:
        age = parse_numeric(row.get("age", ""))
        experience = parse_numeric(row.get("experience_years", ""))
        score = parse_numeric(row.get("screening_score", ""))
        gender = normalize_space(row.get("gender", "")).lower()
        shortlisted = normalize_space(row.get("shortlisted", ""))
        education = normalize_space(row.get("education_level", ""))

        if None in (age, experience, score) or not gender or not shortlisted or not education:
            return None

        gender_counts[gender] += 1
        shortlisted_counts[shortlisted] += 1
        return {
            "gender": gender,
            "age": str(int(age) if age.is_integer() else age),
            "education_level": education,
            "experience_years": str(experience),
            "screening_score": str(score),
            "shortlisted": shortlisted,
        }

    written = write_selected_rows(source, destination, fieldnames, row_limit=2000, transform=transform)
    return {
        "output": str(destination.relative_to(ROOT)),
        "rows_written": written,
        "gender_distribution": gender_counts,
        "shortlisted_distribution": shortlisted_counts,
    }


def prepare_job_descriptions_sample() -> dict[str, object]:
    source = RAW_DIR / "job_descriptions.csv"
    destination = PROCESSED_DIR / "job_descriptions_sample.csv"
    fieldnames = ["Job Title", "Role", "Job Description", "skills", "Responsibilities", "location", "Country"]

    role_counts: Counter[str] = Counter()

    def transform(row: dict[str, str]) -> dict[str, str] | None:
        role = normalize_space(row.get("Role", ""))
        description = normalize_space(row.get("Job Description", ""))
        skills = normalize_space(row.get("skills", ""))
        if not role or not description or not skills:
            return None

        role_counts[role] += 1
        return {
            "Job Title": normalize_space(row.get("Job Title", "")),
            "Role": role,
            "Job Description": description,
            "skills": skills,
            "Responsibilities": normalize_space(row.get("Responsibilities", "")),
            "location": normalize_space(row.get("location", "")),
            "Country": normalize_space(row.get("Country", "")),
        }

    written = write_selected_rows(source, destination, fieldnames, row_limit=5000, transform=transform)
    return {
        "output": str(destination.relative_to(ROOT)),
        "rows_written": written,
        "top_roles": role_counts.most_common(10),
    }


def prepare_resume_ranking_sample() -> dict[str, object]:
    source = RAW_DIR / "resume_data_for_ranking.csv"
    destination = PROCESSED_DIR / "resume_ranking_sample.csv"
    fieldnames = [
        "job_position_name",
        "skills",
        "positions",
        "responsibilities",
        "skills_required",
        "matched_score",
        "career_objective",
    ]

    role_counts: Counter[str] = Counter()

    def transform(row: dict[str, str]) -> dict[str, str] | None:
        job_position_name = normalize_space(row.get("job_position_name", ""))
        skills = normalize_space(row.get("skills", ""))
        positions = normalize_space(row.get("positions", ""))
        responsibilities = normalize_space(row.get("responsibilities", ""))
        matched_score = normalize_space(row.get("matched_score", ""))
        if not job_position_name or not skills:
            return None

        role_counts[job_position_name] += 1
        return {
            "job_position_name": job_position_name,
            "skills": skills,
            "positions": positions,
            "responsibilities": responsibilities,
            "skills_required": normalize_space(row.get("skills_required", "")),
            "matched_score": matched_score,
            "career_objective": normalize_space(row.get("career_objective", "")),
        }

    written = write_selected_rows(source, destination, fieldnames, row_limit=5000, transform=transform)
    return {
        "output": str(destination.relative_to(ROOT)),
        "rows_written": written,
        "top_job_position_names": role_counts.most_common(10),
    }


def build_modeling_candidates(summary: dict[str, object]) -> None:
    candidates = {
        "screening_model": {
            "primary_dataset": "AI_Resume_Screening.csv",
            "target": "Recruiter Decision",
            "candidate_features": ["Skills", "Experience (Years)", "Education", "Certifications", "Projects Count"],
        },
        "fairness_analysis": {
            "primary_dataset": "recruitment_bias_fairness.csv",
            "target": "shortlisted",
            "sensitive_attributes": ["gender", "age"],
            "score_column": "screening_score",
        },
        "job_matching": {
            "resume_dataset": "resume_data_for_ranking.csv",
            "job_dataset": "job_descriptions.csv",
            "join_strategy": "semantic matching between resume skills and job skills/description",
        },
        "prep_summary": summary,
    }
    output = SAMPLES_DIR / "modeling_candidates.json"
    output.write_text(json.dumps(candidates, indent=2), encoding="utf-8")


def make_json_safe(value: object) -> object:
    if isinstance(value, Counter):
        return dict(value)
    if isinstance(value, dict):
        return {key: make_json_safe(val) for key, val in value.items()}
    if isinstance(value, list):
        return [make_json_safe(item) for item in value]
    if isinstance(value, tuple):
        return [make_json_safe(item) for item in value]
    return value


def main() -> None:
    ensure_directories()
    summary = validate_datasets()
    prep_summary = {
        "validated_datasets": summary,
        "outputs": {
            "resume_screening": prepare_resume_screening(),
            "recruitment_bias": prepare_recruitment_bias(),
            "job_descriptions": prepare_job_descriptions_sample(),
            "resume_ranking": prepare_resume_ranking_sample(),
        },
    }
    build_modeling_candidates(prep_summary)

    summary_path = PROCESSED_DIR / "dataset_summary.json"
    summary_path.write_text(
        json.dumps(make_json_safe(prep_summary), indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {summary_path.relative_to(ROOT)}")
    print(f"Wrote {(SAMPLES_DIR / 'modeling_candidates.json').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
