"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserConfig } from '@/lib/storage'

export default function AuthCheck() {
    const router = useRouter()

    useEffect(() => {
        const config = getUserConfig()
        if (!config) {
            router.push('/login')
        }
    }, [router])

    return null
} 