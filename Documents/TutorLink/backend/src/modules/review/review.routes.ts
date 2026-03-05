import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  createReviewController,
  getReviewsForUserController,
  getAverageRatingController,
  flagReviewController,
} from "./review.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createReviewController);
router.get("/user/:userId", getReviewsForUserController);
router.get("/user/:userId/rating", getAverageRatingController);
router.patch("/:reviewId/flag", flagReviewController);

export default router;
