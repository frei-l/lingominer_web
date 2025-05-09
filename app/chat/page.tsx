"use client"

import { CardContent } from "@/components/ui/card"

import type React from "react"

import ChatAvatar from "@/components/chat/chat-avatar"
import ChatMessage from "@/components/chat/chat-message"
import InitialView from "@/components/chat/chat-starter"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChat } from "@ai-sdk/react"
import { Send } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { useState } from "react"

export default function ChatPage() {
    const [hasStarted, setHasStarted] = useState(false)
    const { messages, input, handleInputChange, handleSubmit, status } = useChat()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (input.trim()) {
            if (!hasStarted) setHasStarted(true)
            handleSubmit(e)
        }
    }

    const isSubmittingOrStreaming = status === "submitted" || status === "streaming"

    return (
        <div className="flex flex-col h-screen ">
            <main className="flex-1 flex flex-col p-4 sm:p-8 max-w-3xl mx-auto w-full">
                {!hasStarted ? (
                    <InitialView onSubmit={onSubmit} input={input} handleInputChange={handleInputChange} />
                ) : (
                    <>
                        <div className="flex-1 space-y-4 overflow-y-auto pb-20">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <div key={message.id} className="flex items-start gap-3">
                                        <div className={message.role === "user" ? "order-2" : "order-1"}>
                                            <ChatAvatar isUser={message.role === "user"} />
                                        </div>
                                        <div className={message.role === "user" ? "order-1 flex-1" : "order-2 flex-1"}>
                                            <ChatMessage
                                                message={message}
                                                isStreaming={
                                                    status === "streaming" && index === messages.length - 1 && message.role === "assistant"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}

                                {status === "submitted" && (
                                    <div className="flex items-start gap-3">
                                        <ChatAvatar isUser={false} />
                                        <div className="flex-1">
                                            <Card className="bg-white inline-block">
                                                <CardContent className="p-3 flex">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-150 mx-1"></div>
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-300"></div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 to-transparent pt-16">
                            <Card className="max-w-3xl mx-auto">
                                <form onSubmit={onSubmit} className="flex items-center p-2">
                                    <Input
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Type your message..."
                                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        disabled={isSubmittingOrStreaming}
                                    />
                                    <Button type="submit" size="icon" variant="ghost" disabled={isSubmittingOrStreaming}>
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
