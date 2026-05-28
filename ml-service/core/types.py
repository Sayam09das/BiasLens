"""Shared type definitions for the core ML pipeline."""

from __future__ import annotations

from typing import TypedDict


class RoleFitExplanationDict(TypedDict):
    summary: str
    matched_strengths: list[str]
    weaker_alignment: list[str]


class ExtractedFeatureSet(TypedDict):
    skills: str
    experience_years: float
    job_role: str
    ai_score: float


class EducationRecord(TypedDict):
    degree: str
    institution: str
    graduation_year: str


class ExperienceProfile(TypedDict):
    total_years: float
    explicit_year_mentions: list[float]
    inferred_from_dates: float


class EntityExtractionResult(TypedDict):
    emails: list[str]
    phone_numbers: list[str]
    links: list[str]
    linkedin_handles: list[str]
    github_handles: list[str]


class ProxySignal(TypedDict):
    name: str
    value: str
    reason: str
