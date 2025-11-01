"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import type { Field } from "../types"
import { useToast } from "../hooks/use-toast"

interface CopyableKeyCardProps {
  field: Field
  onToggleMask: () => void
}

export function CopyableKeyCard({ field, onToggleMask }: CopyableKeyCardProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(field.value)
      setCopied(true)
      toast({
        description: `${field.name} copied to clipboard`,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy to clipboard",
      })
    }
  }

  const displayValue = field.masked ? "•".repeat(Math.min(field.value.length, 32)) : field.value

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {field.name}
              </Badge>
            </div>
            <div className="font-mono text-sm bg-muted p-2 rounded border break-all">{displayValue}</div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onToggleMask} title={field.masked ? "Show value" : "Hide value"}>
              {field.masked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy to clipboard">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
