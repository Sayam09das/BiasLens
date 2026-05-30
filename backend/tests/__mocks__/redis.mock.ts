export const redisMock = {
  get: async (_key: string) => null,
  set: async (_key: string, _value: string) => "OK",
  del: async (_key: string) => 1,
  isReady: true,
};
