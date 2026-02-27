import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  createProfileController,
  getProfileController,
  updateProfileController,
  uploadTranscriptController,
} from "./profile.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createProfileController);
router.get("/:userId", getProfileController);
router.put("/", updateProfileController);
router.post("/transcript", uploadTranscriptController);

export default router;
