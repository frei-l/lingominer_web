"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface InitialViewProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    input: string
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InitialView({ onSubmit, input, handleInputChange }: InitialViewProps) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md p-4 shadow-lg">
                <form onSubmit={onSubmit} className="flex items-center">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask me anything..."
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                    />
                    <Button type="submit" size="icon" variant="ghost">
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </Card>
        </div>
    )
}
