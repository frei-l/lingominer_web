"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Type, Music } from "lucide-react"
import { useRouter } from "next/navigation"

type FieldType = "text" | "audio"

interface Field {
  id: number
  name: string
  type: FieldType
  description: string
  generationId: number
}

interface Template {
  id: number
  name: string
  fields: Field[]
}

interface TemplateDetailProps {
  template: Template
}

export function TemplateDetail({ template }: TemplateDetailProps) {
  const router = useRouter()
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null)

  return (
    <div className="container mx-auto py-8">
      <Link href="/templates" className="flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back to Templates
      </Link>
      <h1 className="text-2xl font-bold mb-6">{template.name}</h1>

      <div className="space-y-2">
        {template.fields.map((field) => (
          <div
            key={field.id}
            className={`rounded-lg border transition-colors duration-300 cursor-pointer ${
              hoveredGroup === field.generationId ? "bg-muted" : ""
            }`}
            onMouseEnter={() => setHoveredGroup(field.generationId)}
            onMouseLeave={() => setHoveredGroup(null)}
            onClick={() => router.push(`/templates/${template.id}/generations/${field.generationId}`)}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {field.type === "text" ? (
                  <Type className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Music className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-base font-medium">Field {field.id}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{field.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 