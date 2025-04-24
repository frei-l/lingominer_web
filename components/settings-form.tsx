"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dynamic from 'next/dynamic'
import { getUserConfig, setUserConfig, UserConfig } from '@/lib/storage'
import { useUser } from '@/lib/api/useDataFetch'
import { usersAPI } from '@/lib/api/useDataUpdate'
import { Eye, EyeOff } from 'lucide-react'
const ThemeSwitcher = dynamic(() => import('@/components/theme-switcher'), { ssr: false })

export function SettingsForm() {
  const { data: user, isLoading: userLoading } = useUser()
  const [mochiApiKey, setMochiApiKey] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showMochiApiKey, setShowMochiApiKey] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    const config = getUserConfig()
    if (config) {
      setApiKey(config.apiKey)
      setBaseUrl(config.baseUrl)
    }
    if (user && user.mochi_api_key) {
      setMochiApiKey(user.mochi_api_key)
    }
  }, [user])

  const handleMochiApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (user?.id) {
      usersAPI.update({ mochi_api_key: mochiApiKey })
    }
    setIsLoading(false)
  }

  const handleDangerousSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const config: UserConfig = { apiKey, baseUrl }
      setUserConfig(config)
      // Show success message or notification here
    } catch (error) {
      console.error('Failed to save settings:', error)
      // Show error message or notification here
    } finally {
      setIsLoading(false)
    }
  }
  if (userLoading) {
    return <div>Loading...</div>
  }
  if (user) {
    return (
      <div className="space-y-6">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details and API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Switcher */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <ThemeSwitcher />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={user?.id || ''}
                disabled
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">Name</Label>
              <Input
                id="userName"
                value={user?.name || ''}
                disabled
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKeys">API Keys</Label>
              <Input
                id="apiKeys"
                value={user?.api_keys?.map(key => key.key).join(', ') || ''}
                disabled
                readOnly
              />
            </div>
            <form onSubmit={handleMochiApiKeySubmit} className="space-y-2">
              <Label htmlFor="mochiApiKey">Mochi API Key</Label>
              <div className="relative">
                <Input
                  id="mochiApiKey"
                  type={showMochiApiKey ? "text" : "password"}
                  value={mochiApiKey}
                  onChange={(e) => setMochiApiKey(e.target.value)}
                  placeholder="Enter your Mochi API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowMochiApiKey(!showMochiApiKey)}
                >
                  {showMochiApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Mochi API Key"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Dangerous Zone Card */}
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Dangerous Zone</CardTitle>
            <CardDescription className="text-red-500">
              Warning: Modifying these settings may affect your application's functionality. Proceed with caution.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleDangerousSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="destructive" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Dangerous Settings"}
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    )
  }
}
