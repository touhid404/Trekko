import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { Blog, CreateBlogPayload, UpdateBlogPayload } from "./blog.interface";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const create = async (
  authorId: string,
  payload: CreateBlogPayload,
): Promise<Blog> => {
  const blog = await prisma.blog.create({
    data: {
      authorId,
      title: payload.title,
      content: payload.content,
      coverImage: payload.coverImage || null,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return blog as Blog;
};

const getAll = async (
  page: number = 1,
  limit: number = 10,
  userId?: string,
) => {
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where: { isDeleted: false },
      include: {
        author: {
          select: { id: true, name: true, email: true, profilePhoto: true },
        },
        _count: { select: { likes: true, comments: true } },
        ...(userId
          ? {
              likes: {
                where: { memberId: userId },
                select: { id: true },
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blog.count({ where: { isDeleted: false } }),
  ]);

  // Map to include `isLikedByMe`
  const data = blogs.map((blog) => ({
    ...blog,
    isLikedByMe: userId ? (blog as any).likes?.length > 0 : false,
    likes: undefined, // Don't expose raw likes array
  }));

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id: string, userId?: string) => {
  const blog = await prisma.blog.findFirst({
    where: { id, isDeleted: false },
    include: {
      author: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
      _count: { select: { likes: true, comments: true } },
      ...(userId
        ? {
            likes: {
              where: { memberId: userId },
              select: { id: true },
            },
          }
        : {}),
    },
  });

  if (!blog) {
    throw new AppError(404, "Blog post not found");
  }

  return {
    ...blog,
    isLikedByMe: userId ? (blog as any).likes?.length > 0 : false,
    likes: undefined,
  };
};

const update = async (
  id: string,
  userId: string,
  userRole: string,
  payload: UpdateBlogPayload,
): Promise<Blog> => {
  const blog = await prisma.blog.findUnique({ where: { id } });

  if (!blog || blog.isDeleted) {
    throw new AppError(404, "Blog post not found");
  }

  if (blog.authorId !== userId && userRole !== MemberRole.ADMIN) {
    throw new AppError(403, "You can only update your own blog posts");
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: {
      title: payload.title,
      content: payload.content,
      coverImage: payload.coverImage,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return updatedBlog as Blog;
};

const remove = async (
  id: string,
  userId: string,
  userRole: string,
): Promise<{ message: string }> => {
  const blog = await prisma.blog.findUnique({ where: { id } });

  if (!blog || blog.isDeleted) {
    throw new AppError(404, "Blog post not found");
  }

  if (blog.authorId !== userId && userRole !== MemberRole.ADMIN) {
    throw new AppError(403, "You can only delete your own blog posts");
  }

  await prisma.blog.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return { message: "Blog post deleted successfully" };
};

export const BlogService = {
  create,
  getAll,
  getById,
  update,
  remove,
};
