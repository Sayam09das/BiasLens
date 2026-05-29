import jwt, { type SignOptions } from "jsonwebtoken";

import { authConfig } from "../../config/security.js";
import { AUTH_CONSTANTS } from "../../constants/auth.constants.js";
import { UnauthorizedError } from "../../utils/errors.js";

type TokenType = "access" | "refresh";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
  type: TokenType;
};

function getSecret(tokenType: TokenType): string {
  return tokenType === "access" ? authConfig.accessSecret : authConfig.refreshSecret;
}

function getExpiresIn(tokenType: TokenType): SignOptions["expiresIn"] {
  return tokenType === "access"
    ? AUTH_CONSTANTS.accessTokenTtl
    : AUTH_CONSTANTS.refreshTokenTtl;
}

function signToken(
  payload: Omit<AuthTokenPayload, "type">,
  tokenType: TokenType
): string {
  return jwt.sign(
    {
      ...payload,
      type: tokenType,
    },
    getSecret(tokenType),
    {
      expiresIn: getExpiresIn(tokenType),
      subject: payload.sub,
    }
  );
}

export const tokenService = {
  generateAccessToken(payload: Omit<AuthTokenPayload, "type">): string {
    return signToken(payload, "access");
  },

  generateRefreshToken(payload: Omit<AuthTokenPayload, "type">): string {
    return signToken(payload, "refresh");
  },

  verifyToken(token: string, tokenType: TokenType): AuthTokenPayload {
    try {
      return jwt.verify(token, getSecret(tokenType)) as AuthTokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid or expired token.");
    }
  },
};
