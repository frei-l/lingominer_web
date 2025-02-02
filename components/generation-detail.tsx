"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Field {
    id: number
    name: string
    type: "text" | "audio"
    content: string
    description: string
}

interface GenerationDetailProps {
    templateId: string
    generationId: string
}

export function GenerationDetail({ templateId, generationId }: GenerationDetailProps) {
    const [prompt, setPrompt] = useState("")
    const [generationMethod, setGenerationMethod] = useState("")
    const [fields, setFields] = useState<Field[]>([
        { id: 1, name: "Word", type: "text", content: "Example", description: "The vocabulary word" },
        {
            id: 2,
            name: "Definition",
            type: "text",
            content: "An illustration or instance of something",
            description: "The definition of the word",
        },
    ])
    const [editingFieldId, setEditingFieldId] = useState<number | null>(null)
    const [editingField, setEditingField] = useState<Field | null>(null)
    const [isPromptModified, setIsPromptModified] = useState(false)
    const editCardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (editCardRef.current && !editCardRef.current.contains(event.target as Node)) {
                cancelEdit()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const addNewField = () => {
        const newField: Field = {
            id: fields.length + 1,
            name: `New Field ${fields.length + 1}`,
            type: "text",
            content: "",
            description: "",
        }
        setFields([...fields, newField])
        setEditingFieldId(newField.id)
        setEditingField(newField)
    }

    const startEdit = (field: Field) => {
        setEditingFieldId(field.id)
        setEditingField({ ...field })
    }

    const saveEdit = () => {
        if (editingField) {
            setFields(fields.map((f) => (f.id === editingField.id ? editingField : f)))
            setEditingFieldId(null)
            setEditingField(null)
        }
    }

    const cancelEdit = () => {
        setEditingFieldId(null)
        setEditingField(null)
    }

    const deleteField = (id: number) => {
        setFields(fields.filter((f) => f.id !== id))
    }

    return (
        <div className="container mx-auto py-8">
            <Link href={`/templates/${templateId}`} className="flex items-center text-primary hover:underline mb-4">
                <ArrowLeft className="mr-2" size={20} />
                Back to Template
            </Link>
            <h1 className="text-2xl font-bold mb-6">Generation {generationId}</h1>

            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Prompt</h2>
                    <div className="relative">
                        <Textarea
                            placeholder="Enter your prompt here"
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value)
                                setIsPromptModified(true)
                            }}
                            className="min-h-[100px]"
                        />
                        {isPromptModified && (
                            <Button className="absolute bottom-2 right-2" size="sm" onClick={() => setIsPromptModified(false)}>
                                Confirm
                            </Button>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Generation Method</h2>
                    <Select value={generationMethod} onValueChange={setGenerationMethod}>
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
                    <h2 className="text-lg font-semibold mb-2">Fields</h2>
                    <div className="space-y-4">
                        {fields.map((field) => (
                            <Card key={field.id} ref={field.id === editingFieldId ? editCardRef : null}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {editingFieldId === field.id ? (
                                            <input
                                                type="text"
                                                value={editingField?.name || ""}
                                                onChange={(e) => setEditingField((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                                                className="border p-1 rounded"
                                            />
                                        ) : (
                                            field.name
                                        )}
                                    </CardTitle>
                                    <div>
                                        {editingFieldId === field.id ? (
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveEdit}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(field)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteField(field.id)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {editingFieldId === field.id ? (
                                        <textarea
                                            value={editingField?.description || ""}
                                            onChange={(e) =>
                                                setEditingField((prev) => (prev ? { ...prev, description: e.target.value } : null))
                                            }
                                            className="w-full border p-1 rounded"
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">{field.description}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Button onClick={addNewField} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add New Field
                </Button>
            </div>
        </div>
    )
} 