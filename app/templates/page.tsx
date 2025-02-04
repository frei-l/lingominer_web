import { Alert, AlertDescription } from "@/components/ui/alert"
import { TemplateList } from "@/components/template-list"
import { fetchTemplates } from "@/lib/data/fetchTemplates"

export default async function TemplatesPage() {
  const result = await fetchTemplates()

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

  return (
    <div className="container mx-auto py-8">
      <TemplateList templates={result.templates || []} />
    </div>
  )
}

