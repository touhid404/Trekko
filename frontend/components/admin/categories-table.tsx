"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Category } from "@/services/admin/categories.service"

interface CategoriesTableProps {
  categories: Category[]
  onEditCategory?: (category: Category) => void
  onDeleteCategory?: (categoryId: string) => void
}

export function CategoriesTable({
  categories,
  onEditCategory,
  onDeleteCategory,
}: CategoriesTableProps) {
  const handleEditCategory = (category: Category) => {
    onEditCategory?.(category)
  }

  const handleDeleteCategory = (categoryId: string) => {
    onDeleteCategory?.(categoryId)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Guides Count</TableHead>
            <TableHead>Created At</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="max-w-xs font-medium">
                <div className="truncate" title={category.slug}>
                  {category.slug}
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={category.title}>
                  {category.title}
                </div>
              </TableCell>
              <TableCell className="max-w-sm">
                <div className="truncate" title={category.description}>
                  {category.description}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{category.guides.length}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit Category
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
