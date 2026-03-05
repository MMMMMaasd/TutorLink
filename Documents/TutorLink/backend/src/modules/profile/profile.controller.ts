import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { prisma } from "../../config/db";
import * as profileService from "./profile.service";

export async function createProfileController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const profile = await profileService.createProfile(req.userId!, req.body);
    res.status(201).json({ profile });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not create profile. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function getProfileController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
      res.status(404).json({ error: "Profile not found." });
      return;
    }

    res.status(200).json({ profile });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not retrieve profile. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function updateProfileController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const profile = await profileService.updateProfile(req.userId!, req.body);
    res.status(200).json({ profile });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update profile. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function uploadTranscriptController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId! },
      select: { id: true },
    });

    if (!profile) {
      res
        .status(404)
        .json({ error: "Please create a profile before uploading transcripts." });
      return;
    }

    const { courseCode, courseName, fileKey } = req.body;
    const badge = await profileService.uploadTranscript(
      profile.id,
      courseCode,
      courseName,
      fileKey
    );

    res.status(201).json({ badge });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not upload transcript. Please try again.";
    res.status(400).json({ error: message });
  }
}
