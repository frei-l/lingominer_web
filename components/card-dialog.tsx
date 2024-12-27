"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WordCard {
  id: string
  word: string
  translation: string
  example: string
  tags: string[]
}

interface CardDialogProps {
  card: WordCard | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardDialog({ card, open, onOpenChange }: CardDialogProps) {
  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{card.word}</DialogTitle>
          <DialogDescription className="text-lg text-gray-600 dark:text-gray-300">
            {card.translation}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-semibold mb-2">Example:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">
            &quot;{card.example}&quot;
          </p>
          <h3 className="font-semibold mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

