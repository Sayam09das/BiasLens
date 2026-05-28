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
