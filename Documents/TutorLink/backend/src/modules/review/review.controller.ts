import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as reviewService from "./review.service";

export async function createReviewController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { sessionId, revieweeId, rating, comment } = req.body;
    const review = await reviewService.createReview(
      sessionId,
      req.userId!,
      revieweeId,
      rating,
      comment
    );
    res.status(201).json({ review });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not submit review. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function getReviewsForUserController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const reviews = await reviewService.getReviewsForUser(userId);
    res.status(200).json({ reviews });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch reviews. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function getAverageRatingController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const rating = await reviewService.getAverageRating(userId);
    res.status(200).json(rating);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch rating. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function flagReviewController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const reviewId = req.params.reviewId as string;
    const review = await reviewService.flagReview(reviewId, req.userId!);
    res.status(200).json({ review });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not flag review. Please try again.";
    res.status(400).json({ error: message });
  }
}
