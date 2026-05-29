const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export function isAllowedResumeMimeType(mimeType: string): boolean {
  return ALLOWED_RESUME_TYPES.has(mimeType);
}

export function isWithinFileSizeLimit(size: number): boolean {
  return size <= MAX_RESUME_SIZE_BYTES;
}

export function getAllowedResumeMimeTypes(): string[] {
  return [...ALLOWED_RESUME_TYPES];
}
