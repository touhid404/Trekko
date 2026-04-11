import { z } from "zod"

// Assuming GuideStatus enum values
export enum GuideStatus {
  DRAFT = "DRAFT",
  UNDER_REVIEW = "UNDER_REVIEW",
}

const ItineraryItemSchema = z.object({
  day: z.number().int().positive("Day must be a positive integer"),
  title: z.string().min(1, "Title is required"),
  activities: z
    .array(z.string().min(1, "Activity cannot be empty"))
    .min(1, "At least one activity is required"),
})

const CheckpointItemSchema = z.object({
  title: z.string().min(1, "Checkpoint title is required"),
  description: z.string().optional(),
})

export const TravelGuideValidationSchema = {
  create: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    destination: z.string().optional(),
    itinerary: z.array(ItineraryItemSchema).optional(),
    status: z.nativeEnum(GuideStatus).optional().default(GuideStatus.DRAFT),
    isPaid: z.preprocess((value) => {
      if (typeof value === "number") return value === 1
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase()
        return normalized === "1" || normalized === "true"
      }
      return value
    }, z.boolean().optional().default(false)),
    price: z.number().positive("Price must be positive").optional(),
    // Accept Cloudinary URLs instead of File objects
    coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
    // Array of Cloudinary image URLs
    images: z.array(z.string().url("Invalid image URL")).optional(),
    checkpoints: z.array(CheckpointItemSchema).optional(),
  }),
}

export type TravelGuideFormData = z.infer<
  typeof TravelGuideValidationSchema.create
>
