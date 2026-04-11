"use client"

import * as React from "react"
import { CheckCircle2, Circle, Trophy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { toggleCheckpointAction } from "@/actions/checkpoint/checkpoint.action"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Checkpoint {
  id: string
  title: string
  description: string | null
  progress?: Array<{
    isCompleted: boolean
  }>
}

interface Props {
  guideId: string
  checkpoints: Checkpoint[]
}

export default function CheckpointProgressTracker({ guideId, checkpoints: initialCheckpoints }: Props) {
  const [checkpoints, setCheckpoints] = React.useState(initialCheckpoints)
  const [loading, setLoading] = React.useState<string | null>(null)

  const completedCount = checkpoints.filter(cp => cp.progress && cp.progress.length > 0 && cp.progress[0].isCompleted).length
  const totalCount = checkpoints.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleToggle = async (checkpointId: string) => {
    setLoading(checkpointId)
    try {
      const res = await toggleCheckpointAction(checkpointId)
      if (res.success) {
        setCheckpoints(prev => prev.map(cp => {
          if (cp.id === checkpointId) {
            const isCompleted = res.data.isCompleted
            return {
              ...cp,
              progress: [{ isCompleted }]
            }
          }
          return cp
        }))

        if (res.data.isCompleted) {
          toast.success("Checkpoint completed!")
          // Check if this was the last one
          const newCompletedCount = checkpoints.filter(cp => {
            if (cp.id === checkpointId) return true
            return cp.progress && cp.progress.length > 0 && cp.progress[0].isCompleted
          }).length
          
          if (newCompletedCount === totalCount) {
             toast("👑 Certified Trekker!", {
               description: "You've completed all milestones for this guide!",
               icon: <Trophy className="h-5 w-5 text-yellow-500" />,
             })
          }
        }
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error("Failed to update progress")
    } finally {
      setLoading(null)
    }
  }

  if (totalCount === 0) return null

  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="bg-emerald-500 p-6 text-white pb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black tracking-tight text-lg">Trip Progression</h3>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
             <Trophy className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-90">
            <span>Explorer Status</span>
            <span>{progressPercentage}% Completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/20" color="bg-white" />
        </div>
      </div>

      <div className="p-6 -mt-6">
        <div className="rounded-2xl bg-white border border-gray-100 p-2 shadow-sm space-y-1">
          {checkpoints.map((checkpoint) => {
            const isCompleted = checkpoint.progress && checkpoint.progress.length > 0 && checkpoint.progress[0].isCompleted
            
            return (
              <button
                key={checkpoint.id}
                onClick={() => handleToggle(checkpoint.id)}
                disabled={loading === checkpoint.id}
                className={cn(
                  "flex w-full items-start gap-4 p-4 rounded-xl transition-all text-left group",
                  isCompleted ? "bg-emerald-50/50" : "hover:bg-gray-50"
                )}
              >
                <div className="mt-0.5">
                  {loading === checkpoint.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 group-hover:text-emerald-400" />
                  )}
                </div>
                <div>
                  <h4 className={cn(
                    "text-sm font-bold tracking-tight transition-colors",
                    isCompleted ? "text-emerald-700 line-through opacity-70" : "text-gray-900"
                  )}>
                    {checkpoint.title}
                  </h4>
                  {checkpoint.description && !isCompleted && (
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {checkpoint.description}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-6 pb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Complete all checkpoints to earn a badge
        </p>
      </div>
    </div>
  )
}
