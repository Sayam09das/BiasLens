"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  NotebookPen,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/ui/form";

function Badge({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}): React.ReactElement {

  return (
    <span
      className={
        className ??
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      }
      style={style}
    >
      {children}
    </span>
  );
}



const PRIMARY_BLUE = "#2563EB";
const MUTED = "#6E6D7A";
const DANGER = "#EF4444";


type AcceptedDoc = "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type UploadErrors = {
  resume?: string;
  jobDescription?: string;
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let num = bytes;
  while (num >= 1024 && i < units.length - 1) {
    num /= 1024;
    i += 1;
  }
  return `${num.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getFileKind(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "PDF";
  if (name.endsWith(".docx")) return "DOCX";
  return "Document";
}

function isAcceptedResume(file: File) {
  const maxSizeBytes = 10 * 1024 * 1024;
  const acceptedTypes: AcceptedDoc[] = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const okType = acceptedTypes.includes(file.type as AcceptedDoc);
  const okSize = file.size <= maxSizeBytes;

  return {
    ok: okType && okSize,
    okType,
    okSize,
    maxSizeBytes,
  };
}

export default function UploadAuditPage() {
  const router = useRouter();

  const jobDescriptionMaxChars = 12_000;

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);

  const [jobDescription, setJobDescription] = useState<string>("");
  const [errors, setErrors] = useState<UploadErrors>({});

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const supportedFormatsText = "PDF, DOCX";
  const maxSizeText = "10MB";

  const resumeValidation = useMemo(() => {
    if (!resumeFile) return null;
    return isAcceptedResume(resumeFile);
  }, [resumeFile]);

  const validate = () => {
    const next: UploadErrors = {};

    if (!resumeFile) {
      next.resume = "Please add a resume to start the audit.";
    } else if (!resumeValidation?.ok) {
      if (!resumeValidation?.okType) next.resume = "Resume must be a PDF or DOCX.";
      else if (!resumeValidation?.okSize)
        next.resume = `Resume must be at most ${formatBytes(resumeValidation.maxSizeBytes)}.`;
      else next.resume = "Resume file is not supported.";
    }

    const jd = jobDescription.trim();
    if (!jd) {
      next.jobDescription = "Add a job description (paste text or provide requirements).";
    } else if (jd.length > jobDescriptionMaxChars) {
      next.jobDescription = `Job description is too long (max ${jobDescriptionMaxChars.toLocaleString()} chars).`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onDrop = (acceptedFiles: File[], rejectedFiles: File[]) => {
    const nextErrors: UploadErrors = {};

    if (rejectedFiles?.length) {
      // Only show one top-level message for resume errors.
      nextErrors.resume = "Unsupported resume format or file too large.";
    }

    const file = acceptedFiles?.[0];
    if (file) {
      const v = isAcceptedResume(file);
      if (!v.ok) {
        if (!v.okType) nextErrors.resume = "Resume must be a PDF or DOCX.";
        else if (!v.okSize)
          nextErrors.resume = `Resume must be at most ${formatBytes(v.maxSizeBytes)}.`;
      } else {
        // Revoke old preview URL.
        setErrors((prev) => ({ ...prev, resume: undefined }));
        setResumeFile(file);
        setResumePreviewUrl((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return URL.createObjectURL(file);
        });
        return;
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
  };

  const [isDragActive, setIsDragActive] = useState(false);

  const handlePickResume = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    onDrop(Array.from(files), []);

    // allow re-select same file
    e.target.value = "";
  };


  const progressLabel = uploadProgress >= 100 ? "Finalizing" : "Uploading";

  const handleStartAudit = async () => {
    if (isUploading) return;
    const ok = validate();
    if (!ok) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulated upload/progress (production would use fetch + xhr upload progress).
    const startedAt = Date.now();

    await new Promise<void>((resolve) => {
      const tick = () => {
        const elapsed = Date.now() - startedAt;
        const pct = Math.min(95, Math.round((elapsed / 1600) * 95));
        setUploadProgress(pct);

        if (pct >= 95) {
          resolve();
          return;
        }
        window.setTimeout(tick, 120);
      };
      tick();
    });

    setUploadProgress(100);

    // After completion, navigate to audit page.
    // In production, you would receive auditId from API.
    router.push("/dashboard/audit");
  };

  const removeResume = () => {
    setResumeFile(null);
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResumePreviewUrl((prevUrl) => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
  };

  const remainingChars = jobDescriptionMaxChars - jobDescription.length;

  return (
    <div className="mx-auto max-w-6xl px-0" role="main">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
          New Audit
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
          Upload resumes & job description
        </h1>
        <p className="mt-2 text-sm text-[#6E6D7A]">
          Start an enterprise-grade audit with validation, previews, and premium progress UX.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Upload Zone */}
        <div className="space-y-5">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">Upload Zone</h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Drag & drop your resume here, or choose a file.
                </p>
              </div>
              <Badge
                className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] text-[#2563EB]"
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                }}
              >
                Supported: {supportedFormatsText} • Max {maxSizeText}
              </Badge>
            </div>

            <div
              className="mt-4 rounded-[1.5rem] border border-dashed border-[#DBEAFE] bg-[linear-gradient(180deg,rgba(239,246,255,0.65)_0%,rgba(255,255,255,0.55)_100%)] p-6 transition hover:border-[#2563EB]/40"
              role="region"
              aria-label="Resume upload zone"
              onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragActive(false);

                const files = e.dataTransfer?.files;
                if (!files || files.length === 0) return;

                onDrop(Array.from(files), []);
              }}
            >
              <input
                type="file"
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
                onChange={handleFileInputChange}
                ref={fileInputRef}
                className="sr-only"
                aria-label="Choose resume file"
              />


              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{
                    background: "rgba(37,99,235,0.10)",
                    border: "1px solid rgba(37,99,235,0.20)",
                  }}
                >
                  <Upload size={18} color={PRIMARY_BLUE} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    {isDragActive ? "Drop your resume" : "Drag & drop Resume"}

                  </p>
                  <p className="mt-1 text-xs text-[#6E6D7A]">
                    PDF or DOCX only. No scripts. No password-protected files.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-[#DBEAFE] bg-white/70 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePickResume();
                    }}
                  >
                    Choose file
                  </Button>

                  <Button
                    type="button"
                    className="rounded-2xl bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePickResume();
                    }}
                  >
                    Browse
                  </Button>
                </div>

                <AnimatePresence>
                  {errors.resume ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="mt-2 flex items-start gap-2 text-left"
                    >
                      <AlertCircle size={16} color={DANGER} aria-hidden="true" />
                      <p className="text-xs text-[#B91C1C]">{errors.resume}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </Card>

          {/* Resume Preview */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">Resume Preview</h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  We’ll validate before starting your audit.
                </p>
              </div>

              {resumeFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-2xl text-[#B91C1C] hover:bg-red-50"
                  onClick={removeResume}
                  aria-label="Remove resume"
                >
                  <X size={16} aria-hidden="true" />
                </Button>
              ) : null}
            </div>

            <div className="mt-4">
              {!resumeFile ? (
                <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/50 p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-2xl"
                      style={{ background: "rgba(13,12,34,0.03)" }}
                    >
                      <FileText size={18} color={MUTED} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0D0C22]">No resume selected</p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">
                        Add a resume to generate explainable AI insights.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[#E7E7E9] bg-white/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-2xl"
                      style={{ background: "rgba(37,99,235,0.10)", border: "1px solid rgba(37,99,235,0.20)" }}
                    >
                      <FileText size={18} color={PRIMARY_BLUE} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0D0C22]">
                        {resumeFile.name}
                      </p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">
                        {getFileKind(resumeFile)} • {formatBytes(resumeFile.size)}
                      </p>
                      {resumeValidation && !resumeValidation.ok ? (
                        <p className="mt-2 text-xs font-medium text-[#B91C1C]">
                          Resume needs attention before upload.
                        </p>
                      ) : (
                        <p className="mt-2 text-xs font-medium text-[#2563EB]">
                          Ready for audit
                        </p>
                      )}
                    </div>
                  </div>

                  {resumePreviewUrl ? (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-[#DBEAFE] bg-white/70 hover:bg-white"
                        onClick={() => {
                          window.open(resumePreviewUrl, "_blank", "noopener,noreferrer");
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Job Description + Configuration */}
        <div className="space-y-5">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">Job Description</h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Paste requirements to improve audit accuracy.
                </p>
              </div>
              <Badge
                className="rounded-full border border-[#E7E7E9] bg-white/60 text-[#6E6D7A]"
                style={{ fontWeight: 700 }}
              >
                Text input
              </Badge>
            </div>

            <div className="mt-4">
              <label className="sr-only" htmlFor="jobDescription">
                Job description
              </label>
              <FormTextarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const next = e.target.value;
                  setJobDescription(next);
                  if (errors.jobDescription) setErrors((prev) => ({ ...prev, jobDescription: undefined }));
                }}
                placeholder="Paste the job description requirements (role, responsibilities, constraints, preferred qualifications)..."
                className="min-h-[160px] resize-none rounded-[1.25rem] border-[#E7E7E9] bg-white/70 text-[#0D0C22] placeholder:text-[#6E6D7A]"
                maxLength={jobDescriptionMaxChars + 5000}
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-[#6E6D7A]">
                  {remainingChars >= 0 ? (
                    <span>
                      {remainingChars.toLocaleString()} chars remaining
                    </span>
                  ) : (
                    <span className="text-[#B91C1C]">Over limit</span>
                  )}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 rounded-2xl px-3 text-[#2563EB] hover:bg-[#EFF6FF]"
                  onClick={() => {
                    const sample =
                      "We are seeking a candidate with 3+ years of experience in analytics, fairness-aware evaluation, and responsible hiring practices. Must be able to communicate clearly, work cross-functionally, and demonstrate attention to compliance. Preferred: knowledge of bias mitigation techniques and explainable AI tools.";
                    setJobDescription(sample);
                    setErrors((prev) => ({ ...prev, jobDescription: undefined }));
                  }}
                  aria-label="Use sample job description"
                >
                  Use sample
                </Button>
              </div>

              <AnimatePresence>
                {errors.jobDescription ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-2 flex items-start gap-2 text-left"
                  >
                    <AlertCircle size={16} color={DANGER} aria-hidden="true" />
                    <p className="text-xs text-[#B91C1C]">{errors.jobDescription}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">Audit Configuration</h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Premium defaults for explainable AI insights.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="rounded-2xl px-3 text-[#2563EB] hover:bg-[#EFF6FF]"
                onClick={() => setDetailsOpen((v) => !v)}
                aria-expanded={detailsOpen}
              >
                {detailsOpen ? "Hide" : "Details"}
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <NotebookPen size={16} aria-hidden="true" style={{ color: PRIMARY_BLUE }} />
                  <p className="text-sm font-semibold text-[#0D0C22]">Explainability</p>
                </div>
                <Badge className="rounded-full bg-[#EFF6FF] text-[#2563EB]" style={{ fontWeight: 700 }}>
                  On
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} aria-hidden="true" style={{ color: PRIMARY_BLUE }} />
                  <p className="text-sm font-semibold text-[#0D0C22]">Fairness signals</p>
                </div>
                <Badge className="rounded-full bg-[#EFF6FF] text-[#2563EB]" style={{ fontWeight: 700 }}>
                  Enabled
                </Badge>
              </div>

              <AnimatePresence>
                {detailsOpen ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3"
                  >
                    <p className="text-xs font-semibold text-[#0D0C22]">What happens next</p>
                    <ul className="mt-2 list-disc pl-5 text-xs text-[#6E6D7A]">
                      <li>Resume and job description are validated for compatibility.</li>
                      <li>BiasLens extracts key signals and explainable features.</li>
                      <li>Audit runs with deterministic thresholds for consistent reporting.</li>
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Progress */}
              <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#0D0C22]">Upload progress</p>
                  <p className="text-xs font-medium text-[#6E6D7A]">{progressLabel}</p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0D0C22]/[0.06]" aria-hidden="true">
                  <motion.div
                    initial={false}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ type: "tween", duration: 0.18 }}
                    className="h-full rounded-full bg-[#2563EB]"
                  />
                </div>
                <p className="mt-2 text-xs text-[#6E6D7A]" aria-live="polite">
                  {isUploading ? `${uploadProgress}%` : "—"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                onClick={handleStartAudit}
                disabled={isUploading}
                className="h-12 w-full rounded-[1.5rem] bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-60 disabled:hover:bg-[#2563EB]"
              >
                {isUploading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Starting Audit…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Start Audit
                    <ArrowRight size={18} aria-hidden="true" />
                  </span>
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-[#6E6D7A]">
                By continuing, you agree to BiasLens processing for explainability and fairness insights.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Hidden accessiblity helpers */}
      <div className="sr-only" aria-live="polite">
        {isUploading ? `Uploading. ${uploadProgress} percent complete.` : "Ready to start audit."}
      </div>
    </div>
  );
}

