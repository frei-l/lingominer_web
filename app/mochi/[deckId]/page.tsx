"use client"
import DeckMappingForm from "@/components/mochi/mapping-form"
import { useParams } from "next/navigation"


export default function DeckMappingDetailPage() {
    const params = useParams()
    const deckId = params.deckId as string
    return (
        <DeckMappingForm mochiDeckId={deckId} />
    )
}

