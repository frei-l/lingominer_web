"use client"
import { GenerationContainer } from "@/components/template/generation-container"
import { useParams } from "next/navigation"

export default function GenerationDetailPage() {
    const params = useParams()
    const generationId = params.generationId as string
    const templateId = params.templateId as string
    return <GenerationContainer generationId={generationId} templateId={templateId} />
}

