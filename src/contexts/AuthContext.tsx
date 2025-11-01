"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Credentials = {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile?: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }

    // Ensure credentials exist in storage (initialize defaults if missing)
    const savedCreds = localStorage.getItem("credentials")
    if (!savedCreds) {
      const defaultCreds: Credentials = { email: "admin@example.com", password: "password" }
      localStorage.setItem("credentials", JSON.stringify(defaultCreds))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate against credentials stored in localStorage
    const savedCredsStr = localStorage.getItem("credentials")
    const savedCreds: Credentials | null = savedCredsStr ? JSON.parse(savedCredsStr) : null

    if (savedCreds && email === savedCreds.email && password === savedCreds.password) {
      // Prefer existing stored user profile, else create a minimal default user
      const existingUserStr = localStorage.getItem("user")
      const existingUser = existingUserStr ? (JSON.parse(existingUserStr) as User) : null
      const loggedInUser: User = existingUser
        ? { ...existingUser, email: savedCreds.email }
        : { id: "1", email: savedCreds.email, username: "User" }

      setUser(loggedInUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(loggedInUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    // Note: Do not clear apiKeys/globalFields so data persists across sessions
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // If email is updated in profile, keep credentials email in sync
      if (updates.email) {
        const savedCredsStr = localStorage.getItem("credentials")
        if (savedCredsStr) {
          const savedCreds: Credentials = JSON.parse(savedCredsStr)
          const newCreds: Credentials = { ...savedCreds, email: updates.email }
          localStorage.setItem("credentials", JSON.stringify(newCreds))
        }
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
