import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { BlogLikeService } from "./blog-like.service";

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;
  const blogId = req.params.blogId as string;

  const result = await BlogLikeService.toggleLike(memberId, blogId);

  res.status(200).json({
    success: true,
    message: result.liked ? "Blog liked" : "Blog unliked",
    data: result,
  });
});

export const BlogLikeController = {
  toggleLike,
};
