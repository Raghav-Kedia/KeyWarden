"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Plus, Check, X } from "lucide-react"
import { useApiKeys } from "../contexts/ApiKeyContext"

interface AddFieldDropdownProps {
  onAddField: (fieldName: string) => void
  existingFieldNames: string[]
}

export function AddFieldDropdown({ onAddField, existingFieldNames }: AddFieldDropdownProps) {
  const { globalFields, addGlobalField } = useApiKeys()
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newFieldName, setNewFieldName] = useState("")

  const availableFields = globalFields.filter((field) => !existingFieldNames.includes(field.name))

  const handleCreateNew = () => {
    if (newFieldName.trim()) {
      const trimmedName = newFieldName.trim()

      // Check if field already exists globally
      const existingGlobalField = globalFields.find((f) => f.name === trimmedName)
      if (existingGlobalField) {
        onAddField(trimmedName)
      } else {
        // Create new global field
        addGlobalField(trimmedName)
        onAddField(trimmedName)
      }

      setNewFieldName("")
      setIsCreatingNew(false)
    }
  }

  const handleCancel = () => {
    setNewFieldName("")
    setIsCreatingNew(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {availableFields.map((field) => (
          <DropdownMenuItem key={field.id} onClick={() => onAddField(field.name)}>
            {field.name}
          </DropdownMenuItem>
        ))}

        {availableFields.length > 0 && <DropdownMenuSeparator />}

        {isCreatingNew ? (
          <div className="p-2 space-y-2">
            <Input
              placeholder="Field name"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateNew()
                } else if (e.key === "Escape") {
                  handleCancel()
                }
              }}
              autoFocus
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleCreateNew} disabled={!newFieldName.trim()}>
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <DropdownMenuItem onClick={() => setIsCreatingNew(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create new field...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
