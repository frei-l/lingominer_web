"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useTemplates } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CreateTemplateDialog } from "@/components/template/create-template-dialog"

export function TemplateList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const { data: templates, error, isLoading } = useTemplates()

  if (isLoading) {
    return <div className="flex justify-center items-center py-10">Loading templates...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load templates: {error.message}</AlertDescription>
      </Alert>
    )
  }

  const filteredTemplates = templates ? templates.filter(
    template => template.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Templates</h1>
        <CreateTemplateDialog />
      </div>
      <div>
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full px-4 py-2 mb-6 border rounded-md"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="flex flex-col cursor-pointer hover:shadow-md transition-all"
              onClick={() => router.push(`/templates/${template.id}`)}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Language: {template.lang}</span>
                  <span suppressHydrationWarning>{new Date(template.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

