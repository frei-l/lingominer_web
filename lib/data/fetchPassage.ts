import { getUserConfig } from "../cookies"

export interface Passage {
    id: string
    user_id: string
    title: string
    url: string
    content: string
    created_at: string
    modified_at: string
}

export interface FetchPassageResult {
    passage?: Passage
    error?: string
}
export interface FetchPassagesResult {
    passages?: Passage[]
    error?: string
}

export async function getPassages(): Promise<FetchPassagesResult> {
    const config = await getUserConfig()

    if (!config) {
        return { error: "User configuration not found" }
    }

    const response = await fetch(`${config.baseUrl}/passages`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${config.apiKey}`,
        },
    })

    if (!response.ok) {
        return { error: `Failed to get passages: ${response.statusText}` }
    }

    const data = await response.json()
    return { passages: data }
}

export async function createPassage(url: string): Promise<FetchPassageResult> {
    const config = await getUserConfig()

    if (!config) {
        return { error: "User configuration not found" }
    }
    const params = new URLSearchParams({ url: url }).toString()

    const response = await fetch(`${config.baseUrl}/passages?${params}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return { error: `Failed to create passage: ${response.statusText}` }
    }

    const data = await response.json()
    return { passage: data }
}
