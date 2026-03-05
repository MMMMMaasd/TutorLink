import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  createSessionController,
  getUserSessionsController,
  completeSessionController,
  cancelSessionController,
  sendRemindersController,
} from "./scheduling.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createSessionController);
router.get("/", getUserSessionsController);
router.post("/reminders", sendRemindersController);
router.patch("/:sessionId/complete", completeSessionController);
router.patch("/:sessionId/cancel", cancelSessionController);

export default router;
