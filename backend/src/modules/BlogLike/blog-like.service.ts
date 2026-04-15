import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const toggleLike = async (
  memberId: string,
  blogId: string,
): Promise<{ liked: boolean; likeCount: number }> => {
  const blog = await prisma.blog.findFirst({
    where: { id: blogId, isDeleted: false },
  });

  if (!blog) {
    throw new AppError(404, "Blog post not found");
  }

  const existing = await prisma.blogLike.findUnique({
    where: {
      memberId_blogId: { memberId, blogId },
    },
  });

  if (existing) {
    // Unlike
    await prisma.blogLike.delete({ where: { id: existing.id } });
  } else {
    // Like
    await prisma.blogLike.create({
      data: { memberId, blogId },
    });
  }

  const likeCount = await prisma.blogLike.count({ where: { blogId } });

  return {
    liked: !existing,
    likeCount,
  };
};

export const BlogLikeService = {
  toggleLike,
};
