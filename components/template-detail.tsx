"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Type, Music } from "lucide-react"
import { useRouter } from "next/navigation"
import { TemplateDetail as TemplateDetailType } from "@/lib/data/fetchTemplates"

interface TemplateDetailProps {
  template: TemplateDetailType
}

export function TemplateDetail({ template }: TemplateDetailProps) {
  const router = useRouter()
  const [hoveredGeneration, setHoveredGeneration] = useState<string | null>(null)

  // 按 source_id 对字段进行分组
  const fieldsBySource = template.fields.reduce((groups, field) => {
    const sourceId = field.source_id
    if (!groups[sourceId]) {
      groups[sourceId] = []
    }
    groups[sourceId].push(field)
    return groups
  }, {} as Record<string, typeof template.fields>)

  return (
    <div className="container mx-auto py-8">
      <Link href="/templates" className="flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back to Templates
      </Link>
      
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <span className="text-sm text-muted-foreground">Language: {template.lang}</span>
      </div>

      <div className="space-y-6">
        {template.generations.map((generation) => {
          const generationFields = fieldsBySource[generation.id] || []
          
          return (
            <div key={generation.id} className="space-y-2">
              <h2 className="text-lg font-semibold">{generation.name}</h2>
              {/* {generation.prompt && (
                <p className="text-sm text-muted-foreground mb-2">Prompt: {generation.prompt}</p>
              )} */}
              
              <div className="space-y-2">
                {generationFields.map((field) => (
                  <div
                    key={field.id}
                    className={`rounded-lg border transition-colors duration-300 cursor-pointer ${
                      hoveredGeneration === generation.id ? "bg-muted" : ""
                    }`}
                    onMouseEnter={() => setHoveredGeneration(generation.id)}
                    onMouseLeave={() => setHoveredGeneration(null)}
                    onClick={() => router.push(`/templates/${template.id}/generations/${generation.id}`)}
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        {field.type === "text" ? (
                          <Type className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Music className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-base font-medium">{field.name}</span>
                      </div>

                      {field.description && (
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{field.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 