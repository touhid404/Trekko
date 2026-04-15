import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { BlogService } from "./blog.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user!.id;
  const result = await BlogService.create(authorId, req.body);

  res.status(201).json({
    success: true,
    message: "Blog post created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const data = await BlogService.getAll(req.query as any, userId);
  res.status(200).json({
    success: true,
    message: "Blogs retrieved successfully",
    data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;

  const result = await BlogService.getById(id, userId);

  res.status(200).json({
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await BlogService.update(id, userId, userRole, req.body);

  res.status(200).json({
    success: true,
    message: "Blog post updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const result = await BlogService.remove(id, userId, userRole);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const BlogController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
