import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { BlogCommentService } from "./blog-comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;
  const result = await BlogCommentService.createComment(memberId, req.body);

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const getComments = catchAsync(async (req: Request, res: Response) => {
  const blogId = req.params.blogId as string;
  const result = await BlogCommentService.getNestedComments(blogId);

  res.status(200).json({
    success: true,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;
  const memberId = req.user!.id;

  const result = await BlogCommentService.updateComment(
    commentId,
    memberId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;
  const memberId = req.user!.id;
  const memberRole = req.user!.role;

  const result = await BlogCommentService.deleteComment(
    commentId,
    memberId,
    memberRole,
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const BlogCommentController = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
