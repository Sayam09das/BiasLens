import type { Request } from "express";
import type { Prisma } from "@prisma/client";

import { sendTransactionalEmail } from "../../config/brevo.js";
import { prisma } from "../../config/prisma.js";
import { AUTH_AUDIT_ACTIONS } from "../../constants/audit.constants.js";
import { AUTH_CONSTANTS } from "../../constants/auth.constants.js";
import { userSelect } from "../../models/user.model.js";
import { auditLogService } from "../audit/audit-log.service.js";
import {
  generateSecureToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../../utils/crypto.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../utils/errors.js";
import {
  renderPasswordResetEmailTemplate,
  renderVerificationEmailTemplate,
} from "./auth.mail-templates.js";
import { getPasswordPolicyIssues } from "./auth.password-policy.js";
import { tokenService } from "./token.service.js";

type RegisterInput = {
  email?: string;
  password?: string;
  fullName?: string;
  role?: string;
};

type LoginInput = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

type ResetPasswordInput = {
  token?: string;
  password?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertEmail(email?: string): string {
  if (!email || !email.includes("@")) {
    throw new ValidationError("A valid email is required.");
  }

  return normalizeEmail(email);
}

function assertPassword(password?: string, email?: string): string {
  if (!password) {
    throw new ValidationError("Password is required.");
  }

  const issues = getPasswordPolicyIssues(password, email);

  if (issues.length > 0) {
    throw new ValidationError("Password does not meet security requirements.", issues);
  }

  return password;
}

function assertFullName(fullName?: string): string {
  if (!fullName || fullName.trim().length < 2) {
    throw new ValidationError("Full name must be at least 2 characters long.");
  }

  return fullName.trim();
}

function getRequestMetadata(request: Request) {
  return {
    userAgent: request.get("user-agent") ?? null,
    ipAddress: request.ip ?? request.socket.remoteAddress ?? null,
  };
}

function getBaseUrl(request: Request): string {
  return `${request.protocol}://${request.get("host")}`;
}

function getClientOrigin(request: Request): string {
  return process.env.CLIENT_ORIGIN?.trim() || getBaseUrl(request);
}

function buildJwtPayload(user: { id: string; email: string; role: string }) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
}

async function sendVerificationEmail(input: {
  email: string;
  fullName: string;
  token: string;
  request: Request;
}) {
  const verificationUrl = `${getBaseUrl(input.request)}/v1/auth/verify-email?token=${input.token}`;
  const template = renderVerificationEmailTemplate({
    recipientName: input.fullName,
    actionUrl: verificationUrl,
  });

  await sendTransactionalEmail({
    to: { email: input.email, name: input.fullName },
    subject: template.subject,
    htmlContent: template.html,
    textContent: template.text,
  });
}

async function sendPasswordResetEmail(input: {
  email: string;
  fullName: string;
  token: string;
  request: Request;
}) {
  const resetUrl = `${getClientOrigin(input.request)}/reset-password?token=${input.token}`;
  const template = renderPasswordResetEmailTemplate({
    recipientName: input.fullName,
    actionUrl: resetUrl,
  });

  await sendTransactionalEmail({
    to: { email: input.email, name: input.fullName },
    subject: template.subject,
    htmlContent: template.html,
    textContent: template.text,
  });
}

export const authService = {
  async register(input: RegisterInput, request: Request) {
    const email = assertEmail(input.email);
    const password = assertPassword(input.password, email);
    const fullName = assertFullName(input.fullName);
    const role = input.role?.trim() || "user";

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictError("An account with this email already exists.");
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = generateSecureToken();

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
        role,
        emailVerificationTokenHash: hashToken(verificationToken),
        emailVerificationTokenExpiresAt: new Date(
          Date.now() + AUTH_CONSTANTS.emailVerificationTtlMs
        ),
      },
      select: userSelect,
    });

    await sendVerificationEmail({
      email: user.email,
      fullName: user.fullName,
      token: verificationToken,
      request,
    });

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.REGISTERED,
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      metadata: {
        email: user.email,
        role: user.role,
      },
    });

    return {
      user,
      verification: {
        emailSent: true,
      },
    };
  },

  async verifyEmail(token?: string) {
    if (!token) {
      throw new ValidationError("Verification token is required.");
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: hashToken(token),
        emailVerificationTokenExpiresAt: {
          gt: new Date(),
        },
      },
      select: { id: true },
    });

    if (!user) {
      throw new ValidationError("Verification token is invalid or expired.");
    }

    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
      select: userSelect,
    });

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.EMAIL_VERIFIED,
      entityType: "User",
      entityId: verifiedUser.id,
      userId: verifiedUser.id,
      metadata: {
        email: verifiedUser.email,
      },
    });

    return verifiedUser;
  },

  async resendVerificationEmail(email: string, request: Request) {
    const normalizedEmail = assertEmail(email);
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundError("No user found for that email.");
    }

    if (user.emailVerified) {
      throw new ValidationError("This email is already verified.");
    }

    const verificationToken = generateSecureToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationTokenHash: hashToken(verificationToken),
        emailVerificationTokenExpiresAt: new Date(
          Date.now() + AUTH_CONSTANTS.emailVerificationTtlMs
        ),
      },
    });

    await sendVerificationEmail({
      email: user.email,
      fullName: user.fullName,
      token: verificationToken,
      request,
    });

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.VERIFICATION_RESENT,
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      metadata: {
        email: user.email,
      },
    });

    return { emailSent: true };
  },

  async login(input: LoginInput, request: Request) {
    const email = assertEmail(input.email);
    const password = assertPassword(input.password);
    const rememberMe = Boolean(input.rememberMe);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);

    if (!passwordMatches || !user.isActive) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (!user.emailVerified) {
      throw new ForbiddenError("Please verify your email before logging in.");
    }

    const refreshToken = tokenService.generateRefreshToken(buildJwtPayload(user), rememberMe);
    const accessToken = tokenService.generateAccessToken(buildJwtPayload(user));
    const metadata = getRequestMetadata(request);
    const sessionMaxAgeMs = rememberMe
      ? AUTH_CONSTANTS.rememberMeSessionTimeoutMs
      : AUTH_CONSTANTS.sessionTimeoutMs;

    const sessionCreateData: Prisma.SessionUncheckedCreateInput = {
      userId: user.id,
      refreshTokenHash: hashToken(refreshToken),
      rememberMe,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      expiresAt: new Date(Date.now() + sessionMaxAgeMs),
    };

    await prisma.session.create({
      data: sessionCreateData,
    });

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.LOGIN_SUCCEEDED,
      entityType: "Session",
      entityId: user.id,
      userId: user.id,
      metadata: {
        email: user.email,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
      session: {
        rememberMe,
      },
    };
  },

  async refreshSession(refreshToken: string, request: Request) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required.");
    }

    const payload = tokenService.verifyToken(refreshToken, "refresh");
    const refreshTokenHash = hashToken(refreshToken);

    const session = await prisma.session.findFirst({
      where: {
        userId: payload.sub,
        refreshTokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session?.user || !session.user.isActive || !session.user.emailVerified) {
      throw new UnauthorizedError("Refresh token is invalid or expired.");
    }

    const rememberMe = Boolean((session as { rememberMe?: boolean | null }).rememberMe);
    const sessionMaxAgeMs = rememberMe
      ? AUTH_CONSTANTS.rememberMeSessionTimeoutMs
      : AUTH_CONSTANTS.sessionTimeoutMs;
    const nextRefreshToken = tokenService.generateRefreshToken(buildJwtPayload(session.user), rememberMe);
    const nextAccessToken = tokenService.generateAccessToken(buildJwtPayload(session.user));
    const metadata = getRequestMetadata(request);
    const nextSessionCreateData: Prisma.SessionUncheckedCreateInput = {
      userId: session.user.id,
      refreshTokenHash: hashToken(nextRefreshToken),
      rememberMe,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      expiresAt: new Date(Date.now() + sessionMaxAgeMs),
    };

    await prisma.$transaction([
      prisma.session.delete({
        where: { id: session.id },
      }),
      prisma.session.create({
        data: nextSessionCreateData,
      }),
    ]);

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.TOKEN_REFRESHED,
      entityType: "Session",
      entityId: session.id,
      userId: session.user.id,
      metadata: {
        email: session.user.email,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.fullName,
        role: session.user.role,
        isActive: session.user.isActive,
        emailVerified: session.user.emailVerified,
      },
      tokens: {
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
      },
      session: {
        rememberMe,
      },
    };
  },

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    let payloadUserId: string | null = null;

    try {
      payloadUserId = tokenService.verifyToken(refreshToken, "refresh").sub;
    } catch {
      payloadUserId = null;
    }

    await prisma.session.deleteMany({
      where: {
        refreshTokenHash: hashToken(refreshToken),
      },
    });

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.LOGOUT_SUCCEEDED,
      entityType: "Session",
      entityId: payloadUserId,
      userId: payloadUserId,
      metadata: {
        tokenCleared: true,
      },
    });
  },

  async forgotPassword(email: string, request: Request) {
    const normalizedEmail = assertEmail(email);
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    if (!user) {
      return { emailSent: true };
    }

    const resetToken = generateSecureToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: hashToken(resetToken),
        passwordResetTokenExpiresAt: new Date(Date.now() + AUTH_CONSTANTS.passwordResetTtlMs),
      },
    });

    await sendPasswordResetEmail({
      email: user.email,
      fullName: user.fullName,
      token: resetToken,
      request,
    });

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.PASSWORD_RESET_REQUESTED,
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      metadata: {
        email: user.email,
      },
    });

    return { emailSent: true };
  },

  async resetPassword(input: ResetPasswordInput) {
    const token = input.token?.trim();

    if (!token) {
      throw new ValidationError("Reset token is required.");
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: hashToken(token),
        passwordResetTokenExpiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ValidationError("Reset token is invalid or expired.");
    }

    const userWithEmail = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        email: true,
      },
    });

    const password = assertPassword(input.password, userWithEmail?.email);

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetTokenHash: null,
          passwordResetTokenExpiresAt: null,
        },
      }),
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    await auditLogService.record({
      action: AUTH_AUDIT_ACTIONS.PASSWORD_RESET_COMPLETED,
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      metadata: {
        sessionsInvalidated: true,
      },
    });

    return { passwordReset: true };
  },
};
