import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { authConfig } from "../../config/security.js";
import { AUTH_CONSTANTS } from "../../constants/auth.constants.js";
import { successResponse } from "../../utils/api-response.js";
import { authService } from "./auth.service.js";

function setAuthCookies(response: Response, accessToken: string, refreshToken: string): void {
  const baseCookieConfig = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  response.cookie(authConfig.accessTokenCookieName, accessToken, {
    ...baseCookieConfig,
    maxAge: AUTH_CONSTANTS.accessTokenMaxAgeMs,
  });

  response.cookie(authConfig.refreshTokenCookieName, refreshToken, {
    ...baseCookieConfig,
    maxAge: AUTH_CONSTANTS.refreshTokenMaxAgeMs,
  });
}

function clearAuthCookies(response: Response): void {
  response.clearCookie(authConfig.accessTokenCookieName, { path: "/" });
  response.clearCookie(authConfig.refreshTokenCookieName, { path: "/" });
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

  setAuthCookies(response, result.tokens.accessToken, result.tokens.refreshToken);

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Login completed successfully."));
}

export async function refreshTokenController(
  request: Request,
  response: Response
): Promise<void> {
  const refreshToken =
    request.cookies?.[authConfig.refreshTokenCookieName] ??
    request.body?.refreshToken;

  const result = await authService.refreshSession(String(refreshToken ?? ""), request);

  setAuthCookies(response, result.tokens.accessToken, result.tokens.refreshToken);

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
