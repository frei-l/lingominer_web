"use client"

import Reader from "@/components/reader/reader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Passage, createPassage, getPassages } from "@/lib/data/fetchPassage"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [content, setContent] = useState<string | null>(null)
  const [passages, setPassages] = useState<Passage[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [inputUrl, setInputUrl] = useState("")

  useEffect(() => {
    const fetchPassages = async () => {
      const result = await getPassages()
      setPassages(result.passages || [])
    }
    fetchPassages()
  }, [])

  const fetchContent = async () => {
    if (inputUrl) {
      try {
        const passageResult = await createPassage(inputUrl)
        if (passageResult.error) {
          console.error("Error creating passage:", passageResult.error)
          toast({
            title: "Error",
            description: "Failed to fetch content from URL",
            variant: "destructive",
          })
          return
        }
        setContent(passageResult.passage?.content || null)
      } catch (error) {
        console.error("Error fetching content:", error)
        toast({
          title: "Error",
          description: "Failed to fetch content from URL",
          variant: "destructive",
        })
      }
    } else {
      setContent(null)
    }
  }

  if (content !== null) {
    return <Reader content={content} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">LingoMiner Reader</h1>
        <form onSubmit={(e) => { e.preventDefault(); fetchContent(); }} className="space-y-4">
          <Input
            type="url"
            placeholder="Enter URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Read from URL
          </Button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Passages</h2>
          <div className="space-y-2">
            {passages.map((passage) => (
              <div
                key={passage.id}
                onClick={() => setContent(passage.content)}
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

