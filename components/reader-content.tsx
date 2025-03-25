"use client"

import { useRef } from "react"
import { useTextSelection } from "../hooks/use-text-selection"
import { FloatingMenu } from "./floating-menu"

interface ReaderPageProps {
    content: string
}

export function ReaderPage({ content }: ReaderPageProps) {
    const menuRef = useRef<HTMLDivElement>(null)
    const resultRef = useRef<HTMLDivElement>(null)

    const { showFloating, position, selectedText, setShowFloating } = useTextSelection({
        menuRef,
        resultRef,
        onHide: () => setShowFloating(false),
    })

    const handleTranslate = () => {
        // Implement translation logic here
        console.log("Translate:", selectedText)
    }

    const handleExplain = () => {
        // Implement explanation logic here
        console.log("Explain:", selectedText)
    }

    const handleAddToNotes = () => {
        // Implement add to notes logic here
        console.log("Add to notes:", selectedText)
    }

    return (
        <div className="max-w-2xl mx-auto p-4 bg-background text-foreground">
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
                {content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            {showFloating && (
                <div ref={menuRef}>
                    <FloatingMenu
                        position={position}
                        onTranslate={handleTranslate}
                        onExplain={handleExplain}
                        onAddToNotes={handleAddToNotes}
                    />
                </div>
            )}
        </div>
    )
}

