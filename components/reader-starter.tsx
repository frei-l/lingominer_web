"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClipboardIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function StarterPage() {
    const [url, setUrl] = useState("")
    const router = useRouter()
    const { toast } = useToast()

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (url) {
            router.push(`/reader?url=${encodeURIComponent(url)}`)
        }
    }

    const handleImportFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText()
            if (text) {
                router.push(`/reader?content=${encodeURIComponent(text)}`)
            } else {
                toast({
                    description: "Clipboard is empty",
                    duration: 2000,
                })
            }
        } catch (err) {
            toast({
                variant: "destructive",
                description: "Failed to access clipboard, please check browser permissions",
                duration: 3000,
            })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md space-y-8">
                <h1 className="text-3xl font-bold text-center">LingoMiner Reader</h1>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <Input
                        type="url"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full"
                    />
                    <Button type="submit" className="w-full">
                        Read from URL
                    </Button>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                </div>
                <Button onClick={handleImportFromClipboard} variant="outline" className="w-full">
                    <ClipboardIcon className="mr-2 h-4 w-4" />
                    Read from Clipboard
                </Button>
            </div>
            <Toaster />
        </div>
    )
}

