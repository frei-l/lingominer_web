"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/lib/api"
import { Trash2, Send } from "lucide-react"
import { useTemplates } from "@/lib/api"
import { mochiAPI } from "@/lib/api/useDataUpdate"
import { useMochiDeckMappings } from "@/lib/api/useDataFetch"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CardDialogProps {
  card: Card | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (cardId: string) => void
}

export function CardDialog({ card, open, onOpenChange, onDelete }: CardDialogProps) {
  const [selectedDeckId, setSelectedDeckId] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()


  const { data: mochiMappings, isLoading: mochiMappingsLoading, error: mochiMappingsError } =
    useMochiDeckMappings(card?.template_id)

  if (!card) return null

  const handleExportToMochi = async () => {
    if (!selectedDeckId || !card) return

    try {
      setIsCreating(true)
      await mochiAPI.createCard(selectedDeckId, card.id)
      toast({
        title: "Success",
        description: "Card exported to Mochi successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error creating Mochi card:", error)
      toast({
        title: "Error",
        description: "Failed to export card to Mochi",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

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

        <DialogFooter className="grid grid-cols-2 items-start">
          <div className="flex flex-col space-y-2">
            <div className="flex gap-2">
              <Select
                value={selectedDeckId}
                onValueChange={setSelectedDeckId}
                disabled={mochiMappingsLoading || !mochiMappings?.length}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Mochi deck" />
                </SelectTrigger>
                <SelectContent>
                  {mochiMappings?.map((mapping) => (
                    <SelectItem key={mapping.id} value={mapping.id}>
                      {mapping.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToMochi}
                disabled={!selectedDeckId || isCreating}
              >
                <Send className="mr-2 h-4 w-4" />
                {isCreating ? "Exporting..." : "Export to Mochi"}
              </Button>
            </div>
            {mochiMappingsError && (
              <p className="text-sm text-red-500">Failed to load Mochi mappings</p>
            )}
            {mochiMappings?.length === 0 && (
              <p className="text-sm text-amber-500">No Mochi mappings available for this template</p>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="destructive" onClick={() => onDelete(card.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

