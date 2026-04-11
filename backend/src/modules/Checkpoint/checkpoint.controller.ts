import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { CheckpointService } from "./checkpoint.service";
import status from "http-status";

const toggleProgress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { checkpointId } = req.params;

  const result = await CheckpointService.toggleProgress(userId, checkpointId as string);

  res.status(status.OK).json({
    success: true,
    message: "Checkpoint progress toggled successfully",
    data: result,
  });
});

const getGuideProgress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { guideId } = req.params;

  const result = await CheckpointService.getGuideProgress(userId, guideId as string);

  res.status(status.OK).json({
    success: true,
    message: "Guide progress retrieved successfully",
    data: result,
  });
});

export const CheckpointController = {
  toggleProgress,
  getGuideProgress,
};
