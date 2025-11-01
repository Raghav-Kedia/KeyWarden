"use client"

import { useState } from "react"
import { useApiKeys } from "../contexts/ApiKeyContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { ConfirmationDialog } from "../components/ConfirmationDialog"
import { AddFieldDropdown } from "../components/AddFieldDropdown"
import { useToast } from "../hooks/use-toast"
import { Plus, Trash2, Edit2, Copy, Check } from "lucide-react"
import type { ApiKey, Field } from "../types"

export default function DashboardPage() {
  const { apiKeys, globalFields, addApiKey, updateApiKey, deleteApiKey } = useApiKeys()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null)
  const [formFields, setFormFields] = useState<Field[]>([
    { name: "Name", value: "", masked: false },
    { name: "Link", value: "", masked: false },
    { name: "Key", value: "", masked: true },
  ])

  

  const handleAddField = (fieldName: string) => {
    if (!formFields.some((f) => f.name === fieldName)) {
      setFormFields([...formFields, { name: fieldName, value: "", masked: fieldName === "Key" }])
    }
  }

  const handleRemoveField = (fieldName: string) => {
    if (!["Name", "Link", "Key"].includes(fieldName)) {
      setFormFields(formFields.filter((f) => f.name !== fieldName))
    }
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormFields(formFields.map((f) => (f.name === fieldName ? { ...f, value } : f)))
  }

  const handleToggleMask = (fieldName: string) => {
    setFormFields(formFields.map((f) => (f.name === fieldName ? { ...f, masked: !f.masked } : f)))
  }

  const handleOpenDialog = () => {
    setEditingId(null)
    setFormFields([
      { name: "Name", value: "", masked: false },
      { name: "Link", value: "", masked: false },
      { name: "Key", value: "", masked: true },
    ])
    setIsOpen(true)
  }

  const handleEditKey = (key: ApiKey) => {
    setEditingId(key.id)
    setFormFields(
      globalFields
        .map((gf) => {
          const existing = key.fields.find((f) => f.name === gf.name)
          return (
            existing || {
              name: gf.name,
              value: "",
              masked: gf.name === "Key",
            }
          )
        })
        .concat(key.fields.filter((f) => !globalFields.some((gf) => gf.name === f.name))),
    )
    setIsOpen(true)
  }

  // Basic URL validator for http/https
  function isValidUrl(url: string) {
    try {
      const u = new URL(url)
      return u.protocol === "http:" || u.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleSave = () => {
    const requiredFields = ["Name", "Link", "Key"]
    const missingFields = requiredFields.filter((rf) => !formFields.find((f) => f.name === rf && f.value.trim()))

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        description: `Missing required fields: ${missingFields.join(", ")}`,
      })
      return
    }

    // Validate Link URL format
    const linkValue = (formFields.find((f) => f.name === "Link")?.value || "").trim()
    if (!isValidUrl(linkValue)) {
      toast({
        variant: "destructive",
        description: "Please enter a valid Link URL (must start with http:// or https://).",
      })
      return
    }

    if (editingId) {
      updateApiKey(editingId, { fields: formFields })
      toast({
        description: "API key updated successfully",
      })
    } else {
      addApiKey({
        fields: formFields,
      })
      toast({
        description: "API key added successfully",
      })
    }

    setIsOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteApiKey(deleteTargetId)
      toast({
        description: "API key deleted successfully",
      })
    }
    setShowDeleteConfirm(false)
    setDeleteTargetId(null)
  }

  const handleCopyKey = async (keyValue: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(keyValue)
      setCopiedFieldId(keyName)
      toast({
        description: "Key copied to clipboard",
      })
      setTimeout(() => setCopiedFieldId(null), 2000)
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to copy",
      })
    }
  }

  // Render a masked representation for hidden fields (e.g., passwords/keys)
  const renderFieldDisplay = (field?: Field) => {
    if (!field || !field.value) return "—"
    if (field.masked) {
      const len = field.value.length
      const maskedLen = Math.min(Math.max(len, 8), 32) // clamp to keep UI tidy
      return "•".repeat(maskedLen)
    }
    return field.value
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage and organize your API keys securely</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit API Key" : "Add New API Key"}</DialogTitle>
              <DialogDescription>
                Enter details for your API key. Name, Link, and Key are required fields.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>{field.name}</Label>
                    {!["Name", "Link", "Key"].includes(field.name) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveField(field.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id={field.name}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      type={field.name === "Link" ? "url" : field.masked ? "password" : "text"}
                      placeholder={`Enter ${field.name.toLowerCase()}`}
                      className="flex-1"
                    />
                    {["Name", "Link", "Key"].includes(field.name) ? null : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleMask(field.name)}
                        title={field.masked ? "Show" : "Hide"}
                      >
                        {field.masked ? "Show" : "Hide"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <AddFieldDropdown onAddField={handleAddField} existingFieldNames={formFields.map((f) => f.name)} />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>{editingId ? "Update" : "Add"} API Key</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No API keys yet</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenDialog} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First API Key
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto scrollbar">
              <Table>
                <TableHeader>
                    <TableRow>
                      {/* Always show Name first, then any other global fields (avoid duplicate Name) */}
                      <TableHead>Name</TableHead>
                      <TableHead>Link</TableHead>
                      {globalFields && globalFields.length > 0
                        ? globalFields
                            .filter((gf) => gf.name !== "Name" && gf.name !== "Link")
                            .map((gf) => (
                              <TableHead key={gf.name}>{gf.name}</TableHead>
                            ))
                        : null}
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => {
                    return (
                      <TableRow key={apiKey.id}>
                        {/* Name column (always present) */}
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{apiKey.fields.find((f) => f.name === "Name")?.value || "Unnamed"}</span>
                            {apiKey.fields.find((f) => f.name === "Name")?.value ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopyKey(
                                    apiKey.fields.find((f) => f.name === "Name")!.value,
                                    `${apiKey.id}:Name`,
                                  )
                                }
                                title="Copy Name"
                              >
                                {copiedFieldId === `${apiKey.id}:Name` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* Link column (always present) */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const lf = apiKey.fields.find((f) => f.name === "Link")
                              if (!lf?.value) return <span>—</span>
                              return isValidUrl(lf.value) ? (
                                <a
                                  href={lf.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline underline-offset-2"
                                >
                                  {lf.value}
                                </a>
                              ) : (
                                <span>{lf.value}</span>
                              )
                            })()}
                            {apiKey.fields.find((f) => f.name === "Link")?.value ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopyKey(
                                    apiKey.fields.find((f) => f.name === "Link")!.value,
                                    `${apiKey.id}:Link`,
                                  )
                                }
                                title="Copy Link"
                              >
                                {copiedFieldId === `${apiKey.id}:Link` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* Render other global fields in order (excluding Name and Link) */}
                        {globalFields && globalFields.length > 0
                          ? globalFields
                              .filter((gf) => gf.name !== "Name" && gf.name !== "Link")
                              .map((gf) => {
                                const field = apiKey.fields.find((f) => f.name === gf.name)
                                const copyKey = `${apiKey.id}:${gf.name}`
                                return (
                                  <TableCell key={gf.name}>
                                    <div className="flex items-center gap-2">
                                      <span>{renderFieldDisplay(field)}</span>
                                      {field?.value ? (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleCopyKey(field.value, copyKey)}
                                          title={`Copy ${gf.name}`}
                                        >
                                          {copiedFieldId === copyKey ? (
                                            <Check className="h-4 w-4" />
                                          ) : (
                                            <Copy className="h-4 w-4" />
                                          )}
                                        </Button>
                                      ) : null}
                                    </div>
                                  </TableCell>
                                )
                              })
                          : null}

                        <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsOpen(true)
                                handleEditKey(apiKey)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(apiKey.id)}
                              className="text-destructive hover:text-destructive"
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete API Key"
        description="Are you sure you want to delete this API key? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  )
}
