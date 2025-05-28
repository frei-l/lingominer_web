"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useMochiDeckMapping, useTemplateDetail } from "@/lib/api"
import { MochiMappingCreate, MochiDeckMapping, TemplateField } from "@/lib/api/types"
import { mochiAPI } from "@/lib/api/useDataUpdate"
import { AlertCircle, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useState } from "react"
import { LingoMinerSelector } from "./lm-template-selector"

// Types for our state management
type MappingState = {
    fieldMappings: Record<string, { id: string, name: string } | null>
    isSaving: boolean
    error: string | null
}

type MappingAction =
    | { type: 'MAP_FIELD'; mochiFieldId: string; lingoField: { id: string, name: string } | null }
    | { type: 'LOAD_EXISTING_MAPPINGS'; mappings: Record<string, { id: string, name: string } | null> }
    | { type: 'START_SAVING' }
    | { type: 'SAVE_SUCCESS' }
    | { type: 'SAVE_ERROR'; error: string }

// Pure function to create mapping payload
const createMappingPayload = (
    mochiTemplateId: string,
    mochiDeckId: string,
    fieldMappings: MappingState['fieldMappings'],
    lingoMinerTemplateId: string,
    lingoMinerTemplateName: string
) => {
    const filteredMappings = Object.entries(fieldMappings)
        .filter(([_, value]) => value !== null)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {} as Record<string, { id: string, name: string } | null>);

    return {
        lingominer_template_id: lingoMinerTemplateId,
        lingominer_template_name: lingoMinerTemplateName,
        mochi_deck_id: mochiDeckId,
        mochi_template_id: mochiTemplateId,
        mapping: filteredMappings
    } as MochiMappingCreate
}

// Simple reducer for handling all state transitions
function mappingReducer(state: MappingState, action: MappingAction): MappingState {
    switch (action.type) {
        case 'MAP_FIELD':
            return {
                ...state,
                fieldMappings: {
                    ...state.fieldMappings,
                    [action.mochiFieldId]: action.lingoField
                }
            }
        case 'LOAD_EXISTING_MAPPINGS':
            return {
                ...state,
                fieldMappings: action.mappings
            }
        case 'START_SAVING':
            return {
                ...state,
                isSaving: true,
                error: null
            }
        case 'SAVE_SUCCESS':
            return {
                ...state,
                isSaving: false
            }
        case 'SAVE_ERROR':
            return {
                ...state,
                isSaving: false,
                error: action.error
            }
        default:
            return state
    }
}

// Field mapping component
const FieldMapping = ({
    mochiFieldId,
    mochiField,
    selectedValue,
    availableFields,
    onChange
}: {
    mochiFieldId: string
    mochiField: MochiDeckMapping['template_fields'][string]
    selectedValue: { id: string, name: string } | null
    availableFields: TemplateField[]
    onChange: (mochiFieldId: string, lingoField: { id: string, name: string } | null) => void
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b pb-4">
        <div>
            <p className="font-medium">{mochiField.name}</p>
            <p className="text-sm text-muted-foreground">Mochi Field ID: {mochiFieldId}</p>
            {mochiField.type && (
                <p className="text-xs text-muted-foreground">Type: {mochiField.type}</p>
            )}
        </div>
        <div>
            <Select
                value={selectedValue?.id || "none"}
                onValueChange={(value) =>
                    onChange(mochiFieldId, value == "none" ? null : { id: value, name: availableFields.find(f => f.id === value)?.name || "" })}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                            {field.name} ({field.type})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
)

// Mapper Component
function Mapper({
    selectedTemplateId,
    mochiDeckId
}: {
    selectedTemplateId: string,
    mochiDeckId: string
}) {
    const router = useRouter()
    const { toast } = useToast()

    // State management with reducer
    const [state, dispatch] = useReducer(mappingReducer, {
        fieldMappings: {},
        isSaving: false,
        error: null
    })

    // API data hooks
    const { data: mochiDeck, isLoading: mochiDeckLoading, error: mochiDeckError } = useMochiDeckMapping(mochiDeckId)
    const { data: lingoMinertemplateDetail, error: lingoMinerTemplateError, isLoading: lingoMinerTemplateLoading } =
        useTemplateDetail(selectedTemplateId)

    console.log(`mochiDeck: ${mochiDeckId}`, mochiDeck)

    // Load existing mappings when component mounts
    useEffect(() => {
        if (mochiDeck && mochiDeck.lingominer_template_id === selectedTemplateId) {
            dispatch({
                type: 'LOAD_EXISTING_MAPPINGS',
                mappings: Object.entries(mochiDeck.template_fields).reduce((acc, [fieldId, field]) => {
                    acc[fieldId] = field.lingominer_field_id ? {
                        id: field.lingominer_field_id,
                        name: field.lingominer_field_name || field.lingominer_field_id
                    } : null
                    return acc
                }, {} as Record<string, { id: string, name: string } | null>)
            })
        } else if (mochiDeck) {
            // Reset mappings if template changed
            dispatch({
                type: 'LOAD_EXISTING_MAPPINGS',
                mappings: {}
            })
        }
    }, [mochiDeck, selectedTemplateId])

    // Save mapping function
    const saveMapping = async () => {
        if (!selectedTemplateId
            || !mochiDeck
            || !lingoMinertemplateDetail
        ) {
            toast({
                title: "Error",
                description: "Please select a template first or wait for template details to load",
                variant: "destructive"
            })
            return
        }

        dispatch({ type: 'START_SAVING' })

        try {
            const mappingData = createMappingPayload(
                mochiDeck.template_id,
                mochiDeck.id,
                state.fieldMappings,
                lingoMinertemplateDetail.id,
                lingoMinertemplateDetail.name
            )

            await mochiAPI.createMapping(mappingData)

            toast({
                title: "Success",
                description: "Template mapping saved successfully"
            })

            dispatch({ type: 'SAVE_SUCCESS' })
            router.refresh()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

            toast({
                title: "Error",
                description: `Failed to save mapping: ${errorMessage}`,
                variant: "destructive"
            })

            dispatch({ type: 'SAVE_ERROR', error: errorMessage })
        }
    }

    // Get available LingoMiner fields from template detail
    const isTemplateDetailLoading = selectedTemplateId && !lingoMinertemplateDetail
    const availableFields = (lingoMinertemplateDetail?.fields || [])

    if (mochiDeckLoading || lingoMinerTemplateLoading) {
        return <div>Loading...</div>
    }

    // Error states
    if (mochiDeckError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load Mochi template</AlertDescription>
            </Alert>
        )
    }

    if (lingoMinerTemplateError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Template not found</AlertDescription>
            </Alert>
        )
    }

    if (!selectedTemplateId) {
        return
    }

    return (
        <div className="space-y-6">
            {isTemplateDetailLoading && (
                <Alert variant="default">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Loading template details...
                    </AlertDescription>
                </Alert>
            )}

            {selectedTemplateId && lingoMinertemplateDetail && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Field Mappings</h3>
                    <div className="grid gap-4">
                        {Object.entries(mochiDeck?.template_fields || {}).map(([mochiFieldId, mochiField]) => (
                            <FieldMapping
                                key={mochiFieldId}
                                mochiFieldId={mochiFieldId}
                                mochiField={mochiField}
                                selectedValue={state.fieldMappings[mochiFieldId] || null}
                                availableFields={availableFields}
                                onChange={(mochiFieldId, lingoField) =>
                                    dispatch({ type: 'MAP_FIELD', mochiFieldId, lingoField })
                                }
                            />
                        ))}
                    </div>
                </div>
            )}

            {state.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <div className="flex justify-end">
                <Button
                    onClick={saveMapping}
                    disabled={!selectedTemplateId || state.isSaving || isTemplateDetailLoading || !!lingoMinerTemplateError}
                    className="w-full md:w-auto"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {state.isSaving ? "Saving..." : "Save Mapping"}
                </Button>
            </div>
        </div>
    )
}

// Main component
export default function DeckMappingForm({ mochiDeckId }: { mochiDeckId: string }) {
    const [selectedTemplateId, setSelectedTemplateId] = useState('')
    const { data: mochiDeck } = useMochiDeckMapping(mochiDeckId)

    // Initialize with existing template if available
    useEffect(() => {
        if (mochiDeck?.lingominer_template_id) {
            setSelectedTemplateId(mochiDeck.lingominer_template_id)
        }
    }, [mochiDeck])

    return (
        <div className="space-y-6">
            <Toaster />

            <Card>
                <CardContent className="pt-6">
                    <LingoMinerSelector
                        selectedTemplateId={selectedTemplateId}
                        onTemplateChange={setSelectedTemplateId}
                    />
                    <Mapper
                        selectedTemplateId={selectedTemplateId}
                        mochiDeckId={mochiDeckId}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

