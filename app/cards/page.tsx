import { CardGallery } from "@/components/card-gallery"

export default function CardsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Word Cards</h1>
      <CardGallery />
    </main>
  )
}

