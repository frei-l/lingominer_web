"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/lib/data/fetchCards"

interface CardDialogProps {
  card: Card | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardDialog({ card, open, onOpenChange }: CardDialogProps) {
  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {card.url}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            {card.url}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Paragraph:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {card.paragraph}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Content:</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(card.content).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 px-4 font-medium">{key}</td>
                      <td className="py-2 px-4">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Position:</h3>
              <p className="text-gray-600">
                {card.pos_start} - {card.pos_end}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Status:</h3>
              <p className="text-gray-600">{card.status}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Created:</h3>
              <p className="text-gray-600">
                {new Date(card.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Modified:</h3>
              <p className="text-gray-600">
                {new Date(card.modified_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => window.open(card.url, '_blank')}>
            Visit Page
          </Button>
          <Button variant="default">Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

