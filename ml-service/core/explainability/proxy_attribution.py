"""Attribution helpers for proxy-sensitive resume signals."""

from __future__ import annotations

from core.extraction.proxy_detector import detect_proxy_signals


def attribute_proxy_signals(
    *,
    resume_text: str,
    extracted_features: dict[str, object] | None = None,
) -> dict[str, object]:
    """Map detected proxy signals into a compact explainability payload."""
    signals = detect_proxy_signals(resume_text)
    return {
        "proxy_signal_count": len(signals),
        "signals": signals,
        "risk_summary": (
            "Potential proxy-sensitive signals were detected and should be excluded from downstream decision logic."
            if signals
            else "No obvious proxy-sensitive signals were detected by the heuristic scanner."
        ),
    }
