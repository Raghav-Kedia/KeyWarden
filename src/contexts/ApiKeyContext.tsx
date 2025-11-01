"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ApiKey, GlobalField } from "../types"

interface ApiKeyContextType {
  apiKeys: ApiKey[]
  globalFields: GlobalField[]
  addApiKey: (apiKey: Omit<ApiKey, "id" | "createdAt">) => void
  updateApiKey: (id: string, updates: Partial<ApiKey>) => void
  deleteApiKey: (id: string) => void
  addGlobalField: (name: string) => GlobalField
  updateGlobalField: (id: string, name: string) => void
  deleteGlobalField: (id: string) => void
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined)

const DEFAULT_FIELDS: GlobalField[] = [
  { id: "1", name: "Name" },
  { id: "2", name: "Link" },
  { id: "3", name: "Key" },
]

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [globalFields, setGlobalFields] = useState<GlobalField[]>(DEFAULT_FIELDS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    if (isLoaded) return

    const savedApiKeys = localStorage.getItem("apiKeys")
    const savedGlobalFields = localStorage.getItem("globalFields")

    if (savedGlobalFields) {
      try {
        setGlobalFields(JSON.parse(savedGlobalFields))
      } catch {
        setGlobalFields(DEFAULT_FIELDS)
      }
    } else {
      setGlobalFields(DEFAULT_FIELDS)
    }

    if (savedApiKeys) {
      try {
        const parsed = JSON.parse(savedApiKeys)
        const keysWithDates = parsed.map((key: any) => ({
          ...key,
          createdAt: new Date(key.createdAt),
        }))
        setApiKeys(keysWithDates)
      } catch {
        setApiKeys([])
      }
    } else {
      // No seeding: start with empty API keys when none are saved
      setApiKeys([])
    }

    setIsLoaded(true)
  }, [isLoaded])

  // Save to localStorage whenever data changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("apiKeys", JSON.stringify(apiKeys))
    }
  }, [apiKeys, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("globalFields", JSON.stringify(globalFields))
    }
  }, [globalFields, isLoaded])

  const addApiKey = (apiKeyData: Omit<ApiKey, "id" | "createdAt">) => {
    const newApiKey: ApiKey = {
      ...apiKeyData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setApiKeys((prev) => [...prev, newApiKey])
  }

  const updateApiKey = (id: string, updates: Partial<ApiKey>) => {
    setApiKeys((prev) => prev.map((key) => (key.id === id ? { ...key, ...updates } : key)))
  }

  const deleteApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id))
  }

  const addGlobalField = (name: string): GlobalField => {
    const newField: GlobalField = {
      id: crypto.randomUUID(),
      name,
    }
    setGlobalFields((prev) => [...prev, newField])
    return newField
  }

  const updateGlobalField = (id: string, name: string) => {
    const oldField = globalFields.find((f) => f.id === id)
    if (!oldField) return

    setGlobalFields((prev) => prev.map((field) => (field.id === id ? { ...field, name } : field)))

    // Update field names in all existing API keys
    setApiKeys((prev) =>
      prev.map((key) => ({
        ...key,
        fields: key.fields.map((field) => (field.name === oldField.name ? { ...field, name } : field)),
      })),
    )
  }

  const deleteGlobalField = (id: string) => {
    const fieldToDelete = globalFields.find((f) => f.id === id)
    if (!fieldToDelete) return

    if (["Name", "Link", "Key"].includes(fieldToDelete.name)) {
      return
    }

    setGlobalFields((prev) => prev.filter((field) => field.id !== id))

    // Remove this field from all existing API keys
    setApiKeys((prev) =>
      prev.map((key) => ({
        ...key,
        fields: key.fields.filter((field) => field.name !== fieldToDelete.name),
      })),
    )
  }

  return (
    <ApiKeyContext.Provider
      value={{
        apiKeys,
        globalFields,
        addApiKey,
        updateApiKey,
        deleteApiKey,
        addGlobalField,
        updateGlobalField,
        deleteGlobalField,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKeys() {
  const context = useContext(ApiKeyContext)
  if (context === undefined) {
    throw new Error("useApiKeys must be used within an ApiKeyProvider")
  }
  return context
}
