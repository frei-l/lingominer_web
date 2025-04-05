"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/lib/api"
import { Trash2 } from "lucide-react"

interface CardDialogProps {
  card: Card | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (cardId: string) => void
}

export function CardDialog({ card, open, onOpenChange, onDelete }: CardDialogProps) {

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{card.paragraph.slice(card.pos_start, card.pos_end)}</DialogTitle>
          <DialogDescription suppressHydrationWarning>
            Created: {new Date(card.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Context</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {(() => {
                const words = card.paragraph.split(' ');
                const selectedText = card.paragraph.slice(card.pos_start, card.pos_end);
                const selectedStartWord = card.paragraph.slice(0, card.pos_start).split(' ').length - 1;
                const beforeWords = words.slice(Math.max(0, selectedStartWord - 30), selectedStartWord).join(' ');
                const afterWords = words.slice(selectedStartWord + selectedText.split(' ').length, selectedStartWord + selectedText.split(' ').length + 30).join(' ');
                return (
                  <>
                    {beforeWords && `${beforeWords} `}
                    <span className="bg-primary/20 font-medium">{selectedText}</span>
                    {afterWords && ` ${afterWords}`}
                  </>
                );
              })()}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(card.content, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>Status: {card.status}</div>
            <div>
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Source
              </a>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="destructive" onClick={() => onDelete(card.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

