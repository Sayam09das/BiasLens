import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma.js";
import { authConfig } from "../../config/security.js";
import { AUTH_CONSTANTS } from "../../constants/auth.constants.js";
import type { AuthenticatedRequestUser } from "../../middleware/auth.middleware.js";
import { userSelect } from "../../models/user.model.js";
import { ForbiddenError } from "../../utils/errors.js";
import { successResponse } from "../../utils/api-response.js";
import { authService } from "./auth.service.js";

function setAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
  rememberMe = false,
): void {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite: "lax" | "none" = isProduction ? "none" : "lax";
  const baseCookieConfig = {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    path: "/",
  };
  const refreshTokenMaxAge = rememberMe
    ? AUTH_CONSTANTS.rememberMeRefreshTokenMaxAgeMs
    : AUTH_CONSTANTS.refreshTokenMaxAgeMs;

  response.cookie(authConfig.accessTokenCookieName, accessToken, {
    ...baseCookieConfig,
    maxAge: AUTH_CONSTANTS.accessTokenMaxAgeMs,
  });

  response.cookie(authConfig.refreshTokenCookieName, refreshToken, {
    ...baseCookieConfig,
    maxAge: refreshTokenMaxAge,
  });
}

function clearAuthCookies(response: Response): void {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite: "lax" | "none" = isProduction ? "none" : "lax";
  const cookieOptions = {
    path: "/",
    sameSite,
    secure: isProduction,
  };

  response.clearCookie(authConfig.accessTokenCookieName, cookieOptions);
  response.clearCookie(authConfig.refreshTokenCookieName, cookieOptions);
}

function getAuthenticatedUser(response: Response): AuthenticatedRequestUser {
  const authUser = response.locals.authUser as AuthenticatedRequestUser | undefined;

  if (!authUser) {
    throw new ForbiddenError("Authenticated user context is missing.");
  }

  return authUser;
}

export async function registerController(request: Request, response: Response): Promise<void> {
  const result = await authService.register(request.body, request);

  response
    .status(StatusCodes.CREATED)
    .json(
      successResponse(
        result,
        "Registration completed successfully. Please verify your email before logging in."
      )
    );
}

export async function verifyEmailController(request: Request, response: Response): Promise<void> {
  const result = await authService.verifyEmail(String(request.query.token ?? ""));

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Email verified successfully."));
}

export async function resendVerificationController(
  request: Request,
  response: Response
): Promise<void> {
  const result = await authService.resendVerificationEmail(String(request.body?.email ?? ""), request);

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Verification email sent successfully."));
}

export async function loginController(request: Request, response: Response): Promise<void> {
  const result = await authService.login(request.body, request);

  setAuthCookies(
    response,
    result.tokens.accessToken,
    result.tokens.refreshToken,
    result.session.rememberMe,
  );

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Login completed successfully."));
}

export async function currentSessionController(
  _request: Request,
  response: Response
): Promise<void> {
  const authUser = getAuthenticatedUser(response);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: userSelect,
  });

  if (!user) {
    throw new ForbiddenError("Authenticated user no longer exists.");
  }

  response
    .status(StatusCodes.OK)
    .json(successResponse({ user }, "Current session loaded successfully."));
}

export async function refreshTokenController(
  request: Request,
  response: Response
): Promise<void> {
  const refreshToken =
    request.cookies?.[authConfig.refreshTokenCookieName] ??
    request.body?.refreshToken;

  const result = await authService.refreshSession(String(refreshToken ?? ""), request);

  setAuthCookies(
    response,
    result.tokens.accessToken,
    result.tokens.refreshToken,
    result.session.rememberMe,
  );

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Access token refreshed successfully."));
}

export async function logoutController(request: Request, response: Response): Promise<void> {
  const refreshToken =
    request.cookies?.[authConfig.refreshTokenCookieName] ??
    request.body?.refreshToken;

  await authService.logout(refreshToken);
  clearAuthCookies(response);

  response
    .status(StatusCodes.OK)
    .json(successResponse({ loggedOut: true }, "Logout completed successfully."));
}

export async function forgotPasswordController(
  request: Request,
  response: Response
): Promise<void> {
  const result = await authService.forgotPassword(String(request.body?.email ?? ""), request);

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "If the account exists, a reset email has been sent."));
}

export async function resetPasswordController(
  request: Request,
  response: Response
): Promise<void> {
  const result = await authService.resetPassword(request.body);

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Password reset successfully. Please log in again."));
}
