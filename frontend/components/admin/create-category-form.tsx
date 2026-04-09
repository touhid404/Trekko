"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CategoryValidationSchema,
  CategoryCreateFormData,
} from "@/zod/category.validation"
import { createCategoryAction } from "@/app/actions/admin/createCategoryAction"

export function CreateCategoryForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<CategoryCreateFormData>({
    defaultValues: {
      slug: "",
      title: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating category...")
      setIsSubmitting(true)

      const parseResult = CategoryValidationSchema.create.safeParse(value)
      if (!parseResult.success) {
        toast.error(parseResult.error.issues[0]?.message || "Invalid form data")
        setIsSubmitting(false)
        return
      }

      try {
        const response = await createCategoryAction(parseResult.data)

        if (!response || !response.success) {
          toast.error(response?.message || "Failed to create category", {
            id: toastId,
          })
          setIsSubmitting(false)
          return
        }

        toast.success(response.message || "Category created successfully", {
          id: toastId,
        })
        form.reset()
      } catch (error: any) {
        console.error("Create category error:", error)
        toast.error(
          error?.message || "An error occurred while creating category",
          { id: toastId }
        )
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
        </CardHeader>

        <form.Provider>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <CardContent className="space-y-4">
              <form.Field name="slug">
                {(field) => (
                  <Field>
                    <FieldLabel>Slug *</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. beach-travel"
                    />
                    <FieldError errors={field.state.meta.errors.map(String)} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="title">
                {(field) => (
                  <Field>
                    <FieldLabel>Title *</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Category title"
                    />
                    <FieldError errors={field.state.meta.errors.map(String)} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional description"
                      rows={4}
                    />
                    <FieldError errors={field.state.meta.errors.map(String)} />
                  </Field>
                )}
              </form.Field>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/categories")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </CardFooter>
          </form>
        </form.Provider>
      </Card>
    </div>
  )
}
