# BiasLens Frontend Demo

This is a lightweight standalone client for the ML service.

## How to use

1. Start the FastAPI app in `ml-service`.
2. Open [index.html](/Users/sayamdas/Documents/Programming/Mern Stack/My Website/BiasLens/frontend-demo/index.html:1) in your browser.
3. Choose either pasted text or file upload mode.
4. In single pasted-text mode, the demo also calls `POST /explain` and `POST /counterfactual` alongside `POST /report-from-text`.
5. In comparison or upload flows, the demo uses the matching report endpoints and hides advanced sections that are not supported by that mode yet.

## Notes

- The default API base URL is `http://127.0.0.1:8000`.
- Supported upload types are `.txt`, `.docx`, and `.pdf`.
- PDF upload requires the backend Python environment to have `pypdf` installed.
- Upload responses can include a short extracted text preview for easier debugging.
- Explainability and counterfactual cards are currently shown for single pasted-text analysis, which maps cleanly to the live backend endpoints.
- This is a prototype UI, not the final Next.js frontend described in `Source/client.md`.
