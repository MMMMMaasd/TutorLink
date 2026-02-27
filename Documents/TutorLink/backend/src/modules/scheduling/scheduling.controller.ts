import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as schedulingService from "./scheduling.service";

export async function createSessionController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { requestId, tutorId, tuteeId, scheduledAt, location, format } =
      req.body;
    const session = await schedulingService.createSession(
      requestId,
      tutorId,
      tuteeId,
      new Date(scheduledAt),
      location ?? null,
      format
    );
    res.status(201).json({ session });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not create session. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function getUserSessionsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const sessions = await schedulingService.getUserSessions(req.userId!);
    res.status(200).json({ sessions });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch sessions. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function completeSessionController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const sessionId = req.params.sessionId as string;
    const session = await schedulingService.completeSession(
      sessionId,
      req.userId!
    );
    res.status(200).json({ session });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not complete session. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function cancelSessionController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const sessionId = req.params.sessionId as string;
    const session = await schedulingService.cancelSession(
      sessionId,
      req.userId!
    );
    res.status(200).json({ session });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not cancel session. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function sendRemindersController(
  _req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const count = await schedulingService.sendSessionReminders();
    res.status(200).json({ remindersSent: count });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not send reminders. Please try again.";
    res.status(500).json({ error: message });
  }
}
