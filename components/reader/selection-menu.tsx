"use client"

// Component for the selection menu
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { ImportIcon as Translate, BookOpen, FileText } from "lucide-react"

interface SelectionMenuProps {
    position: { x: number; y: number }
    onExplain: () => void
}

export default function SelectionMenu({ position, onExplain }: SelectionMenuProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 bg-background border rounded-md shadow-lg flex"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >

            <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2" onClick={onExplain}>
                <BookOpen size={16} />
                <span>Explain</span>
            </Button>

        </motion.div>
    )
}

