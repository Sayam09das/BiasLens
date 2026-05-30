export const storageMock = {
  saveResumeUpload: async () => ({
    id: "mock-upload-id",
    originalName: "resume.pdf",
    size: 1024,
    mimeType: "application/pdf",
    storage: "mongodb-atlas",
    virusScan: "clean",
  }),
};
