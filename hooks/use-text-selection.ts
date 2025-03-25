"use client"

import { useState, useEffect, type RefObject } from "react"

interface Position {
    x: number
    y: number
}

interface UseTextSelectionProps {
    menuRef: RefObject<HTMLDivElement>
    resultRef: RefObject<HTMLDivElement>
    onHide: () => void
}

export function useTextSelection({ menuRef, resultRef, onHide }: UseTextSelectionProps) {
    const [showFloating, setShowFloating] = useState(false)
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
    const [selectedText, setSelectedText] = useState("")

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection()
            const text = selection?.toString().trim() || ""

            if (!text) {
                setShowFloating(false)
                setSelectedText("")
                onHide()
                return
            }

            const range = selection?.getRangeAt(0)
            const rect = range?.getBoundingClientRect()

            if (rect) {
                setPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                })
                setSelectedText(text)
                setShowFloating(true)
            }
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (
                showFloating &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                resultRef.current &&
                !resultRef.current.contains(e.target as Node)
            ) {
                setShowFloating(false)
                setSelectedText("")
                onHide()
            }
        }

        document.addEventListener("selectionchange", handleSelection)
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("selectionchange", handleSelection)
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [menuRef, resultRef, onHide, showFloating])

    return {
        showFloating,
        setShowFloating,
        position,
        selectedText,
    }
}

