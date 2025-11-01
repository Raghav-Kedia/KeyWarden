"use client"

import type React from "react"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ApiKeyProvider } from "./contexts/ApiKeyContext"
import { Toaster } from "./components/ui/toaster"
import LoginPage from "./pages/LoginPage"
import DashboardLayout from "./components/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import FieldRegistryPage from "./pages/FieldRegistryPage"
import SettingsPage from "./pages/SettingsPage"
import { ScrollToTop } from "./components/ScrollToTop"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="api-dashboard-theme">
      <AuthProvider>
        <ApiKeyProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="fields" element={<FieldRegistryPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </ApiKeyProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
