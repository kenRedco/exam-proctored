import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  text?: string
  fullScreen?: boolean
}

export function Loading({ 
  className, 
  text = "Loading...",
  fullScreen = false
}: LoadingProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-2 text-muted-foreground",
      fullScreen ? "h-screen w-screen" : "py-8",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  )
}

// Full page loading spinner
export function FullPageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loading fullScreen text="Loading..." />
    </div>
  )
}
