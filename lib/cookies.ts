"use server"
import { cookies } from 'next/headers'

export interface UserConfig {
  baseUrl: string
  apiKey: string
}

const LINGOMINER_BASE_URL = 'lingominer_base_url'
const LINGOMINER_API_KEY = 'lingominer_api_key'

export async function getUserConfig(): Promise<UserConfig | null> {
  const cookieStore = await cookies()
  const baseUrlCookie = cookieStore.get(LINGOMINER_BASE_URL)
  const apiKeyCookie = cookieStore.get(LINGOMINER_API_KEY)
  
  if (!baseUrlCookie || !apiKeyCookie) {
    return null
  }

  return {
    baseUrl: baseUrlCookie.value,
    apiKey: apiKeyCookie.value
  }
}

export async function setUserConfig(config: UserConfig) {
  const cookieStore = await cookies()
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }

  cookieStore.set({
    name: LINGOMINER_BASE_URL,
    value: config.baseUrl,
    ...cookieOptions
  })

  cookieStore.set({
    name: LINGOMINER_API_KEY,
    value: config.apiKey,
    ...cookieOptions
  })
}

export async function removeUserConfig() {
  const cookieStore = await cookies()
  cookieStore.delete(LINGOMINER_BASE_URL)
  cookieStore.delete(LINGOMINER_API_KEY)
}

export async function hasValidConfig(): Promise<boolean> {
  const cookieStore = await cookies()
  const baseUrlCookie = cookieStore.get(LINGOMINER_BASE_URL)
  const apiKeyCookie = cookieStore.get(LINGOMINER_API_KEY)
  
  return Boolean(baseUrlCookie?.value && apiKeyCookie?.value)
} 