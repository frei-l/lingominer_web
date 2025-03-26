"use client"

import React, { useState } from 'react'
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { CardDialog } from "@/components/card-dialog"
import { Card } from "@/lib/data/fetchCards"

export function CardGallery({ cards }: { cards: Card[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredCards = cards.filter(card =>
    card.paragraph.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCardClick = (card: Card) => {
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
            <CardContent className="flex-grow p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {(() => {
                  const words = card.paragraph.split(' ');
                  const selectedText = card.paragraph.slice(card.pos_start, card.pos_end);
                  const selectedStartWord = card.paragraph.slice(0, card.pos_start).split(' ').length - 1;
                  const beforeWords = words.slice(Math.max(0, selectedStartWord - 10), selectedStartWord).join(' ');
                  const afterWords = words.slice(selectedStartWord + selectedText.split(' ').length, selectedStartWord + selectedText.split(' ').length + 10).join(' ');
                  return (
                    <>
                      {beforeWords && `${beforeWords} `}
                      <span className="bg-primary/20 font-medium">{selectedText}</span>
                      {afterWords && ` ${afterWords}`}
                    </>
                  );
                })()}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Status: {card.status}
              </div>
            </CardContent>
          </UICard>
        ))}
      </div>
      <CardDialog
        card={selectedCard}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

