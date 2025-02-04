import { Alert, AlertDescription } from "@/components/ui/alert"
import { TemplateDetail } from "@/components/template-detail"
import { fetchTemplateDetail } from "@/lib/data/fetchTemplates"
import { notFound } from "next/navigation"

interface TemplateDetailPageProps {
    params: {
        templateId: string
    }
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
    const result = await fetchTemplateDetail(params.templateId)

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

    if (!result.template) {
        notFound()
    }

    return <TemplateDetail template={result.template} />
}

