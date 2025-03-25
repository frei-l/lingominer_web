import type React from "react"
import { Button } from "@/components/ui/button"
import { ImportIcon as Translate, BookOpen, NotebookPen } from "lucide-react"

interface FloatingMenuProps {
    position: { x: number; y: number }
    onTranslate: () => void
    onExplain: () => void
    onAddToNotes: () => void
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ position, onTranslate, onExplain, onAddToNotes }) => (
    <div
        style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
        }}
        className="bg-background border rounded-md shadow-lg p-2 flex space-x-2"
    >
        <Button size="sm" onClick={onTranslate}>
            <Translate className="w-4 h-4 mr-2" />
            Translate
        </Button>
        <Button size="sm" onClick={onExplain}>
            <BookOpen className="w-4 h-4 mr-2" />
            Explain
        </Button>
        <Button size="sm" onClick={onAddToNotes}>
            <NotebookPen className="w-4 h-4 mr-2" />
            Add to Notes
        </Button>
    </div>
)

