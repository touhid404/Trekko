import * as z from "zod";

export const BlogValidationSchema = {
  create: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    coverImage: z.string().url("Invalid cover image URL").optional(),
  }),
  update: z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    coverImage: z.string().url("Invalid cover image URL").optional(),
  }),
};
