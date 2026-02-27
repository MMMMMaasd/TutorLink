import { Request, Response } from "express";
import * as authService from "./auth.service";

export async function registerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, password, role } = req.body;
    const user = await authService.register(email, password, role);
    res.status(201).json({ user });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function loginController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Login failed. Please try again.";
    res.status(401).json({ error: message });
  }
}

export async function forgotPasswordController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function resetPasswordController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Password reset failed. Please try again.";
    res.status(500).json({ error: message });
  }
}
