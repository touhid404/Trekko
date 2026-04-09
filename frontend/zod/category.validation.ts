import { z } from "zod"

export const CategoryValidationSchema = {
  create: z.object({
    slug: z.string().min(1, "Slug is required and cannot be empty"),
    title: z.string().min(1, "Title is required and cannot be empty"),
    description: z.string().optional(),
  }),
  update: z.object({
    slug: z
      .string()
      .min(1, "Slug must be at least 1 character long")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
      )
      .optional(),
    title: z
      .string()
      .min(1, "Title must be at least 1 character long")
      .max(100, "Title must be less than 100 characters")
      .optional(),
    description: z.string().optional(),
  }),
}

export type CategoryCreateFormData = z.infer<
  typeof CategoryValidationSchema.create
>

export type CategoryUpdateFormData = z.infer<
  typeof CategoryValidationSchema.update
>
