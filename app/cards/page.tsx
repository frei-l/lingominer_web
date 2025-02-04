import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CardGallery } from "@/components/card-gallery"
import { fetchCards } from "@/lib/data/fetchCards"

export default async function CardsPage() {
  const result = await fetchCards()

  if (result.error) {
    return (
      <main className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            {result.error}
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <CardGallery cards={result.cards || []} />
    </main>
  )
}

