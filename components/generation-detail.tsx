"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Type, Music } from "lucide-react"
import { GenerationDetail as GenerationDetailType, updateGeneration, deleteGeneration, createField, deleteField, updateField } from "@/lib/data/fetchTemplates"
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
    const generationOptions = ["completion"]
    const [isCreatingField, setIsCreatingField] = useState(false)
    const [newField, setNewField] = useState({
        name: "",
        type: "text" as FieldType,
        description: ""
    })
    const createCardRef = useRef<HTMLDivElement>(null)

    const [editData, setEditData] = useState({
        name: generation.name,
        method: generation.method,
        prompt: generation.prompt || ""
    })

    const [modifiedFields, setModifiedFields] = useState<Record<string, string>>({})

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;

            if (target.closest('[role="combobox"]') ||
                target.closest('[role="listbox"]') ||
                target.closest('[role="option"]')) {
                return;
            }

            if (target.closest('input') ||
                target.closest('textarea') ||
                target.closest('button')) {
                return;
            }

            if (editCardRef.current && !editCardRef.current.contains(target)) {
                setEditingFieldId(null);
            }

            if (createCardRef.current && !createCardRef.current.contains(target)) {
                setIsCreatingField(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        setModifiedFields(prev => ({
            ...prev,
            [fieldId]: newDescription
        }))
    }

    const handleUpdateField = async (fieldId: string) => {
        const field = generation.outputs.find(f => f.id === fieldId)
        if (!field) return

        const result = await updateField(generation.template_id, fieldId, {
            description: modifiedFields[fieldId]
        })

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
            return
        }

        if (result.field) {
            setGeneration(prev => ({
                ...prev,
                outputs: prev.outputs.map(output =>
                    output.id === fieldId ? result.field! : output
                )
            }))
            setModifiedFields(prev => {
                const newState = { ...prev }
                delete newState[fieldId]
                return newState
            })
            setEditingFieldId(null)
            toast({
                title: "Success",
                description: "Field updated successfully"
            })
            router.refresh()
        }
    }

    const handleDelete = async () => {
        const result = await deleteGeneration(
            generation.template_id,
            generation.id
        )

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
            return
        }

        toast({
            title: "Success",
            description: "Generation deleted successfully"
        })
        router.push(`/templates/${generation.template_id}`)
    }

    const handleCreateField = async () => {
        if (!newField.name) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Field name is required"
            })
            return
        }

        const result = await createField(generation.template_id, {
            ...newField,
            generation_id: generation.id
        })

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
            return
        }

        if (result.field) {
            setGeneration(prev => ({
                ...prev,
                outputs: [...prev.outputs, result.field!]
            }))
            setIsCreatingField(false)
            setNewField({
                name: "",
                type: "text",
                description: ""
            })
            toast({
                title: "Success",
                description: "Field created successfully"
            })
            router.refresh()
        }
    }

    const handleDeleteField = async (fieldId: string) => {
        const result = await deleteField(generation.template_id, fieldId)

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
            return
        }

        setGeneration(prev => ({
            ...prev,
            outputs: prev.outputs.filter(output => output.id !== fieldId)
        }))
        setEditingFieldId(null)
        toast({
            title: "Success",
            description: "Field deleted successfully"
        })
        router.refresh()
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
                <div className="flex gap-2">
                    {isModified && (
                        <Button onClick={handleSave}>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
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
                                {generationOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
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
                    <div className="space-y-4">
                        {generation.outputs.map((output) => (
                            <Card
                                key={output.id}
                                ref={output.id === editingFieldId ? editCardRef : undefined}
                                onClick={() => setEditingFieldId(output.id)}
                                className="cursor-pointer hover:border-primary transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            {output.type === "text" ? (
                                                <Type className="h-4 w-4" />
                                            ) : (
                                                <Music className="h-4 w-4" />
                                            )}
                                            {output.name}
                                        </CardTitle>
                                        {editingFieldId === output.id && (
                                            <div className="flex gap-2">
                                                {modifiedFields[output.id] !== undefined && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleUpdateField(output.id)
                                                        }}
                                                    >
                                                        <Check className="h-4 w-4 text-primary" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteField(output.id)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {editingFieldId === output.id ? (
                                        <Textarea
                                            value={modifiedFields[output.id] ?? output.description ?? ""}
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

                        {/* Add Field button */}
                        {isCreatingField ? (
                            <Card
                                ref={createCardRef}
                                className="border-primary"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Field name"
                                            className="text-base font-semibold bg-transparent border-none focus:outline-none"
                                            value={newField.name}
                                            onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsCreatingField(false)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleCreateField}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Select
                                            value={newField.type}
                                            onValueChange={(value: FieldType) =>
                                                setNewField(prev => ({ ...prev, type: value }))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select field type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="audio">Audio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Textarea
                                            value={newField.description}
                                            onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
                                            className="mt-2"
                                            placeholder="Enter field description"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsCreatingField(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Field
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 