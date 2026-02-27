import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  createThreadController,
  sendMessageController,
  getThreadMessagesController,
  getUserThreadsController,
} from "./messaging.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createThreadController);
router.get("/", getUserThreadsController);
router.post("/:threadId/messages", sendMessageController);
router.get("/:threadId/messages", getThreadMessagesController);

export default router;
