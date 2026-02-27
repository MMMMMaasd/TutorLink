import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as matchingService from "./matching.service";

export async function rankApplicantsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const requestId = req.params.requestId as string;
    const ranked = await matchingService.rankApplicants(requestId);
    res.status(200).json({ applicants: ranked });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not rank applicants. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function notifyMatchingTutorsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const requestId = req.params.requestId as string;
    const count = await matchingService.notifyMatchingTutors(requestId);
    res.status(200).json({ notifiedCount: count });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not send notifications. Please try again.";
    res.status(400).json({ error: message });
  }
}
