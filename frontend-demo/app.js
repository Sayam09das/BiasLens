const form = document.getElementById("analysis-form");
const submitButton = document.getElementById("submit-button");
const formStatus = document.getElementById("form-status");
const endpointPreview = document.getElementById("endpoint-preview");
const inputModeInputs = document.querySelectorAll('input[name="inputMode"]');
const compareRoleInputs = document.querySelectorAll('input[name="compareRoleOption"]');
const compareModeToggle = document.getElementById("compare-mode-toggle");
const fileField = document.getElementById("file-field");
const textField = document.getElementById("text-field");
const modeHelp = document.getElementById("mode-help");
const advancedModeBanner = document.getElementById("advanced-mode-banner");
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
const bestMatchSummary = document.getElementById("best-match-summary");
const explainabilityBlock = document.getElementById("explainability-block");
const shapMethod = document.getElementById("shap-method");
const limeMethod = document.getElementById("lime-method");
const shapMessage = document.getElementById("shap-message");
const limeMessage = document.getElementById("lime-message");
const shapList = document.getElementById("shap-list");
const limeList = document.getElementById("lime-list");
const proxySummary = document.getElementById("proxy-summary");
const proxyList = document.getElementById("proxy-list");
const counterfactualBlock = document.getElementById("counterfactual-block");
const counterfactualSummary = document.getElementById("counterfactual-summary");
const counterfactualGrid = document.getElementById("counterfactual-grid");

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

function createPlaceholderItem(message) {
  const item = document.createElement("div");
  item.className = "stack-item muted-item";
  item.textContent = message;
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

function resetAdvancedSections() {
  explainabilityBlock.classList.add("hidden");
  counterfactualBlock.classList.add("hidden");

  shapMethod.textContent = "-";
  limeMethod.textContent = "-";
  shapMessage.textContent = "-";
  limeMessage.textContent = "-";
  proxySummary.textContent = "-";

  shapList.innerHTML = "";
  limeList.innerHTML = "";
  proxyList.innerHTML = "";
  counterfactualSummary.textContent = "";
  counterfactualGrid.innerHTML = "";
}

function renderExplanationContributionList(container, items = [], fallbackMessage) {
  container.innerHTML = "";
  if (!items.length) {
    container.appendChild(createPlaceholderItem(fallbackMessage));
    return;
  }

  items.forEach((item) => {
    const label = item.feature || "feature";
    const details = [
      item.importance != null ? `importance ${formatNumber(item.importance)}` : null,
      item.reason || null,
    ]
      .filter(Boolean)
      .join(" • ");

    container.appendChild(createStackItem(label, details));
  });
}

function renderProxySignals(proxyAttribution = {}) {
  proxyList.innerHTML = "";
  proxySummary.textContent = proxyAttribution.risk_summary || "No proxy attribution summary available.";

  const signals = Array.isArray(proxyAttribution.signals) ? proxyAttribution.signals : [];
  if (!signals.length) {
    proxyList.appendChild(createPlaceholderItem("No obvious proxy-sensitive signals were detected."));
    return;
  }

  signals.forEach((signal) => {
    const label = signal.signal || signal.feature || "signal";
    const details = [
      signal.category || null,
      signal.reason || signal.description || null,
    ]
      .filter(Boolean)
      .join(" • ");

    proxyList.appendChild(createStackItem(label, details || "Flagged by proxy detector"));
  });
}

function renderExplainability(explainData) {
  if (!explainData) {
    resetAdvancedSections();
    return;
  }

  const shap = explainData.shap || {};
  const lime = explainData.lime || {};

  shapMethod.textContent = `${shap.method || "unknown"}${shap.available ? " · live" : " · fallback"}`;
  limeMethod.textContent = `${lime.method || "unknown"}${lime.available ? " · live" : " · fallback"}`;
  shapMessage.textContent = shap.message || "No SHAP summary available.";
  limeMessage.textContent = lime.message || "No LIME summary available.";

  renderExplanationContributionList(
    shapList,
    shap.feature_contributions || [],
    "No SHAP contributions were returned."
  );
  renderExplanationContributionList(
    limeList,
    lime.top_local_features || [],
    "No LIME local features were returned."
  );
  renderProxySignals(explainData.proxy_attribution || {});

  explainabilityBlock.classList.remove("hidden");
}

function renderCounterfactuals(counterfactualData) {
  counterfactualGrid.innerHTML = "";
  if (!counterfactualData) {
    counterfactualBlock.classList.add("hidden");
    counterfactualSummary.textContent = "";
    return;
  }

  const candidates = Array.isArray(counterfactualData.candidates)
    ? counterfactualData.candidates
    : [];

  if (!candidates.length) {
    counterfactualSummary.textContent = "No counterfactual candidates were returned for this resume.";
    counterfactualGrid.appendChild(createPlaceholderItem("Try a different resume snippet or target role."));
    counterfactualBlock.classList.remove("hidden");
    return;
  }

  const bestIndex = Number.isInteger(counterfactualData.best_candidate_index)
    ? counterfactualData.best_candidate_index
    : 0;
  const bestCandidate = candidates[bestIndex];
  const bestPrediction = bestCandidate?.prediction?.probabilities?.Hire ?? 0;
  counterfactualSummary.textContent = bestCandidate
    ? `Best improvement path raises hire confidence to ${formatPercent(bestPrediction)} with targeted feature changes.`
    : "Counterfactual candidates generated successfully.";

  candidates.forEach((candidate, index) => {
    const card = document.createElement("article");
    const isBest = index === bestIndex;
    const prediction = candidate.prediction || {};
    const probabilities = prediction.probabilities || {};
    const evaluation = candidate.evaluation || {};
    const topEntry = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0];

    card.className = `comparison-card${isBest ? " best-match" : ""}`;
    card.innerHTML = `
      ${isBest ? '<span class="best-match-badge">Best Candidate</span>' : '<span class="rank-badge">Candidate</span>'}
      <h4>${candidate.candidate_features?.job_role || "Role adjustment"}</h4>
      <p><strong>Suggested outcome:</strong> ${prediction.prediction || "N/A"}</p>
      <p><strong>Top confidence:</strong> ${topEntry ? formatPercent(topEntry[1]) : "N/A"}</p>
      <p><strong>Hire lift:</strong> ${
        evaluation.hire_probability_delta != null ? formatPercent(evaluation.hire_probability_delta) : "N/A"
      }</p>
      <p><strong>AI Score:</strong> ${candidate.candidate_features?.ai_score ?? "N/A"}</p>
      <p><strong>Experience:</strong> ${candidate.candidate_features?.experience_years ?? "N/A"} years</p>
      <p><strong>Skills:</strong> ${candidate.candidate_features?.skills || "N/A"}</p>
      <p><strong>Summary:</strong> ${candidate.summary || "No summary available."}</p>
    `;
    counterfactualGrid.appendChild(card);
  });

  counterfactualBlock.classList.remove("hidden");
}

function renderRoleComparisons(comparisons = []) {
  comparisonGrid.innerHTML = "";
  if (!comparisons.length) {
    comparisonBlock.classList.add("hidden");
    bestMatchSummary.textContent = "";
    return;
  }

  const rankedComparisons = [...comparisons].sort((left, right) => {
    const leftHire = left.prediction.probabilities?.Hire ?? 0;
    const rightHire = right.prediction.probabilities?.Hire ?? 0;
    return rightHire - leftHire;
  });
  const bestItem = rankedComparisons[0];
  const bestRole = bestItem?.extracted_features?.job_role;
  const bestSkills = String(bestItem?.extracted_features?.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
  const bestHire = bestItem?.prediction?.probabilities?.Hire ?? 0;
  bestMatchSummary.textContent = bestRole
    ? `${bestRole} ranks highest for this resume with ${formatPercent(bestHire)} hire confidence, driven by skills like ${bestSkills || "the extracted profile"}.`
    : "";

  const getRankLabel = (hireProbability) => {
    if (hireProbability >= 0.6) {
      return "Strong Match";
    }
    if (hireProbability >= 0.35) {
      return "Possible Match";
    }
    return "Weak Match";
  };

  comparisons.forEach((item) => {
    const card = document.createElement("article");
    const isBestMatch = item.extracted_features.job_role === bestRole;
    card.className = `comparison-card${isBestMatch ? " best-match" : ""}`;

    const probabilities = item.prediction.probabilities || {};
    const topEntry = Object.entries(probabilities).sort((a, b) => b[1] - a[1])[0];
    const hireProbability = probabilities.Hire ?? 0;
    const explanation = item.fit_explanation || {};
    const matchedStrengths = Array.isArray(explanation.matched_strengths)
      ? explanation.matched_strengths.join(", ")
      : "";
    const weakerAlignment = Array.isArray(explanation.weaker_alignment)
      ? explanation.weaker_alignment.join(", ")
      : "";
    const rankLabel = getRankLabel(hireProbability);
    const rankBadgeMarkup = isBestMatch ? "" : `<span class="rank-badge">${rankLabel}</span>`;

    card.innerHTML = `
      ${isBestMatch ? '<span class="best-match-badge">Best Match</span>' : ""}
      ${rankBadgeMarkup}
      <h4>${item.extracted_features.job_role}</h4>
      <div class="match-meter">
        <div class="match-meter-label">
          <span>Hire Confidence</span>
          <span>${formatPercent(hireProbability)}</span>
        </div>
        <div class="match-meter-track">
          <div class="match-meter-fill" style="width: ${Math.max(0, Math.min(hireProbability * 100, 100))}%"></div>
        </div>
      </div>
      <p><strong>Decision:</strong> ${item.prediction.prediction}</p>
      <p><strong>Confidence:</strong> ${topEntry ? formatPercent(topEntry[1]) : "N/A"}</p>
      <p><strong>AI Score:</strong> ${item.extracted_features.ai_score}</p>
      <p><strong>Experience:</strong> ${item.extracted_features.experience_years} years</p>
      <p><strong>Skills:</strong> ${item.extracted_features.skills}</p>
      <p><strong>Why:</strong> ${explanation.summary || "No explanation available yet."}</p>
      <ul>
        ${matchedStrengths ? `<li><strong>Matched strengths:</strong> ${matchedStrengths}</li>` : ""}
        ${weakerAlignment ? `<li><strong>Weaker alignment:</strong> ${weakerAlignment}</li>` : ""}
      </ul>
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
  resetAdvancedSections();
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
  resetAdvancedSections();
}

function updateEndpointPreview() {
  const apiBaseUrl = document.getElementById("api-base-url").value.trim().replace(/\/$/, "");
  const selectedMode = document.querySelector('input[name="inputMode"]:checked')?.value || "text";
  const selectedComparisonRoles = getSelectedComparisonRoles();
  const comparisonEnabled = compareModeToggle.checked && selectedComparisonRoles.length >= 2;
  let endpoint = "/report-from-text";
  if (selectedMode === "file") {
    endpoint = comparisonEnabled ? "/compare-upload-resume" : "/upload-resume";
  } else if (comparisonEnabled) {
    endpoint = "/compare-roles";
  }
  endpointPreview.textContent = `${apiBaseUrl}${endpoint}`;
  advancedModeBanner.classList.toggle("hidden", !comparisonEnabled);
}

function syncSingleAnalysisSelection() {
  const jobRoleInput = document.getElementById("job-role");
  const currentRole = jobRoleInput.value.trim();
  let matchedInput = null;

  compareRoleInputs.forEach((input) => {
    const shouldKeep = input.value === currentRole;
    input.checked = shouldKeep;
    if (shouldKeep) {
      matchedInput = input;
    }
  });

  if (!matchedInput && compareRoleInputs.length > 0) {
    compareRoleInputs[0].checked = true;
    jobRoleInput.value = compareRoleInputs[0].value;
  }
}

function syncCompareMode() {
  const comparisonEnabled = compareModeToggle.checked;
  compareRoleInputs.forEach((input) => {
    input.disabled = false;
  });

  if (!comparisonEnabled) {
    syncSingleAnalysisSelection();
  }

  updateEndpointPreview();
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

function getSelectedComparisonRoles() {
  return Array.from(compareRoleInputs)
    .filter((input) => input.checked)
    .map((input) => input.value);
}

document.getElementById("api-base-url").addEventListener("input", updateEndpointPreview);
document.getElementById("job-role").addEventListener("input", () => {
  if (!compareModeToggle.checked) {
    syncSingleAnalysisSelection();
  }
});
inputModeInputs.forEach((input) => {
  input.addEventListener("change", updateInputMode);
});
compareRoleInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (!compareModeToggle.checked) {
      syncSingleAnalysisSelection();
      return;
    }

    updateEndpointPreview();
  });
});
compareModeToggle.addEventListener("change", syncCompareMode);
syncCompareMode();
updateInputMode();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Calling the ML service...");
  submitButton.disabled = true;

  const formData = new FormData(form);
  const apiBaseUrl = String(formData.get("apiBaseUrl")).trim().replace(/\/$/, "");
  const isFileMode = formData.get("inputMode") === "file";
  const jobRole = String(formData.get("jobRole")).trim();
  const selectedComparisonRoles = getSelectedComparisonRoles();
  const comparisonEnabled = compareModeToggle.checked && selectedComparisonRoles.length >= 2;

  try {
    let response;
    let isComparisonMode = false;
    let advancedExplainData = null;
    let advancedCounterfactualData = null;

    if (isFileMode) {
      const file = document.getElementById("resume-file").files[0];
      if (!file) {
        throw new Error("Choose a .txt, .docx, or .pdf file first.");
      }

      const uploadData = new FormData();
      uploadData.append("file", file);
      if (comparisonEnabled) {
        isComparisonMode = true;
        uploadData.append("job_roles", selectedComparisonRoles.join(", "));
        response = await fetch(`${apiBaseUrl}/compare-upload-resume`, {
          method: "POST",
          body: uploadData,
        });
      } else {
        uploadData.append("job_role", jobRole);
        response = await fetch(`${apiBaseUrl}/upload-resume`, {
          method: "POST",
          body: uploadData,
        });
      }
    } else {
      if (comparisonEnabled) {
        isComparisonMode = true;
        response = await fetch(`${apiBaseUrl}/compare-roles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: String(formData.get("resumeText")).trim(),
            job_roles: selectedComparisonRoles,
          }),
        });
      } else {
        const payload = {
          job_role: jobRole,
          resume_text: String(formData.get("resumeText")).trim(),
        };

        const [reportResponse, explainResponse, counterfactualResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/report-from-text`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }),
          fetch(`${apiBaseUrl}/explain`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }),
          fetch(`${apiBaseUrl}/counterfactual`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }),
        ]);

        response = reportResponse;

        const [explainData, counterfactualData] = await Promise.all([
          explainResponse.json(),
          counterfactualResponse.json(),
        ]);

        if (explainResponse.ok) {
          advancedExplainData = explainData;
        }

        if (counterfactualResponse.ok) {
          advancedCounterfactualData = counterfactualData;
        }
      }
    }

    const data = await response.json();
    if (!response.ok) {
      const detail = data?.detail ? JSON.stringify(data.detail) : "Unknown error";
      throw new Error(detail);
    }

    if (Array.isArray(data.comparisons)) {
      renderComparisonReport(data);
    } else {
      renderReport(data);
      if (!isFileMode && !isComparisonMode) {
        renderExplainability(advancedExplainData);
        renderCounterfactuals(advancedCounterfactualData);
      }
    }
    setStatus("Report generated successfully.");
  } catch (error) {
    setStatus(`Request failed: ${getFriendlyErrorMessage(error, isFileMode)}`, true);
  } finally {
    submitButton.disabled = false;
  }
});
