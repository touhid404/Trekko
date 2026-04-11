import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const toggleProgress = async (userId: string, checkpointId: string) => {
  const checkpoint = await prisma.guideCheckpoint.findUnique({
    where: { id: checkpointId },
  });

  if (!checkpoint) {
    throw new AppError(404, "Checkpoint not found");
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      memberId: userId,
      guideId: checkpoint.guideId,
      paymentStatus: "COMPLETED",
    },
  });

  if (!purchase) {
    throw new AppError(403, "You must purchase the guide to track progress");
  }

  const existingProgress = await prisma.userCheckpointProgress.findUnique({
    where: {
      userId_checkpointId: {
        userId,
        checkpointId,
      },
    },
  });

  if (existingProgress) {
    return await prisma.userCheckpointProgress.update({
      where: { id: existingProgress.id },
      data: {
        isCompleted: !existingProgress.isCompleted,
        completedAt: !existingProgress.isCompleted ? new Date() : null,
      },
    });
  } else {
    return await prisma.userCheckpointProgress.create({
      data: {
        userId,
        checkpointId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }
};

const getGuideProgress = async (userId: string, guideId: string) => {
  const checkpoints = await prisma.guideCheckpoint.findMany({
    where: { guideId },
    include: {
      progress: {
        where: { userId },
      },
    },
    orderBy: { order: "asc" },
  });

  const total = checkpoints.length;
  const completed = checkpoints.filter(
    (cp) => cp.progress.length > 0 && cp.progress[0].isCompleted,
  ).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    checkpoints,
    meta: {
      total,
      completed,
      percentage,
    },
  };
};

export const CheckpointService = {
  toggleProgress,
  getGuideProgress,
};
