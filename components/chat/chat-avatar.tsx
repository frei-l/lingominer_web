"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
    isUser: boolean
    showName?: boolean
}

export default function ChatAvatar({ isUser, showName = true }: ChatAvatarProps) {
    return (
        <div className="flex flex-col items-center gap-1">
            <Avatar className={cn("h-8 w-8 flex items-center justify-center", isUser ? "bg-blue-100" : "bg-emerald-100")}>
                <AvatarFallback
                    className={cn("flex items-center justify-center", isUser ? "text-blue-600" : "text-emerald-600")}
                >
                    {isUser ? <User size={16} /> : <GraduationCap size={16} />}
                </AvatarFallback>
            </Avatar>
            {!isUser && showName && <span className="text-xs text-slate-500 font-medium">lingominer</span>}
        </div>
    )
}
