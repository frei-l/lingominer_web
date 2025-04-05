"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { usePassages } from "@/lib/api/useDataFetch"
import { passagesAPI } from "@/lib/api/useDataUpdate"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [inputUrl, setInputUrl] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data: passages = [], error: passagesError } = usePassages()

  if (passagesError) {
    console.error("Error fetching passages:", passagesError)
  }

  const handleFetchContent = async () => {
    if (!inputUrl) return

    setIsCreating(true)
    try {
      const passage = await passagesAPI.create({ url: inputUrl })
      router.push(`/reader/${passage.id}`)
    } catch (error) {
      console.error("Error creating passage:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch content from URL",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">LingoMiner Reader</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleFetchContent(); }} className="space-y-4">
          <Input
            type="url"
            placeholder="Enter URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full"
            disabled={isCreating}
          />
          <Button type="submit" className="w-full" disabled={isCreating || !inputUrl}>
            {isCreating ? "Creating passage..." : "Read from URL"}
          </Button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Passages</h2>
          <div className="space-y-2">
            {passages.map((passage) => (
              <div
                key={passage.id}
                onClick={() => router.push(`/reader/${passage.id}`)}
                className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
              >
                <h3 className="font-medium">{passage.title}</h3>
                <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                  {new Date(passage.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

