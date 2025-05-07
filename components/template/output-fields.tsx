"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FieldType, Generation, templatesAPI } from "@/lib/api"
import { Check, Music, Plus, Trash2, Type, X } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface OutputFieldsProps {
    generation: Generation
    onGenerationUpdate: (updatedGeneration: Generation) => void
}

export function OutputFields({ generation, onGenerationUpdate }: OutputFieldsProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
    const [modifiedFieldDescriptions, setModifiedFieldDescriptions] = useState<Record<string, string>>({})
    const [isCreatingOutputField, setIsCreatingOutputField] = useState(false)
    const [newOutputField, setNewOutputField] = useState({
        name: "",
        type: "text" as FieldType,
        description: ""
    })

    const editCardRef = useRef<HTMLDivElement>(null)
    const createCardRef = useRef<HTMLDivElement>(null)

    // Handle click outside to close edit/create modes
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;

            // Don't close if clicking on select components
            if (target.closest('[role="combobox"]') ||
                target.closest('[role="listbox"]') ||
                target.closest('[role="option"]')) {
                return;
            }

            // Don't close if clicking on form elements
            if (target.closest('input') ||
                target.closest('textarea') ||
                target.closest('button')) {
                return;
            }

            // Close field edit mode
            if (editCardRef.current && !editCardRef.current.contains(target)) {
                setEditingFieldId(null);
            }

            // Close field creation mode
            if (createCardRef.current && !createCardRef.current.contains(target)) {
                setIsCreatingOutputField(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFieldEdit = (fieldId: string, newDescription: string) => {
        setModifiedFieldDescriptions(prev => ({
            ...prev,
            [fieldId]: newDescription
        }))
    }

    const handleUpdateField = async (fieldId: string) => {
        const field = generation.outputs.find(f => f.id === fieldId)
        if (!field) return

        try {
            const result = await templatesAPI.updateField(generation.template_id, fieldId, {
                description: modifiedFieldDescriptions[fieldId]
            })

            onGenerationUpdate({
                ...generation,
                outputs: generation.outputs.map(output =>
                    output.id === fieldId ? result : output
                )
            })
            setModifiedFieldDescriptions(prev => {
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
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update field"
            })
        }
    }

    const handleDeleteField = async (fieldId: string) => {
        try {
            await templatesAPI.deleteField(generation.template_id, fieldId)

            onGenerationUpdate({
                ...generation,
                outputs: generation.outputs.filter(output => output.id !== fieldId)
            })
            setEditingFieldId(null)
            toast({
                title: "Success",
                description: "Field deleted successfully"
            })
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete field"
            })
        }
    }

    const handleCreateField = async () => {
        if (!newOutputField.name) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Field name is required"
            })
            return
        }

        try {
            const result = await templatesAPI.createField(generation.template_id, {
                ...newOutputField,
                generation_id: generation.id
            })

            onGenerationUpdate({
                ...generation,
                outputs: [...generation.outputs, result]
            })
            setIsCreatingOutputField(false)
            setNewOutputField({
                name: "",
                type: "text",
                description: ""
            })
            toast({
                title: "Success",
                description: "Field created successfully"
            })
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create field"
            })
        }
    }

    return (
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
                                        {modifiedFieldDescriptions[output.id] !== undefined && (
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
                                    value={modifiedFieldDescriptions[output.id] ?? output.description ?? ""}
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

                {/* Add Field Section */}
                {isCreatingOutputField ? (
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
                                    value={newOutputField.name}
                                    onChange={(e) => setNewOutputField(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsCreatingOutputField(false)}
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
                                    value={newOutputField.type}
                                    onValueChange={(value: FieldType) =>
                                        setNewOutputField(prev => ({ ...prev, type: value }))
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
                                    value={newOutputField.description}
                                    onChange={(e) => setNewOutputField(prev => ({ ...prev, description: e.target.value }))}
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
                        onClick={() => setIsCreatingOutputField(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Field
                    </Button>
                )}
            </div>
        </div>
    )
} 