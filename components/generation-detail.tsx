"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Type, Music } from "lucide-react"
import { GenerationDetail as GenerationDetailType, updateGeneration } from "@/lib/data/fetchTemplates"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface GenerationDetailProps {
    generation: GenerationDetailType
}

export function GenerationDetail({ generation: initialGeneration }: GenerationDetailProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [generation, setGeneration] = useState(initialGeneration)
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
    const [isModified, setIsModified] = useState(false)
    const editCardRef = useRef<HTMLDivElement>(null)
    
    const [editData, setEditData] = useState({
        name: generation.name,
        method: generation.method,
        prompt: generation.prompt || ""
    })

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (editCardRef.current && !editCardRef.current.contains(event.target as Node)) {
                setEditingFieldId(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSave = async () => {
        const result = await updateGeneration(
            generation.template_id,
            generation.id,
            editData
        )

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
            return
        }

        if (result.generation) {
            setGeneration(result.generation)
            setIsModified(false)
            toast({
                title: "Success",
                description: "Generation updated successfully"
            })
            router.refresh()
        }
    }

    const handleFieldEdit = (fieldId: string, newDescription: string) => {
        const updatedOutputs = generation.outputs.map(output => 
            output.id === fieldId 
                ? { ...output, description: newDescription }
                : output
        )
        setGeneration({ ...generation, outputs: updatedOutputs })
        setIsModified(true)
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-4">
                <Link 
                    href={`/templates/${generation.template_id}`} 
                    className="flex items-center text-primary hover:underline"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Template
                </Link>
                {isModified && (
                    <Button onClick={handleSave}>
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">{generation.name}</h1>
                    
                    <div>
                        <label className="text-sm font-medium mb-2 block">Generation Method</label>
                        <Select 
                            value={editData.method} 
                            onValueChange={(value) => {
                                setEditData(prev => ({ ...prev, method: value }))
                                setIsModified(true)
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a generation method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Prompt</label>
                        <Textarea
                            placeholder="Enter your prompt here"
                            value={editData.prompt}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, prompt: e.target.value }))
                                setIsModified(true)
                            }}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Input Fields */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Input Fields</h2>
                    <div className="flex flex-wrap gap-2">
                        {generation.inputs.map((input) => (
                            <Badge key={input.id} variant="secondary">
                                {input.type === "text" ? <Type className="h-3 w-3 mr-1" /> : <Music className="h-3 w-3 mr-1" />}
                                {input.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Output Fields */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Output Fields</h2>
                    <div className="grid gap-4">
                        {generation.outputs.map((output) => (
                            <Card 
                                key={output.id} 
                                ref={output.id === editingFieldId ? editCardRef : undefined}
                                onClick={() => setEditingFieldId(output.id)}
                                className="cursor-pointer hover:border-primary transition-colors"
                            >
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        {output.type === "text" ? (
                                            <Type className="h-4 w-4" />
                                        ) : (
                                            <Music className="h-4 w-4" />
                                        )}
                                        {output.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {editingFieldId === output.id ? (
                                        <Textarea
                                            value={output.description || ""}
                                            onChange={(e) => handleFieldEdit(output.id, e.target.value)}
                                            className="mt-2"
                                            placeholder="Enter field description"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {output.description || "Click to add description"}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 