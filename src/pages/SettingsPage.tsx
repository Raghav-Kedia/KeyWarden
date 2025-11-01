"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../components/theme-provider"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { ConfirmationDialog } from "../components/ConfirmationDialog"
import { useToast } from "../hooks/use-toast"
import { User, Shield, Palette, Trash2, Save } from "lucide-react"

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleProfileUpdate = async () => {
    if (!profileData.username.trim() || !profileData.email.trim()) {
      toast({
        variant: "destructive",
        description: "Username and email are required",
      })
      return
    }

    setIsUpdatingProfile(true)
    try {
      // Mock API call - replace with real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (updateProfile) {
        updateProfile({
          username: profileData.username.trim(),
          email: profileData.email.trim(),
        })
      }

      toast({
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        description: "All password fields are required",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        description: "New passwords do not match",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        variant: "destructive",
        description: "Password must be at least 6 characters long",
      })
      return
    }

    setIsChangingPassword(true)
    try {
      // Validate current password against stored credentials in localStorage
      const credsStr = localStorage.getItem("credentials")
      const creds = credsStr ? (JSON.parse(credsStr) as { email: string; password: string }) : null
      if (!creds || creds.password !== passwordData.currentPassword) {
        toast({ variant: "destructive", description: "Current password is incorrect" })
        return
      }

      // Update stored credentials with new password
      const newCreds = { ...creds, password: passwordData.newPassword }
      localStorage.setItem("credentials", JSON.stringify(newCreds))

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        description: "Password changed successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to change password",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Mock API call - replace with real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        description: "Account deleted successfully",
      })

      // Log out and redirect
      logout()
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete account",
      })
    }
    setShowDeleteConfirm(false)
  }

  const getThemeDisplayName = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      case "system":
        return "System"
      default:
        return "System"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Update your personal information and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate} disabled={isUpdatingProfile}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
              <Shield className="h-4 w-4 mr-2" />
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the appearance of the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Current: {getThemeDisplayName(theme)}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Account"
        description="Are you sure you want to delete your account? This will permanently remove all your data, including API keys and settings. This action cannot be undone."
        confirmText="Delete Account"
        onConfirm={handleDeleteAccount}
        variant="destructive"
      />
    </div>
  )
}
