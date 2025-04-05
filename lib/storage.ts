"use client"

export interface UserConfig {
  baseUrl: string
  apiKey: string
}

const LINGOMINER_BASE_URL = 'lingominer_base_url'
const LINGOMINER_API_KEY = 'lingominer_api_key'

export function getUserConfig(): UserConfig | null {
  if (typeof window === 'undefined') {
    return null
  }

  const baseUrl = localStorage.getItem(LINGOMINER_BASE_URL)
  const apiKey = localStorage.getItem(LINGOMINER_API_KEY)

  if (!baseUrl || !apiKey) {
    return null
  }
  return {
    baseUrl: baseUrl as string,
    apiKey: apiKey as string
  }
}

export function setUserConfig(config: UserConfig) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(LINGOMINER_BASE_URL, config.baseUrl)
  localStorage.setItem(LINGOMINER_API_KEY, config.apiKey)
}
