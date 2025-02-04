import { Alert, AlertDescription } from "@/components/ui/alert"
import { GenerationDetail } from "@/components/generation-detail"
import { fetchGenerationDetail } from "@/lib/data/fetchTemplates"
import { notFound } from "next/navigation"

interface GenerationDetailPageProps {
    params: {
        templateId: string
        generationId: string
    }
}

export default async function GenerationDetailPage({ params }: GenerationDetailPageProps) {
    const result = await fetchGenerationDetail(params.templateId, params.generationId)

    if (result.error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertDescription>
                        {result.error}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!result.generation) {
        notFound()
    }

    return <GenerationDetail generation={result.generation} />
}

