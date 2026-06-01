"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  FileText,
  FolderSearch2,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormTextarea } from "@/components/ui/form";
import { useUpload } from "@/hooks/useUpload";
import { useAuditStore } from "@/store/audit.store";
import type { Audit } from "@/store/audit.store";

type AcceptedDoc =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type UploadErrors = {
  resume?: string;
  jobDescription?: string;
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFileKind(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "PDF";
  if (name.endsWith(".docx")) return "DOCX";
  return "Document";
}

function validateResume(file: File) {
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

export default function ResumeUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [errors, setErrors] = useState<UploadErrors>({});
  const [isDragActive, setIsDragActive] = useState(false);
  const { upload, isUploading, progress, error: uploadError } = useUpload<{ id: string; url: string }>();
  const { createAudit } = useAuditStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobDescriptionMaxChars = 12_000;
  const resumeValidation = useMemo(
    () => (resumeFile ? validateResume(resumeFile) : null),
    [resumeFile],
  );

  const remainingChars = jobDescriptionMaxChars - jobDescription.length;

  const onDrop = (file: File | null) => {
    if (!file) return;

    const validation = validateResume(file);

    if (!validation.ok) {
      setErrors((prev) => ({
        ...prev,
        resume: !validation.okType
          ? "Resume must be a PDF or DOCX."
          : `Resume must be at most ${formatBytes(validation.maxSizeBytes)}.`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResumeFile(file);
    setResumePreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  };

  const removeResume = () => {
    setResumeFile(null);
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResumePreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
  };

  const validate = () => {
    const next: UploadErrors = {};

    if (!resumeFile) {
      next.resume = "Please add a resume to start the audit.";
    } else if (!resumeValidation?.ok) {
      next.resume = "Resume needs attention before audit.";
    }

    if (!jobDescription.trim()) {
      next.jobDescription = "Add a job description to improve audit accuracy.";
    } else if (jobDescription.trim().length > jobDescriptionMaxChars) {
      next.jobDescription = `Job description exceeds ${jobDescriptionMaxChars.toLocaleString()} characters.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleStartAudit = async () => {
    if (isSubmitting || isUploading || !validate()) return;
    setIsSubmitting(true);

    try {
      // 1. Upload the file to get a stored reference
      let resumeText = "";
      if (resumeFile) {
        await upload("/v1/upload/resume", resumeFile);
      }

      // 2. Create the audit record on the backend
      const audit: Audit = await createAudit({
        title: resumeFile?.name ?? `Audit ${Date.now()}`,
        resumeText: resumeText || jobDescription,
        jobRole: jobDescription.trim().slice(0, 120) || undefined,
      });

      router.push(`/dashboard/audits/${audit.id}`);
    } catch {
      setErrors((prev) => ({ ...prev, resume: "Upload failed. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-0">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
          New Audit
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
          Upload resumes and kick off a fairness audit
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#6E6D7A]">
          Start with a clean resume file and the role brief. BiasLens will score evidence strength, surface explainability, and flag fairness risk before review.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <Card className="rounded-4xl border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">
                  Resume uploader
                </h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Drag a file here or browse for a validated PDF or DOCX.
                </p>
              </div>
              <span className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                PDF, DOCX • Max 10MB
              </span>
            </div>

            <div
              className="mt-4 rounded-[1.5rem] border border-dashed border-[#BFDBFE] bg-[linear-gradient(180deg,rgba(239,246,255,0.72)_0%,rgba(255,255,255,0.55)_100%)] p-8 transition hover:border-[#2563EB]/40"
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragActive(false);
                onDrop(event.dataTransfer.files?.[0] ?? null);
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
                onChange={(event) => {
                  onDrop(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
                className="sr-only"
              />

              <div className="flex flex-col items-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-[1.5rem] border border-[#BFDBFE] bg-white/70">
                  <Upload size={20} className="text-[#2563EB]" />
                </div>
                <p className="mt-4 text-lg font-semibold text-[#0D0C22]">
                  {isDragActive ? "Drop the resume here" : "Drag and drop a resume"}
                </p>
                <p className="mt-2 max-w-md text-sm text-[#6E6D7A]">
                  We validate file type, size, and preview availability before the audit begins.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-[1.25rem]"
                    onClick={() => inputRef.current?.click()}
                  >
                    <FolderSearch2 size={18} />
                    <span className="ml-2">Choose file</span>
                  </Button>
                  <Button className="rounded-[1.25rem]" onClick={() => inputRef.current?.click()}>
                    Browse documents
                  </Button>
                </div>

                {errors.resume ? (
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#B91C1C]">
                    <AlertCircle size={16} />
                    <span>{errors.resume}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="rounded-4xl border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">
                  Resume preview
                </h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Check the selected file before sending it to the audit pipeline.
                </p>
              </div>
              {resumeFile ? (
                <Button
                  variant="ghost"
                  className="rounded-[1.25rem] text-[#B91C1C] hover:bg-[#FEF2F2]"
                  onClick={removeResume}
                >
                  <X size={16} />
                </Button>
              ) : null}
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-5">
              {resumeFile ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EFF6FF]">
                      <FileText size={18} className="text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0D0C22]">
                        {resumeFile.name}
                      </p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">
                        {getFileKind(resumeFile)} • {formatBytes(resumeFile.size)}
                      </p>
                      <p className="mt-2 text-xs font-medium text-[#2563EB]">
                        Ready for audit
                      </p>
                    </div>
                  </div>
                  {resumePreviewUrl ? (
                    <Button asChild variant="outline" className="rounded-[1.25rem]">
                      <a href={resumePreviewUrl} target="_blank" rel="noreferrer">
                        Open preview
                      </a>
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F6F8FB]">
                    <FileText size={18} className="text-[#6E6D7A]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">
                      No resume selected
                    </p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">
                      Add a candidate file to generate explainable screening insights.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-4xl border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#0D0C22]">
                  Job description
                </h2>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Paste the role brief so the audit can grade evidence against real requirements.
                </p>
              </div>
              <span className="rounded-full border border-[#E7E7E9] bg-white/70 px-3 py-1 text-xs font-semibold text-[#6E6D7A]">
                Required
              </span>
            </div>

            <div className="mt-4">
              <FormTextarea
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  if (errors.jobDescription) {
                    setErrors((prev) => ({ ...prev, jobDescription: undefined }));
                  }
                }}
                placeholder="Paste the responsibilities, must-have skills, and any review constraints for this role..."
                className="min-h-[180px] resize-none rounded-[1.5rem] border-[#E7E7E9] bg-white/80"
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <p
                  className={`text-xs ${remainingChars < 0 ? "text-[#B91C1C]" : "text-[#6E6D7A]"}`}
                >
                  {remainingChars.toLocaleString()} characters remaining
                </p>
                <Button
                  variant="ghost"
                  className="h-8 rounded-2xl px-3 text-[#2563EB]"
                  onClick={() =>
                    setJobDescription(
                      "We are hiring a senior frontend engineer with experience in React, accessibility, design systems, analytics, and cross-functional product delivery. Candidates should show measurable impact, clear communication, and structured collaboration with design and backend teams.",
                    )
                  }
                >
                  Use sample
                </Button>
              </div>

              {errors.jobDescription ? (
                <p className="mt-3 text-sm font-medium text-[#B91C1C]">
                  {errors.jobDescription}
                </p>
              ) : null}
            </div>
          </Card>

          <Card className="overflow-hidden rounded-4xl border-[#DBEAFE] bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)] p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
              <Sparkles size={16} />
              Premium audit flow
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
              Explainability, fairness checks, and report export in one run
            </h3>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-white/80 bg-white/70 p-4">
                <ShieldCheck size={18} className="mt-0.5 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Fairness-aware scoring
                  </p>
                  <p className="mt-1 text-sm text-[#45628F]">
                    Counterfactual and formatting sensitivity checks are included automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-white/80 bg-white/70 p-4">
                <Sparkles size={18} className="mt-0.5 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Review-ready explanation
                  </p>
                  <p className="mt-1 text-sm text-[#45628F]">
                    Every score includes evidence-backed reasoning and recommended follow-up actions.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="mt-5 h-12 w-full rounded-[1.5rem]"
              onClick={handleStartAudit}
              disabled={isSubmitting || isUploading}
            >
              {isUploading
                ? `Uploading… ${progress}%`
                : isSubmitting
                  ? "Starting audit..."
                  : "Start Audit"}
            </Button>
            {uploadError && (
              <p className="mt-2 text-center text-xs text-[#b91c1c]">{uploadError}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
