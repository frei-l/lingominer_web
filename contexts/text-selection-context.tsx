"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SelectionInfo } from "@/lib/types"

interface TextSelectionContextType {
    // Selection state
    selectedText: string
    contextText: string
    showMenu: boolean
    selectionPosition: { top: number; left: number; width: number; height: number }
    currentTextPosition: { start: number; end: number }
    currentParagraphIndex: number

    // Methods
    getSelectionInfo: () => SelectionInfo | null
    resetSelection: () => void
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined)

interface TextSelectionProviderProps {
    children: ReactNode
}

export function TextSelectionProvider({ children }: TextSelectionProviderProps) {
    // Selection state
    const [selectedText, setSelectedText] = useState("")
    const [contextText, setContextText] = useState("")
    const [showMenu, setShowMenu] = useState(false)
    const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(-1)
    const [currentTextPosition, setCurrentTextPosition] = useState({ start: -1, end: -1 })

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection()

            // If there's no selection or it's collapsed (cursor only), hide the menu
            if (!selection || selection.isCollapsed) {
                setShowMenu(false)
                return
            }

            const selectedText = selection.toString().trim()

            // If the selected text is empty, hide the menu
            if (!selectedText) {
                setShowMenu(false)
                return
            }

            // Otherwise, process the selection
            setSelectedText(selectedText)

            // Get the paragraph containing the selection
            const range = selection.getRangeAt(0)
            let paragraphNode = range.commonAncestorContainer

            // Navigate up to find the paragraph
            while (paragraphNode && paragraphNode.nodeName !== "P") {
                paragraphNode = paragraphNode.parentNode as Node
            }

            if (!paragraphNode) {
                setShowMenu(false)
                return
            }

            // Get paragraph index from data-index attribute
            const paragraphIndex =
                paragraphNode instanceof HTMLElement ? Number.parseInt(paragraphNode.dataset.index || "-1", 10) : -1

            if (paragraphIndex === -1) {
                setShowMenu(false)
                return
            }

            // Set the context (full paragraph)
            const paragraphText = paragraphNode.textContent || ""
            setContextText(paragraphText)
            setCurrentParagraphIndex(paragraphIndex)

            // Find the start and end position of the selected text within the paragraph
            const paragraphContent = paragraphText
            const selectionStart = paragraphContent.indexOf(selectedText)
            const selectionEnd = selectionStart + selectedText.length

            setCurrentTextPosition({
                start: selectionStart,
                end: selectionEnd,
            })

            // Get the exact selection rectangle
            const rect = range.getBoundingClientRect()

            // Store the absolute selection position (not relative to container)
            setSelectionPosition({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            })

            setShowMenu(true)
        }

        document.addEventListener("selectionchange", handleSelectionChange)

        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange)
        }
    }, [])

    // Create a selection info object from the current selection
    const getSelectionInfo = (): SelectionInfo | null => {
        if (!selectedText || currentParagraphIndex === -1) return null

        return {
            text: selectedText,
            context: contextText,
            paragraphIndex: currentParagraphIndex,
            startIndex: currentTextPosition.start,
            endIndex: currentTextPosition.end,
        }
    }

    // Reset the selection menu
    const resetSelection = () => {
        setShowMenu(false)
    }

    const value = {
        // Selection state
        selectedText,
        contextText,
        showMenu,
        selectionPosition,
        currentTextPosition,
        currentParagraphIndex,

        // Methods
        getSelectionInfo,
        resetSelection,
    }

    return <TextSelectionContext.Provider value={value}>{children}</TextSelectionContext.Provider>
}

export function useTextSelection() {
    const context = useContext(TextSelectionContext)
    if (context === undefined) {
        throw new Error("useTextSelection must be used within a TextSelectionProvider")
    }
    return context
}

