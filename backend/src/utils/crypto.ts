import crypto from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, originalHash] = hash.split(":");
  if (!salt || !originalHash) {
    return false;
  }

  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(originalHash), Buffer.from(derivedKey));
}
