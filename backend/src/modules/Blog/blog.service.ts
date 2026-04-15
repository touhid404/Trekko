import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { Blog, CreateBlogPayload, UpdateBlogPayload } from "./blog.interface";
import { IQueryParams, IQueryResult } from "../../interface/queryBuilder.interface";
import { QueryBuilder } from "../../utils/queryBuilder";
import { SearchableFields, FilterableFields } from "./blog.constant";
import { MemberRole, Prisma } from "../../../prisma/generated/prisma/client";

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
  query: IQueryParams = {},
  userId?: string,
): Promise<IQueryResult<Blog>> => {
  const queryBuilder = new QueryBuilder<
    Blog,
    Prisma.BlogWhereInput,
    Prisma.BlogInclude
  >(prisma.blog, query, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({ isDeleted: false });

  const results = await queryBuilder
    .search()
    .filter()
    .include({
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
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  // Map to include `isLikedByMe` and sanitize output
  results.data = results.data.map((blog: any) => ({
    id: blog.id,
    authorId: blog.authorId,
    title: blog.title,
    content: blog.content,
    coverImage: blog.coverImage,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    author: blog.author,
    _count: blog._count,
    isDeleted: blog.isDeleted,
    isLikedByMe: userId ? blog.likes?.length > 0 : false,
  }));

  return results;
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
