"use client"

import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "motion/react"

interface ChatMessageProps {
    message: Message
    isStreaming?: boolean
}

export default function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
    const isUser = message.role === "user"

    return (
        <motion.div
            className={cn("flex", isUser ? "justify-end" : "justify-start")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={cn(isUser ? "bg-slate-200" : "bg-white", "transition-all duration-300 ease-in-out")}>
                <CardContent className="p-3 text-sm">
                    {message.content}
                    {isStreaming && !isUser && <span className="inline-block ml-1 animate-pulse">▋</span>}
                </CardContent>
            </Card>
        </motion.div>
    )
}
