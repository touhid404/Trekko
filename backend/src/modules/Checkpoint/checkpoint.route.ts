import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { MemberRole } from "../../../prisma/generated/prisma/enums";
import { CheckpointController } from "./checkpoint.controller";

const router = express.Router();

router.post(
  "/:checkpointId/toggle",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  CheckpointController.toggleProgress
);

router.get(
  "/guide/:guideId/progress",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  CheckpointController.getGuideProgress
);

export const CheckpointRoutes = router;
