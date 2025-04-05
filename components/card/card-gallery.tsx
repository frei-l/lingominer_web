"use client"

import React, { useState } from 'react'
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { CardDialog } from "@/components/card/card-dialog"
import { useCards } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function CardGallery() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCard, setSelectedCard] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: cards, error, isLoading } = useCards()

  if (isLoading) {
    return <div className="flex justify-center items-center py-10">Loading cards...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load cards: {error.message}</AlertDescription>
      </Alert>
    )
  }

  const filteredCards = cards ? cards.filter(card =>
    card.paragraph.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.url.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleCardClick = (card: any) => {
    setSelectedCard(card)
    setDialogOpen(true)
  }

  return (
    <div>
      <SearchBar onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <UICard
            key={card.id}
            className="flex flex-col transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-gray-800 cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <CardHeader className="bg-gray-50 dark:bg-gray-700 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-primary">
                {card.paragraph.slice(card.pos_start, card.pos_end)}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300" suppressHydrationWarning>
                {/* different timezone will cause hydration error */}
                {new Date(card.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                {card.url}
              </p>
            </CardContent>
          </UICard>
        ))}
      </div>
      <CardDialog card={selectedCard} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

