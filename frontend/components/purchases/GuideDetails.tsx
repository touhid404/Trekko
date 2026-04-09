import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Guide {
  id: string
  title: string
  description?: string
  itinerary?: string
  category: {
    title: string
  }
  price: number
  coverImage?: string
  createdAt: string
  member?: {
    name: string
  }
}

interface GuideDetailsProps {
  guide: Guide
}

export function GuideDetails({ guide }: GuideDetailsProps) {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <Badge>{guide.category.title}</Badge>
        </CardHeader>
        <CardContent>
          {guide.coverImage && (
            <img
              src={guide.coverImage}
              alt={guide.title}
              className="mb-4 h-64 w-full rounded-md object-cover"
            />
          )}
          <p className="mb-2 text-sm text-gray-600">
            Created by: {guide.member?.name || "Unknown"}
          </p>
          <p className="mb-2 text-sm text-gray-600">Price: ${guide.price}</p>
          <p className="mb-4 text-sm text-gray-600">
            Created At: {new Date(guide.createdAt).toLocaleDateString()}
          </p>
          {guide.description && (
            <div className="mb-4">
              <h3 className="font-semibold">Description</h3>
              <p>{guide.description}</p>
            </div>
          )}
          {guide.itinerary && (
            <div>
              <h3 className="font-semibold">Itinerary</h3>
              <p>{guide.itinerary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
