"use client"

import type React from "react"

// Component for rendering paragraphs with highlights
import { useNotesStore } from "@/lib/notes-store"
import { useRef, createRef } from "react"

interface TextParagraphProps {
    text: string
    paragraphIndex: number
    paragraphRef: React.RefObject<HTMLParagraphElement>
}

export default function TextParagraph({ text, paragraphIndex, paragraphRef }: TextParagraphProps) {
    const { getNotesByParagraph, activeNoteId, toggleNoteActive } = useNotesStore()

    // Create a map to store refs for each highlight
    const highlightRefs = useRef(new Map<string, React.RefObject<HTMLSpanElement | null>>())

    // Get notes for this paragraph
    const paragraphNotes = getNotesByParagraph(paragraphIndex)

    // Create refs for each note if they don't exist
    paragraphNotes.forEach((note) => {
        if (!highlightRefs.current.has(note.id)) {
            highlightRefs.current.set(note.id, createRef<HTMLSpanElement>())
        }
    })

    // If no notes, just render the paragraph
    if (paragraphNotes.length === 0) {
        return (
            <p ref={paragraphRef} className="mb-6 leading-relaxed text-justify indent-8 text-base" data-index={paragraphIndex}>
                {text}
            </p>
        )
    }

    // Sort notes by their start position to handle overlapping highlights
    const sortedNotes = [...paragraphNotes].sort((a, b) => a.startIndex - b.startIndex)

    // Build the paragraph with highlights
    const result = []
    let lastIndex = 0

    for (const note of sortedNotes) {
        // Add text before the highlight
        if (note.startIndex > lastIndex) {
            result.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, note.startIndex)}</span>)
        }

        // Get the ref for this highlight
        const highlightRef = highlightRefs.current.get(note.id)

        // Add the highlighted text
        result.push(
            <span key={`highlight-${note.id}`} className="relative inline" ref={highlightRef} data-note-id={note.id}>
                {text.substring(note.startIndex, note.endIndex)}
                <span
                    className={`absolute left-0 right-0 h-2 -bottom-1 ${activeNoteId === note.id ? "bg-yellow-300/60" : "bg-yellow-200/50"}`}
                    style={{ zIndex: 1 }}
                />
                <span
                    className="absolute left-0 right-0 top-0 bottom-0 cursor-pointer"
                    style={{ zIndex: 2 }}
                    onClick={() => toggleNoteActive(note.id)}
                />
            </span>,
        )

        lastIndex = note.endIndex
    }

    // Add any remaining text
    if (lastIndex < text.length) {
        result.push(<span key={`text-end`}>{text.substring(lastIndex)}</span>)
    }

    return (
        <p ref={paragraphRef} className="mb-6 leading-relaxed text-justify indent-8 text-base relative" data-index={paragraphIndex}>
            {result}
        </p>
    )
}

