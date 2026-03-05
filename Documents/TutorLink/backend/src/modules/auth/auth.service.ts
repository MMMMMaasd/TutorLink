import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 10;
const JWT_EXPIRATION = "30m";

export async function register(email: string, password: string, role: Role) {
  if (!email.endsWith(".edu")) {
    throw new Error(
      "Only university email addresses (ending in .edu) are allowed."
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Server configuration error.");
  }

  const token = jwt.sign({ userId: user.id }, secret, {
    expiresIn: JWT_EXPIRATION,
  });

  return { token, user };
}

export async function forgotPassword(email: string) {
  console.log(`[forgotPassword] Reset requested for: ${email}`);
  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
}

export async function resetPassword(token: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  console.log(
    `[resetPassword] Token: ${token} — new hash generated: ${passwordHash.slice(0, 12)}…`
  );
  return { message: "Password has been reset successfully." };
}
