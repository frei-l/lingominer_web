"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dynamic from 'next/dynamic'
import { getUserConfig, setUserConfig, UserConfig } from '@/lib/storage'

const ThemeSwitcher = dynamic(() => import('@/components/theme-switcher'), { ssr: false })

export function SettingsForm() {
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const config = getUserConfig()
    if (config) {
      setApiKey(config.apiKey)
      setBaseUrl(config.baseUrl)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure your API settings here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
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
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <ThemeSwitcher />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

