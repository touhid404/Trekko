"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"

interface ItineraryItem {
  day: number
  title: string
  activities: string[]
}

interface ItineraryEditorProps {
  value: ItineraryItem[]
  onChange: (itinerary: ItineraryItem[]) => void
}

export default function ItineraryEditor({
  value,
  onChange,
}: ItineraryEditorProps) {
  const items = Array.isArray(value) ? value : []

  const addDay = () => {
    const newDay: ItineraryItem = {
      day: items.length + 1,
      title: "",
      activities: [""],
    }
    onChange([...items, newDay])
  }

  const removeDay = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    // Renumber days
    updated.forEach((item, i) => {
      item.day = i + 1
    })
    onChange(updated)
  }

  const updateDayTitle = (index: number, title: string) => {
    const updated = [...items]
    updated[index].title = title
    onChange(updated)
  }

  const updateActivity = (
    dayIndex: number,
    actIndex: number,
    value: string
  ) => {
    const updated = [...items]
    updated[dayIndex].activities[actIndex] = value
    onChange(updated)
  }

  const addActivity = (dayIndex: number) => {
    const updated = [...items]
    updated[dayIndex].activities.push("")
    onChange(updated)
  }

  const removeActivity = (dayIndex: number, actIndex: number) => {
    const updated = [...items]
    updated[dayIndex].activities.splice(actIndex, 1)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {items.map((item, dayIndex) => (
        <Card key={dayIndex} className="p-4">
          {/* Day Header */}
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium">Day {item.day}</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeDay(dayIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Title */}
          <div className="mb-4 space-y-2">
            <label className="text-sm font-medium">Day Title</label>
            <Input
              value={item.title}
              onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
              placeholder="e.g., Arrival & City Tour"
            />
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Activities</label>
            <div className="space-y-2">
              {item.activities.map((activity, actIndex) => (
                <div key={actIndex} className="flex items-center gap-2">
                  <Input
                    value={activity}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, e.target.value)
                    }
                    placeholder="Activity description"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeActivity(dayIndex, actIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Activity Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addActivity(dayIndex)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </Card>
      ))}

      {/* Add Day Button */}
      <Button
        type="button"
        variant="default"
        onClick={addDay}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Day
      </Button>
    </div>
  )
}
