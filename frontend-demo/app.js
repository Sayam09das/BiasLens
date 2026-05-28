const form = document.getElementById("analysis-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const endpointPreview = document.getElementById("endpoint-preview");
const emptyState = document.getElementById("empty-state");
const results = document.getElementById("results");

const predictionLabel = document.getElementById("prediction-label");
const topProbability = document.getElementById("top-probability");
const selectionRate = document.getElementById("selection-rate");

const featureSkills = document.getElementById("feature-skills");
const featureExperience = document.getElementById("feature-experience");
const featureRole = document.getElementById("feature-role");
const featureScore = document.getElementById("feature-score");

const probabilityList = document.getElementById("probability-list");
const genderList = document.getElementById("gender-list");
const ageList = document.getElementById("age-list");

const genderParity = document.getElementById("gender-parity");
const ageParity = document.getElementById("age-parity");
const genderImpact = document.getElementById("gender-impact");
const ageImpact = document.getElementById("age-impact");
const rawJson = document.getElementById("raw-json");

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function formatNumber(value) {
  return Number(value).toFixed(4);
}

function setStatus(message, isError = false) {
  formStatus.textContent = message;
  formStatus.style.color = isError ? "#a12d2d" : "#665c50";
}

function createStackItem(title, details) {
  const item = document.createElement("div");
  item.className = "stack-item";

  const strong = document.createElement("strong");
  strong.textContent = title;

  const span = document.createElement("span");
  span.textContent = details;

  item.append(strong, span);
  return item;
}

function renderProbabilityList(probabilities = {}) {
  probabilityList.innerHTML = "";
  Object.entries(probabilities).forEach(([label, probability]) => {
    probabilityList.appendChild(
      createStackItem(label, `${formatPercent(probability)} confidence`)
    );
  });
}

function renderFairnessList(container, metrics = {}) {
  container.innerHTML = "";
  Object.entries(metrics).forEach(([label, values]) => {
    const details = [
      `${values.rows} rows`,
      values.selection_rate != null ? `selection ${formatPercent(values.selection_rate)}` : null,
      values.average_screening_score != null
        ? `avg score ${formatNumber(values.average_screening_score)}`
        : null,
    ]
      .filter(Boolean)
      .join(" • ");

    container.appendChild(createStackItem(label, details));
  });
}

function renderReport(report) {
  const { prediction, fairness, extracted_features: extractedFeatures } = report;
  const probabilities = prediction.probabilities || {};
  const topEntry = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0];

  predictionLabel.textContent = prediction.prediction;
  topProbability.textContent = topEntry ? `${topEntry[0]} · ${formatPercent(topEntry[1])}` : "N/A";
  selectionRate.textContent = formatPercent(fairness.overall_selection_rate);

  featureSkills.textContent = extractedFeatures.skills;
  featureExperience.textContent = `${extractedFeatures.experience_years} years`;
  featureRole.textContent = extractedFeatures.job_role;
  featureScore.textContent = String(extractedFeatures.ai_score);

  renderProbabilityList(probabilities);
  renderFairnessList(genderList, fairness.by_gender);
  renderFairnessList(ageList, fairness.by_age_group);

  genderParity.textContent = formatNumber(fairness.gender_demographic_parity_difference);
  ageParity.textContent = formatNumber(fairness.age_demographic_parity_difference);
  genderImpact.textContent = fairness.gender_disparate_impact_ratio != null
    ? formatNumber(fairness.gender_disparate_impact_ratio)
    : "N/A";
  ageImpact.textContent = fairness.age_disparate_impact_ratio != null
    ? formatNumber(fairness.age_disparate_impact_ratio)
    : "N/A";

  rawJson.textContent = JSON.stringify(report, null, 2);
  emptyState.classList.add("hidden");
  results.classList.remove("hidden");
}

function updateEndpointPreview() {
  const apiBaseUrl = document.getElementById("api-base-url").value.trim().replace(/\/$/, "");
  endpointPreview.textContent = `${apiBaseUrl}/report-from-text`;
}

document.getElementById("api-base-url").addEventListener("input", updateEndpointPreview);
updateEndpointPreview();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Calling the ML service...");
  submitButton.disabled = true;

  const formData = new FormData(form);
  const apiBaseUrl = String(formData.get("apiBaseUrl")).trim().replace(/\/$/, "");
  const payload = {
    job_role: String(formData.get("jobRole")).trim(),
    resume_text: String(formData.get("resumeText")).trim(),
  };

  try {
    const response = await fetch(`${apiBaseUrl}/report-from-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = data?.detail ? JSON.stringify(data.detail) : "Unknown error";
      throw new Error(detail);
    }

    renderReport(data);
    setStatus("Report generated successfully.");
  } catch (error) {
    setStatus(`Request failed: ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
  }
});
