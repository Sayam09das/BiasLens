export const mlClientMock = {
  getHealth: async () => ({ status: "ok" }),
  predict: async () => ({ prediction: "Hire", probabilities: { Hire: 0.91, Reject: 0.09 } }),
  explain: async () => ({ method: "tree_shap", available: true }),
};
