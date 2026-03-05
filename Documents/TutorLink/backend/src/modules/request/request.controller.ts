import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as requestService from "./request.service";

export async function createRequestController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const tutoringRequest = await requestService.createRequest(
      req.userId!,
      req.body
    );
    res.status(201).json({ request: tutoringRequest });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not create request. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function getAllOpenRequestsController(
  _req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const requests = await requestService.getAllOpenRequests();
    res.status(200).json({ requests });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch requests. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function getRequestByIdController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const requestId = req.params.requestId as string;
    const tutoringRequest = await requestService.getRequestById(requestId);

    if (!tutoringRequest) {
      res.status(404).json({ error: "Tutoring request not found." });
      return;
    }

    res.status(200).json({ request: tutoringRequest });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch request. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function applyToRequestController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const requestId = req.params.requestId as string;
    const { tutorProfileId } = req.body;
    const application = await requestService.applyToRequest(
      requestId,
      tutorProfileId
    );
    res.status(201).json({ application });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not submit application. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function acceptApplicationController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const applicationId = req.params.applicationId as string;
    const application = await requestService.acceptApplication(
      applicationId,
      req.userId!
    );
    res.status(200).json({ application });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not accept application. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function closeRequestController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const requestId = req.params.requestId as string;
    const tutoringRequest = await requestService.closeRequest(
      requestId,
      req.userId!
    );
    res.status(200).json({ request: tutoringRequest });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not close request. Please try again.";
    res.status(400).json({ error: message });
  }
}
