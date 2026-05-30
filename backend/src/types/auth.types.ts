export type AuthCookieNames = {
  accessTokenCookieName: string;
  refreshTokenCookieName: string;
};

export type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthenticatedUserSnapshot = {
  id: string;
  email: string;
  role: string;
};
