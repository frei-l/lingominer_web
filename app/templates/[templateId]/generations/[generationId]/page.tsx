import { GenerationDetail } from "@/components/generation-detail"

export default async function GenerationDetailPage({ params }: { params: { templateId: string; generationId: string } }) {
    return <GenerationDetail templateId={params.templateId} generationId={params.generationId} />
}

