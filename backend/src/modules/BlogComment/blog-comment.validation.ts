import * as z from "zod";

export const BlogCommentValidationSchema = {
  create: z.object({
    blogId: z.string().min(1, "Blog ID is required"),
    comment: z.string().min(1, "Comment text is required"),
    parentId: z.string().optional(),
  }),
  update: z.object({
    comment: z.string().min(1, "Comment text is required"),
  }),
};
