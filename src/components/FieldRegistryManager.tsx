"use client"

import { useState } from "react"
import { useApiKeys } from "../contexts/ApiKeyContext"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { ConfirmationDialog } from "./ConfirmationDialog"
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react"
import type { GlobalField } from "../types"

export function FieldRegistryManager() {
  const { globalFields, apiKeys, addGlobalField, updateGlobalField, deleteGlobalField } = useApiKeys()
  const [isAddingField, setIsAddingField] = useState(false)
  const [editingField, setEditingField] = useState<GlobalField | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<GlobalField | null>(null)
  const [newFieldName, setNewFieldName] = useState("")
  const [editFieldName, setEditFieldName] = useState("")

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const trimmedName = newFieldName.trim()

      // Check if field name already exists
      const exists = globalFields.some((field) => field.name.toLowerCase() === trimmedName.toLowerCase())
      if (exists) {
        return // Could show error toast here
      }

      addGlobalField(trimmedName)
      setNewFieldName("")
      setIsAddingField(false)
    }
  }

  const handleEditField = (field: GlobalField) => {
    setEditingField(field)
    setEditFieldName(field.name)
  }

  const handleSaveEdit = () => {
    if (editingField && editFieldName.trim()) {
      const trimmedName = editFieldName.trim()

      // Check if new name conflicts with existing fields (excluding current field)
      const exists = globalFields.some(
        (field) => field.id !== editingField.id && field.name.toLowerCase() === trimmedName.toLowerCase(),
      )
      if (exists) {
        return // Could show error toast here
      }

      updateGlobalField(editingField.id, trimmedName)
      setEditingField(null)
      setEditFieldName("")
    }
  }

  const handleDeleteField = (field: GlobalField) => {
    deleteGlobalField(field.id)
    setDeleteConfirm(null)
  }

  const getFieldUsageCount = (fieldName: string): number => {
    return apiKeys.reduce((count, key) => {
      return count + key.fields.filter((field) => field.name === fieldName).length
    }, 0)
  }

  const canDeleteField = (field: GlobalField): boolean => {
    // Can't delete the "Key" field as it's required
    if (field.name === "Key") return false
    return true
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Field Registry</h2>
          <p className="text-muted-foreground">Manage global field definitions that can be used across all API keys</p>
        </div>
        <Button onClick={() => setIsAddingField(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {globalFields.map((field) => {
                const isRequired = field.name === "Key"

                return (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEditField(field)} disabled={isRequired}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(field)}
                          disabled={!canDeleteField(field)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Field Dialog */}
      <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
            <DialogDescription>Create a new field definition that can be used across all API keys.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                placeholder="e.g., Client ID, Server URL, Secret Key"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddField()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingField(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddField} disabled={!newFieldName.trim()}>
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field name. This will affect all API keys using this field.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFieldName">Field Name</Label>
              <Input
                id="editFieldName"
                value={editFieldName}
                onChange={(e) => setEditFieldName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveEdit()
                  }
                }}
              />
            </div>
            {editingField && getFieldUsageCount(editingField.name) > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    This field is currently used in {getFieldUsageCount(editingField.name)} API key(s).
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    Changing the name will update it across all existing API keys.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editFieldName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmationDialog
          open={!!deleteConfirm}
          onOpenChange={() => setDeleteConfirm(null)}
          title="Delete Field"
          description={
            getFieldUsageCount(deleteConfirm.name) > 0
              ? `Are you sure you want to delete "${deleteConfirm.name}"? This field is currently used in ${getFieldUsageCount(deleteConfirm.name)} API key(s) and will be removed from all of them.`
              : `Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`
          }
          confirmText="Delete"
          onConfirm={() => handleDeleteField(deleteConfirm)}
          variant="destructive"
        />
      )}
    </div>
  )
}
