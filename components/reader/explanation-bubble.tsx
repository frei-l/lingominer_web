"use client"

// Component for the explanation bubble
import { useRef, useEffect, useState } from "react"
import type { Note } from "@/lib/types"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface ExplanationBubbleProps {
    note: Note | null
    isLoading: boolean
    onClose: () => void
    loadingPosition?: { top: number; right: number }
}

export default function ExplanationBubble({ note, isLoading, onClose, loadingPosition }: ExplanationBubbleProps) {
    const bubbleRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ top: 0, right: 0 })

    // Find the highlighted element and position the bubble next to it
    useEffect(() => {
        // If we have a loading position and we're in loading state, use that
        if (isLoading && loadingPosition) {
            setPosition(loadingPosition)
            return
        }

        // Otherwise, if we have a note, find its highlighted element
        if (!note || !bubbleRef.current) return

        // Find the highlighted element by data-note-id
        const highlightedElement = document.querySelector(`[data-note-id="${note.id}"]`) as HTMLElement

        if (highlightedElement) {
            const rect = highlightedElement.getBoundingClientRect()

            // Get the reader container
            const readerContainer = document.querySelector("[data-reader-container]") as HTMLElement

            if (readerContainer) {
                const containerRect = readerContainer.getBoundingClientRect()

                // Calculate position relative to the reader container
                const top = rect.top - containerRect.top

                // Position the bubble to the right of the highlighted text
                setPosition({
                    top,
                    right: 0,
                })
            }
        }
    }, [note, isLoading, loadingPosition])

    return (
        <motion.div
            ref={bubbleRef}
            initial={{ opacity: 0, x: "200%" }}
            animate={{ opacity: 1, x: "100%" }}
            exit={{ opacity: 0, x: "200%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute z-10 w-80 right-0"
            style={{
                top: `${position.top}px`,
            }}
        >
            <Card className="p-4 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold">Explanation</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                        <X size={14} />
                    </Button>
                </div>

                <div className="relative">
                    {/* Speech bubble pointer pointing to the left (toward the text) */}
                    <div className="absolute -left-4 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-background border-b-8 border-b-transparent" />

                    <div className="bg-muted/50 p-3 rounded-lg">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                        ) : note ? (
                            <>
                                <div className="mb-2 text-xs text-muted-foreground">"{note.text}"</div>
                                <p className="text-sm">{note.explanation}</p>
                            </>
                        ) : null}
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

