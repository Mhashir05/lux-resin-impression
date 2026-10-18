import bcrypt from "bcryptjs";

export const MIN_PASSWORD_LENGTH = 8;

const SALT_ROUNDS = 10;

export function passwordTooShortError(label: string = "Password"): string {
  return `${label} must be at least ${MIN_PASSWORD_LENGTH} characters`;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
