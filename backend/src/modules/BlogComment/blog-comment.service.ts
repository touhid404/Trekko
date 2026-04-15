import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import {
  BlogComment,
  CreateBlogCommentPayload,
  UpdateBlogCommentPayload,
} from "./blog-comment.interface";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const createComment = async (
  memberId: string,
  payload: CreateBlogCommentPayload,
): Promise<BlogComment> => {
  const { blogId, comment, parentId } = payload;

  const blog = await prisma.blog.findFirst({
    where: { id: blogId, isDeleted: false },
  });
  if (!blog) throw new AppError(404, "Blog post not found");

  if (parentId) {
    const parentComment = await prisma.blogComment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment || parentComment.isDeleted) {
      throw new AppError(404, "Parent comment not found");
    }
    if (parentComment.blogId !== blogId) {
      throw new AppError(400, "Parent comment must belong to the same blog");
    }
  }

  const created = await prisma.blogComment.create({
    data: {
      blogId,
      memberId,
      parentId: parentId ?? null,
      comment,
    },
    include: {
      member: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
    },
  });

  return created as BlogComment;
};

const getNestedComments = async (blogId: string): Promise<BlogComment[]> => {
  const blog = await prisma.blog.findFirst({
    where: { id: blogId, isDeleted: false },
  });
  if (!blog) throw new AppError(404, "Blog post not found");

  const comments = await prisma.blogComment.findMany({
    where: {
      blogId,
      isDeleted: false,
    },
    include: {
      member: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const map = new Map<string, BlogComment & { replies: BlogComment[] }>();
  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] } as BlogComment & {
      replies: BlogComment[];
    });
  });

  const roots: BlogComment[] = [];

  comments.forEach((c) => {
    const enhanced = map.get(c.id)!;
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) {
        parent.replies.push(enhanced);
      }
    } else {
      roots.push(enhanced);
    }
  });

  return roots;
};

const updateComment = async (
  commentId: string,
  memberId: string,
  payload: UpdateBlogCommentPayload,
): Promise<BlogComment> => {
  const existing = await prisma.blogComment.findUnique({
    where: { id: commentId },
  });

  if (!existing || existing.isDeleted) {
    throw new AppError(404, "Comment not found");
  }

  if (existing.memberId !== memberId) {
    throw new AppError(403, "Not authorized to update this comment");
  }

  const updated = await prisma.blogComment.update({
    where: { id: commentId },
    data: { comment: payload.comment },
    include: {
      member: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
    },
  });

  return updated as BlogComment;
};

const deleteComment = async (
  commentId: string,
  memberId: string,
  memberRole: string,
): Promise<{ message: string }> => {
  const existing = await prisma.blogComment.findUnique({
    where: { id: commentId },
  });
  if (!existing || existing.isDeleted) {
    throw new AppError(404, "Comment not found");
  }

  if (existing.memberId !== memberId && memberRole !== MemberRole.ADMIN) {
    throw new AppError(403, "Not authorized to delete this comment");
  }

  // Cascade soft-delete all replies
  const allComments = await prisma.blogComment.findMany({
    where: { blogId: existing.blogId, isDeleted: false },
  });

  const childMap = new Map<string, string[]>();
  allComments.forEach((c) => {
    if (!c.parentId) return;
    const arr = childMap.get(c.parentId) ?? [];
    arr.push(c.id);
    childMap.set(c.parentId, arr);
  });

  const idsToDelete = new Set<string>();
  const stack = [existing.id];

  while (stack.length) {
    const current = stack.pop()!;
    if (idsToDelete.has(current)) continue;
    idsToDelete.add(current);
    const children = childMap.get(current);
    if (children) children.forEach((childId) => stack.push(childId));
  }

  await prisma.blogComment.updateMany({
    where: { id: { in: Array.from(idsToDelete) } },
    data: { isDeleted: true, deletedAt: new Date() },
  });

  return { message: "Comment deleted successfully" };
};

export const BlogCommentService = {
  createComment,
  getNestedComments,
  updateComment,
  deleteComment,
};
