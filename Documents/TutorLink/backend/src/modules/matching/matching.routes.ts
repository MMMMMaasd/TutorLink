import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  rankApplicantsController,
  notifyMatchingTutorsController,
} from "./matching.controller";

const router = Router();

router.use(authMiddleware);

router.get("/rank/:requestId", rankApplicantsController);
router.post("/notify/:requestId", notifyMatchingTutorsController);

export default router;
