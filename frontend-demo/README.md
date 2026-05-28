# BiasLens Frontend Demo

This is a lightweight standalone client for the ML service.

## How to use

1. Start the FastAPI app in `ml-service`.
2. Open [index.html](/Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/frontend-demo/index.html:1) in your browser.
3. Choose either pasted text or file upload mode.
4. Submit to `POST /report-from-text`, `POST /upload-resume`, `POST /compare-roles`, or `POST /compare-upload-resume` depending on the selected mode and roles.

## Notes

- The default API base URL is `http://127.0.0.1:8000`.
- Supported upload types are `.txt`, `.docx`, and `.pdf`.
- PDF upload requires the backend Python environment to have `pypdf` installed.
- Upload responses can include a short extracted text preview for easier debugging.
- This is a prototype UI, not the final Next.js frontend described in `Source/client.md`.
