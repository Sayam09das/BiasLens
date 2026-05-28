const form = document.getElementById("analysis-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const endpointPreview = document.getElementById("endpoint-preview");
const inputModeInputs = document.querySelectorAll('input[name="inputMode"]');
const fileField = document.getElementById("file-field");
const textField = document.getElementById("text-field");
const modeHelp = document.getElementById("mode-help");
const sourceFileBanner = document.getElementById("source-file-banner");
const emptyState = document.getElementById("empty-state");
const results = document.getElementById("results");

const predictionLabel = document.getElementById("prediction-label");
const topProbability = document.getElementById("top-probability");
const selectionRate = document.getElementById("selection-rate");

const featureSkills = document.getElementById("feature-skills");
const featureExperience = document.getElementById("feature-experience");
const featureRole = document.getElementById("feature-role");
const featureScore = document.getElementById("feature-score");
const resumePreviewBlock = document.getElementById("resume-preview-block");
const resumePreview = document.getElementById("resume-preview");
const comparisonBlock = document.getElementById("comparison-block");
const comparisonGrid = document.getElementById("comparison-grid");

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

function getFriendlyErrorMessage(error, isFileMode) {
  const rawMessage = String(error?.message || "Unknown error");

  if (rawMessage.includes("PDF parsing requires the 'pypdf' package")) {
    return "PDF upload is not enabled yet. Install the backend package 'pypdf', restart the API, or upload a .txt/.docx file.";
  }

  if (isFileMode && rawMessage.includes("Unsupported file type")) {
    return "That file type is not supported yet. Upload a .txt, .docx, or .pdf resume.";
  }

  return rawMessage;
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

function renderRoleComparisons(comparisons = []) {
  comparisonGrid.innerHTML = "";
  if (!comparisons.length) {
    comparisonBlock.classList.add("hidden");
    return;
  }

  comparisons.forEach((item) => {
    const card = document.createElement("article");
    card.className = "comparison-card";

    const probabilities = item.prediction.probabilities || {};
    const topEntry = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0];

    card.innerHTML = `
      <h4>${item.extracted_features.job_role}</h4>
      <p><strong>Decision:</strong> ${item.prediction.prediction}</p>
      <p><strong>Confidence:</strong> ${topEntry ? formatPercent(topEntry[1]) : "N/A"}</p>
      <p><strong>AI Score:</strong> ${item.extracted_features.ai_score}</p>
      <p><strong>Experience:</strong> ${item.extracted_features.experience_years} years</p>
      <p><strong>Skills:</strong> ${item.extracted_features.skills}</p>
    `;
    comparisonGrid.appendChild(card);
  });

  comparisonBlock.classList.remove("hidden");
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

  if (report.extracted_resume_text_preview) {
    resumePreview.textContent = report.extracted_resume_text_preview;
    resumePreviewBlock.classList.remove("hidden");
  } else {
    resumePreview.textContent = "";
    resumePreviewBlock.classList.add("hidden");
  }

  if (report.source_filename) {
    sourceFileBanner.textContent = `Analyzed file: ${report.source_filename}`;
    sourceFileBanner.classList.remove("hidden");
  } else {
    sourceFileBanner.textContent = "";
    sourceFileBanner.classList.add("hidden");
  }

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
  comparisonBlock.classList.add("hidden");
  comparisonGrid.innerHTML = "";
}

function renderComparisonReport(report) {
  const comparisons = report.comparisons || [];
  if (!comparisons.length) {
    return;
  }

  const primary = comparisons[0];
  renderReport({
    prediction: primary.prediction,
    fairness: report.fairness,
    extracted_features: primary.extracted_features,
  });
  renderRoleComparisons(comparisons);
  rawJson.textContent = JSON.stringify(report, null, 2);
}

function updateEndpointPreview() {
  const apiBaseUrl = document.getElementById("api-base-url").value.trim().replace(/\/$/, "");
  const selectedMode = document.querySelector('input[name="inputMode"]:checked')?.value || "text";
  const endpoint =
    selectedMode === "file" ? "/upload-resume" : "/report-from-text";
  endpointPreview.textContent = `${apiBaseUrl}${endpoint}`;
}

function updateInputMode() {
  const selectedMode = document.querySelector('input[name="inputMode"]:checked')?.value || "text";
  const isFileMode = selectedMode === "file";
  fileField.classList.toggle("hidden", !isFileMode);
  textField.classList.toggle("hidden", isFileMode);
  modeHelp.textContent = isFileMode
    ? "Choose a resume file to upload and analyze."
    : "Paste resume text directly into the box below.";
  updateEndpointPreview();
}

document.getElementById("api-base-url").addEventListener("input", updateEndpointPreview);
inputModeInputs.forEach((input) => {
  input.addEventListener("change", updateInputMode);
});
updateInputMode();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Calling the ML service...");
  submitButton.disabled = true;

  const formData = new FormData(form);
  const apiBaseUrl = String(formData.get("apiBaseUrl")).trim().replace(/\/$/, "");
  const isFileMode = formData.get("inputMode") === "file";
  const jobRole = String(formData.get("jobRole")).trim();
  const compareRoles = String(formData.get("compareRoles") || "").trim();

  try {
    let response;
    let isComparisonMode = false;

    if (isFileMode) {
      const file = document.getElementById("resume-file").files[0];
      if (!file) {
        throw new Error("Choose a .txt, .docx, or .pdf file first.");
      }

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("job_role", jobRole);

      response = await fetch(`${apiBaseUrl}/upload-resume`, {
        method: "POST",
        body: uploadData,
      });
    } else {
      const parsedRoles = compareRoles
        .split(",")
        .map((role) => role.trim())
        .filter(Boolean);

      if (parsedRoles.length >= 2) {
        isComparisonMode = true;
        response = await fetch(`${apiBaseUrl}/compare-roles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: String(formData.get("resumeText")).trim(),
            job_roles: parsedRoles,
          }),
        });
      } else {
        const payload = {
          job_role: jobRole,
          resume_text: String(formData.get("resumeText")).trim(),
        };

        response = await fetch(`${apiBaseUrl}/report-from-text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }
    }

    const data = await response.json();
    if (!response.ok) {
      const detail = data?.detail ? JSON.stringify(data.detail) : "Unknown error";
      throw new Error(detail);
    }

    if (!isFileMode && Array.isArray(data.comparisons)) {
      renderComparisonReport(data);
    } else {
      renderReport(data);
    }
    setStatus("Report generated successfully.");
  } catch (error) {
    setStatus(`Request failed: ${getFriendlyErrorMessage(error, isFileMode)}`, true);
  } finally {
    submitButton.disabled = false;
  }
});
