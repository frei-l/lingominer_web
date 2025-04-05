"use client"

import type React from "react"

import ExplanationBubble from "@/components/reader/explanation-bubble"
import SelectionMenu from "@/components/reader/selection-menu"
import TextParagraph from "@/components/reader/text-paragraph"
import { TextSelectionProvider, useTextSelection } from "@/contexts/text-selection-context"
import { AnimatePresence } from "motion/react"
import { createRef, useEffect, useRef, useState } from "react"
import { usePassage } from "@/lib/api/useDataFetch"
import type { Passage } from "@/lib/api/types"
import { passagesAPI } from "@/lib/api"
import { useSWRConfig } from "swr"
interface ReaderProps {
    passageId: string
}
export default function Reader({ passageId }: ReaderProps) {
    const { data: passage, error } = usePassage(passageId)

    if (error) {
        console.error("Error fetching passage:", error)
        return <div>Error loading passage</div>
    }

    if (!passage) {
        return <div>Loading...</div>
    }
    console.log(passage.notes)
    return (
        <TextSelectionProvider>
            <ReaderContent passage={passage} />
        </TextSelectionProvider>
    )
}


function ReaderContent({ passage }: { passage: Passage }) {
    const { mutate } = useSWRConfig()

    // Loading state
    const [isLoading, setIsLoading] = useState(false)
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

    // Store the current selection position for loading state
    const [loadingPosition, setLoadingPosition] = useState({ top: 0, right: 0 })

    // Refs
    const readerRef = useRef<HTMLDivElement>(null)

    const paragraphTitle = passage.content.split("\n")[0].replace(/^#\s*/, '')
    const paragraphs = passage.content.trim().split("\n\n").slice(1)

    // Create refs for each paragraph
    const paragraphRefs = useRef<Array<React.RefObject<HTMLParagraphElement>>>([])

    // Initialize paragraph refs if needed
    if (paragraphRefs.current.length !== paragraphs.length) {
        paragraphRefs.current = paragraphs.map(() => createRef<HTMLParagraphElement>()) as Array<React.RefObject<HTMLParagraphElement>>
    }


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
            const note = await passagesAPI.createNote(passage.id, {
                selected_text: selectionInfo.text,
                context: selectionInfo.context,
                paragraph_index: selectionInfo.paragraphIndex,
                start_index: selectionInfo.startIndex,
                end_index: selectionInfo.endIndex,
            })

            // Add note to store
            mutate(`/passages/${passage.id}`, {
                ...passage,
                notes: [...passage.notes, note]
            })
            setActiveNoteId(note.id)
        } catch (error) {
            console.error("Error generating explanation:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseExplanation = () => {
        setActiveNoteId(null)
    }

    // Get the active note from store
    const activeNote = passage.notes.find(note => note.id === activeNoteId)

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
                                notes={passage.notes}
                                activeNoteId={activeNoteId}
                                setActiveNoteId={setActiveNoteId}
                            />
                        ))}
                    </div>
                    {/* Explanation Bubble */}
                    <AnimatePresence>
                        {(activeNote || isLoading) && (
                            <ExplanationBubble
                                note={activeNote || null}
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