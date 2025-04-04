"use client"

import type React from "react"

import ExplanationBubble from "@/components/reader/explanation-bubble"
import SelectionMenu from "@/components/reader/selection-menu"
import TextParagraph from "@/components/reader/text-paragraph"
import { TextSelectionProvider, useTextSelection } from "@/contexts/text-selection-context"
import { generateExplanation } from "@/lib/explanation-service"
import { useNotesStore } from "@/lib/notes-store"
import { AnimatePresence } from "motion/react"
import { createRef, useEffect, useRef, useState } from "react"

interface ReaderProps {
    content: string;
}

function ReaderContent({ content }: ReaderProps) {
    // Loading state
    const [isLoading, setIsLoading] = useState(false)

    // Store the current selection position for loading state
    const [loadingPosition, setLoadingPosition] = useState({ top: 0, right: 0 })

    // Refs
    const readerRef = useRef<HTMLDivElement>(null)

    // Split the content into paragraphs
    const paragraphTitle = content.split("\n")[0].replace(/^#\s*/, '')
    const paragraphs = content.trim().split("\n\n").slice(1)

    // Create refs for each paragraph
    const paragraphRefs = useRef<Array<React.RefObject<HTMLParagraphElement>>>([])

    // Initialize paragraph refs if needed
    if (paragraphRefs.current.length !== paragraphs.length) {
        paragraphRefs.current = paragraphs.map(() => createRef<HTMLParagraphElement>()) as Array<React.RefObject<HTMLParagraphElement>>
    }

    // Notes store
    const { setActiveNote, getActiveNote, addNote } = useNotesStore()

    // Text selection context
    const { showMenu, selectionPosition, getSelectionInfo, resetSelection } = useTextSelection()

    // Calculate menu position based on selection position and container
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (showMenu && readerRef.current) {
            const containerRect = readerRef.current.getBoundingClientRect()

            // Calculate position relative to the reader container
            setMenuPosition({
                x: selectionPosition.left - containerRect.left,
                y: selectionPosition.top + selectionPosition.height - containerRect.top,
            })
        }
    }, [showMenu, selectionPosition])

    const handleExplain = async () => {
        const selectionInfo = getSelectionInfo()
        if (!selectionInfo) return

        // Calculate and store the loading position before setting isLoading
        if (readerRef.current) {
            const containerRect = readerRef.current.getBoundingClientRect()
            setLoadingPosition({
                top: selectionPosition.top - containerRect.top,
                right: 0,
            })
        }

        setIsLoading(true)
        resetSelection()

        try {
            // Generate explanation
            const explanation = await generateExplanation(selectionInfo)

            // Add note to store
            addNote(selectionInfo, explanation)
        } catch (error) {
            console.error("Error generating explanation:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseExplanation = () => {
        setActiveNote(null)
    }

    // Get the active note from store
    const activeNote = getActiveNote()

    return (
        <div className="relative" ref={readerRef} data-reader-container>
            <div className="flex-1">
                {/* Main content area */}
                <div className="relative mx-auto max-w-3xl">
                    <div className="p-4 bg-background text-foreground">
                        <h1 className="text-3xl font-bold mb-8 text-center">{paragraphTitle}</h1>
                        {paragraphs.map((paragraph, index) => (
                            <TextParagraph
                                key={index}
                                text={paragraph}
                                paragraphIndex={index}
                                paragraphRef={paragraphRefs.current[index]}
                            />
                        ))}
                    </div>
                    {/* Explanation Bubble */}
                    <AnimatePresence>
                        {(activeNote || isLoading) && (
                            <ExplanationBubble
                                note={activeNote}
                                isLoading={isLoading}
                                onClose={handleCloseExplanation}
                                loadingPosition={isLoading ? loadingPosition : undefined}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Selection Menu */}
            <AnimatePresence>
                {showMenu && !isLoading && <SelectionMenu position={menuPosition} onExplain={handleExplain} />}
            </AnimatePresence>

        </div>
    )
}

export default function Reader({ content }: ReaderProps) {
    return (
        <TextSelectionProvider>
            <ReaderContent content={content} />
        </TextSelectionProvider>
    )
}

