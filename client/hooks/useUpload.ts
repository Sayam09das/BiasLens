import { useState, useCallback } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://biaslens-9wzi.onrender.com";

interface UploadState {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export function useUpload<T = unknown>() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
  });

  const upload = useCallback(
    (path: string, file: File, extraFields?: Record<string, string>) =>
      new Promise<T>((resolve, reject) => {
        const form = new FormData();
        form.append("file", file);
        if (extraFields) {
          Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}${path}`);
        xhr.withCredentials = true;

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setState((s) => ({ ...s, progress: Math.round((e.loaded / e.total) * 100) }));
          }
        };

        xhr.onload = () => {
          setState({ progress: 100, isUploading: false, error: null });
          try {
            resolve(JSON.parse(xhr.responseText)?.data as T);
          } catch {
            reject(new Error("Invalid response"));
          }
        };

        xhr.onerror = () => {
          const msg = "Upload failed";
          setState({ progress: 0, isUploading: false, error: msg });
          reject(new Error(msg));
        };

        setState({ progress: 0, isUploading: true, error: null });
        xhr.send(form);
      }),
    []
  );

  return { ...state, upload };
}
