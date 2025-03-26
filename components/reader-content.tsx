"use client"

import { useEffect, useRef, useState } from "react"
import { useTextSelection } from "../hooks/use-text-selection"
import { FloatingMenu } from "./floating-menu"

interface ReaderPageProps {
    content: string
}

export function ReaderPage({ content }: ReaderPageProps) {
    const [passageContent, setPassageContent] = useState<string[]>([])
    const [passageTitle, setPassageTitle] = useState<string>('')
    const menuRef = useRef<HTMLDivElement>(null)
    const resultRef = useRef<HTMLDivElement>(null)

    const { showFloating, position, selectedText, setShowFloating } = useTextSelection({
        menuRef: menuRef as React.RefObject<HTMLDivElement>,
        resultRef: resultRef as React.RefObject<HTMLDivElement>,
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

    useEffect(() => {
        setPassageTitle(content.split("\n")[0].replace(/^#\s*/, ''))
        const markdownContent = content.split("\n").slice(1)
        setPassageContent(markdownContent)
    }, [content])

    return (
        <div className="max-w-3xl mx-auto p-4 bg-background text-foreground">
            <h1 className="text-3xl font-bold mb-8 text-center">{passageTitle}</h1>
            {passageContent.map((paragraph, index) => (
                <p 
                    key={index} 
                    className="mb-6 leading-relaxed text-justify indent-8 text-base"
                >
                    {paragraph}
                </p>
            ))}
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

