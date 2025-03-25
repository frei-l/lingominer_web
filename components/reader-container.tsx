"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { StarterPage } from "@/components/reader-starter"
import { ReaderPage } from "@/components/reader-content"

export function ReaderContainer() {
    const [content, setContent] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const url = searchParams.get("url")
    const clipboardContent = searchParams.get("content")

    useEffect(() => {
        const fetchContent = async () => {
            if (url) {
                try {
                    const response = await fetch(url)
                    const text = await response.text()
                    setContent(text)
                } catch (error) {
                    console.error("Error fetching content:", error)
                    setContent("Error loading content. Please try again.")
                }
            } else if (clipboardContent) {
                setContent(decodeURIComponent(clipboardContent))
            } else {
                setContent(null)
            }
        }

        fetchContent()
    }, [url, clipboardContent])

    if (content !== null) {
        return <ReaderPage content={content} />
    }

    return <StarterPage />
}

