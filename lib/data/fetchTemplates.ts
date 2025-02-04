import { getUserConfig } from "../cookies"

export interface Template {
    id: string
    name: string
    lang: string
    created_at: string
    updated_at: string
}

export interface FetchTemplatesResult {
    templates?: Template[];
    error?: string;
}

export async function fetchTemplates(): Promise<FetchTemplatesResult> {
    try {
        const config = await getUserConfig()

        if (!config) {
            return { error: "User configuration not found" }
        }

        const response = await fetch(`${config.baseUrl}/templates`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            return { error: `Failed to fetch templates: ${response.statusText}` }
        }

        const templates = await response.json()
        return { templates }
    } catch (error) {
        return { error: `Failed to fetch templates: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}

export type FieldType = "text" | "audio"

export interface TemplateField {
    id: string
    name: string
    type: FieldType
    description?: string
    source_id: string
}

export interface TemplateGeneration {
    id: string
    name: string
    method: string
    prompt?: string
}

export interface TemplateDetail {
    id: string
    name: string
    lang: string
    fields: TemplateField[]
    generations: TemplateGeneration[]
}

export interface FetchTemplateDetailResult {
    template?: TemplateDetail
    error?: string
}

export async function fetchTemplateDetail(templateId: string): Promise<FetchTemplateDetailResult> {
    try {
        const config = await getUserConfig()

        if (!config) {
            return { error: "User configuration not found" }
        }

        const response = await fetch(`${config.baseUrl}/templates/${templateId}`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            return { error: `Failed to fetch template: ${response.statusText}` }
        }

        const template = await response.json()
        return { template }
    } catch (error) {
        return { error: `Failed to fetch template: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}

export interface GenerationField {
    id: string
    name: string
    type: FieldType
    description?: string
    source_id: string
}

export interface GenerationDetail {
    id: string
    name: string
    method: string
    prompt?: string
    template_id: string
    inputs: GenerationField[]
    outputs: GenerationField[]
}

export interface FetchGenerationDetailResult {
    generation?: GenerationDetail
    error?: string
}

export async function fetchGenerationDetail(templateId: string, generationId: string): Promise<FetchGenerationDetailResult> {
    try {
        const config = await getUserConfig()

        if (!config) {
            return { error: "User configuration not found" }
        }

        const response = await fetch(
            `${config.baseUrl}/templates/${templateId}/generations/${generationId}`,
            {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            return { error: `Failed to fetch generation: ${response.statusText}` }
        }

        const generation = await response.json()
        return { generation }
    } catch (error) {
        return { error: `Failed to fetch generation: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}

export interface UpdateGenerationPayload {
    name?: string
    method?: string
    prompt?: string
}

export async function updateGeneration(
    templateId: string,
    generationId: string,
    data: UpdateGenerationPayload
): Promise<FetchGenerationDetailResult> {
    try {
        const config = await getUserConfig()

        if (!config) {
            return { error: "User configuration not found" }
        }

        const response = await fetch(
            `${config.baseUrl}/templates/${templateId}/generations/${generationId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }
        )

        if (!response.ok) {
            return { error: `Failed to update generation: ${response.statusText}` }
        }

        const generation = await response.json()
        return { generation }
    } catch (error) {
        return { error: `Failed to update generation: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
} 