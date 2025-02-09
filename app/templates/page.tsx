import { Alert, AlertDescription } from "@/components/ui/alert"
import { TemplateList } from "@/components/template-list"
import { CreateTemplateDialog } from "@/components/create-template-dialog"
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <CreateTemplateDialog />
      </div>
      <TemplateList templates={result.templates || []} />
    </div>
  )
}

