"""Recommendation helpers derived from report results."""

from __future__ import annotations


def generate_report_recommendations(
    *,
    extracted_features: dict[str, object],
    prediction: dict[str, object],
    fairness_report: dict[str, object],
) -> list[str]:
    """Generate lightweight recommendations from the current report state."""
    recommendations: list[str] = []
    skills = [
        skill.strip()
        for skill in str(extracted_features.get("skills", "")).split(",")
        if skill.strip()
    ]
    ai_score = float(extracted_features.get("ai_score", 0.0))
    job_role = str(extracted_features.get("job_role", "target role"))
    predicted_label = str(prediction.get("prediction", ""))

    if ai_score < 60:
        recommendations.append(
            f"Strengthen role-specific keywords and projects for {job_role} to improve the extracted AI score."
        )
    if len(skills) < 5:
        recommendations.append(
            "Add more explicit technical skills to the resume so the parser can capture a fuller profile."
        )
    if predicted_label.lower() == "reject":
        recommendations.append(
            "Clarify measurable impact, experience depth, and role alignment to improve screening confidence."
        )

    gender_dp = float(fairness_report.get("gender_demographic_parity_difference", 0.0) or 0.0)
    if gender_dp >= 0.03:
        recommendations.append(
            "Review gender-group screening gaps and keep sensitive or proxy-like details out of automated ranking features."
        )

    if not recommendations:
        recommendations.append("Current report shows a reasonably strong profile; continue tailoring resume details to the target role.")

    return recommendations
