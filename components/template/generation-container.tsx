"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { useToast } from "@/hooks/use-toast"
import { templatesAPI, useGenerationDetail } from "@/lib/api"
import { ArrowLeft, Check, Trash2, Type } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { OutputFields } from "./output-fields"

// Types
interface GenerationDetailProps {
    templateId: string
    generationId: string
}

export function GenerationContainer({ generationId, templateId }: GenerationDetailProps) {
    // Hooks
    const router = useRouter()
    const { toast } = useToast()
    const { data: generation, isLoading, error, mutate: mutateGeneration } = useGenerationDetail(templateId, generationId)

    // State for generation editing
    const [generationEditData, setGenerationEditData] = useState<{ method: string; prompt: string } | null>(null)

    // Constants
    const generationOptions = ["completion", "toSpeech"]

    const extractInputNames = (prompt: string) => {
        const inputNames = prompt.match(/{{(\w+)}}/g)
        return inputNames ? [...new Set(inputNames.map(name => name.slice(2, -2)))] : []
    }

    // Derived state for inputs and unsaved changes - MOVED UP & MADE SAFE
    const derivedInputs = useMemo(() => {
        if (!generation) return []; // Handle case where generation is not yet loaded
        const promptToUse = generationEditData?.prompt ?? generation.prompt ?? '';
        return extractInputNames(promptToUse);
    }, [generation, generationEditData?.prompt]);

    const hasUnsavedChanges = useMemo(() => {
        if (!generation || !generationEditData) {
            return false;
        }
        return (
            generationEditData.method !== (generation.method ?? '') || // Compare with fallback
            generationEditData.prompt !== (generation.prompt ?? '')  // Compare with fallback
        );
    }, [generation, generationEditData]);

    // Initialize generation edit data when generation is loaded
    useEffect(() => {
        if (generation) {
            setGenerationEditData({
                method: generation.method ?? '',
                prompt: generation.prompt ?? '',
            })
        }
    }, [generation])

    // Event Handlers

    /**
     * Save changes to the generation
     */
    const handleSave = async () => {
        if (!generation || !generationEditData) {
            toast({ variant: "destructive", title: "Error", description: "Form data not available." });
            return
        }

        try {
            // Ensure prompt is a string for extractInputNames
            const currentPrompt = generationEditData.prompt ?? '';
            const extractedInputs = extractInputNames(currentPrompt)

            const result = await templatesAPI.updateGeneration(
                templateId,
                generationId,
                {
                    method: generationEditData.method,
                    prompt: generationEditData.prompt,
                    inputs: extractedInputs
                }
            )

            await mutateGeneration(result)
            toast({
                title: "Success",
                description: "Generation updated successfully"
            })
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update generation"
            })
        }
    }

    /**
     * Delete the generation
     */
    const handleDelete = async () => {
        if (!generation) return

        try {
            await templatesAPI.deleteGeneration(
                templateId,
                generationId
            )

            router.push(`/templates/${templateId}`)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete generation"
            })
        }
    }

    // Loading and Error States
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!generation) return <div>Generation not found</div>

    // Main Render
    return (
        <div className="container">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <Link
                    href={`/templates/${generation.template_id}`}
                    className="text-xl font-bold flex items-center text-primary hover:underline"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Template
                </Link>
                <div className="flex gap-2">
                    {hasUnsavedChanges && (
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
                {/* Generation Settings Section */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">{generation.name}</h1>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Generation Method</label>
                        <Select
                            value={generationEditData?.method ?? generation.method}
                            onValueChange={(value) => {
                                setGenerationEditData(prev => ({
                                    method: value,
                                    prompt: prev?.prompt ?? generation.prompt ?? ''
                                }))
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
                        <span className="text-xs text-gray-500 mb-2 block">built in: decorated_paragraph</span>
                        <Textarea
                            placeholder="Enter your prompt here"
                            value={generationEditData?.prompt ?? generation.prompt}
                            onChange={(e) => {
                                setGenerationEditData(prev => ({
                                    prompt: e.target.value,
                                    method: prev?.method ?? generation.method ?? ''
                                }))
                            }}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Input Fields Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Input Fields</h2>
                    <div className="flex flex-wrap gap-2">
                        {derivedInputs.map((inputName) => (
                            <Badge key={inputName} variant="secondary">
                                <Type className="h-3 w-3 mr-1" />
                                {inputName}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Output Fields Section */}
                <OutputFields
                    generation={generation}
                    onGenerationUpdate={mutateGeneration}
                />
            </div>
        </div>
    )
} 