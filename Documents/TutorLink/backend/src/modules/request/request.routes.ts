import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  createRequestController,
  getAllOpenRequestsController,
  getRequestByIdController,
  applyToRequestController,
  acceptApplicationController,
  closeRequestController,
} from "./request.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createRequestController);
router.get("/", getAllOpenRequestsController);
router.get("/:requestId", getRequestByIdController);
router.post("/:requestId/apply", applyToRequestController);
router.post("/applications/:applicationId/accept", acceptApplicationController);
router.patch("/:requestId/close", closeRequestController);

export default router;
