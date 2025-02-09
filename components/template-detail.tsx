"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Type, Music, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { TemplateDetail as TemplateDetailType } from "@/lib/data/fetchTemplates"
import { deleteTemplate, createGeneration } from "@/lib/data/fetchTemplates"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TemplateDetailProps {
  template: TemplateDetailType
}

export function TemplateDetail({ template }: TemplateDetailProps) {
  const router = useRouter()
  const [hoveredGeneration, setHoveredGeneration] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGenerationName, setNewGenerationName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteTemplate(template.id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
        router.push("/templates")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateGeneration = async () => {
    if (!newGenerationName.trim()) return

    setIsCreating(true)
    try {
      const result = await createGeneration(template.id, {
        name: newGenerationName.trim(),
        method: "completion",
        inputs: []
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.generation) {
        toast({
          title: "Success",
          description: "Generation created successfully",
        })
        setIsDialogOpen(false)
        router.push(`/templates/${template.id}/generations/${result.generation.id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create generation",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

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
      <div className="flex items-center justify-between mb-4">
        <Link href="/templates" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2" size={20} />
          Back to Templates
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 size={20} />
          {isDeleting ? "Deleting..." : "Delete Template"}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <span className="text-sm text-muted-foreground">Language: {template.lang}</span>
      </div>

      <div className="space-y-6">
        {template.generations.map((generation) => {
          const generationFields = fieldsBySource[generation.id] || []

          return (
            <div key={generation.id} className="space-y-2">
              {generationFields.length === 0 && (
                <h2
                  className="text-lg font-semibold hover:text-primary cursor-pointer pl-4"
                  onClick={() => router.push(`/templates/${template.id}/generations/${generation.id}`)}
                >
                  {generation.name} (No fields)
                </h2>
              )}
              {/* {generation.prompt && (
                <p className="text-sm text-muted-foreground mb-2">Prompt: {generation.prompt}</p>
              )} */}

              <div className="space-y-2">
                {generationFields.map((field) => (
                  <div
                    key={field.id}
                    className={`rounded-lg border transition-colors duration-300 cursor-pointer ${hoveredGeneration === generation.id ? "bg-muted" : ""
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Generation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Generation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Generation name"
                  value={newGenerationName}
                  onChange={(e) => setNewGenerationName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateGeneration}
                disabled={isCreating || !newGenerationName.trim()}
                className="w-full"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 