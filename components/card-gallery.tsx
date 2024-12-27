"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { CardDialog } from "@/components/card-dialog"

interface WordCard {
  id: string
  word: string
  translation: string
  example: string
  tags: string[]
}

const sampleCards: WordCard[] = [
  {
    id: '1',
    word: 'Apfel',
    translation: 'Apple',
    example: 'Ich esse jeden Tag einen Apfel.',
    tags: ['Fruit', 'Food']
  },
  {
    id: '2',
    word: 'Buch',
    translation: 'Book',
    example: 'Sie liest ein interessantes Buch.',
    tags: ['Object', 'Education']
  },
  {
    id: '3',
    word: 'Haus',
    translation: 'House',
    example: 'Mein Haus ist nicht weit von hier.',
    tags: ['Building', 'Home']
  },
  // Add more sample cards as needed
]

export function CardGallery() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCard, setSelectedCard] = useState<WordCard | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredCards = sampleCards.filter(card =>
    card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCardClick = (card: WordCard) => {
    setSelectedCard(card)
    setDialogOpen(true)
  }

  return (
    <div>
      <SearchBar onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card 
            key={card.id} 
            className="flex flex-col transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-gray-800 cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <CardHeader className="bg-gray-50 dark:bg-gray-700 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-primary">{card.word}</CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300">{card.translation}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">&quot;{card.example}&quot;</p>
            </CardContent>
          </Card>
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

