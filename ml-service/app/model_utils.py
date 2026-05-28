"""Shared helpers used by training and prediction code."""

from __future__ import annotations

import pandas as pd


def combine_text_columns(frame: pd.DataFrame) -> pd.Series:
    """Join text fields into one string per row in a pickle-safe way."""
    return frame["Skills"].fillna("") + " " + frame["Job Role"].fillna("")
