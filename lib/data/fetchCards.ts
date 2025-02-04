import { getUserConfig } from "../cookies"

export interface Card {
    id: string
    paragraph: string
    pos_start: number
    pos_end: number
    url: string
    status: string
    created_at: string
    modified_at: string
}

export interface FetchCardsResult {
    cards?: Card[];
    error?: string;
}

export async function fetchCards(): Promise<FetchCardsResult> {
    try {
        const config = await getUserConfig()

        if (!config) {
            return { error: "User configuration not found" }
        }

        const response = await fetch(`${config.baseUrl}/cards`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            return { error: `Failed to fetch cards: ${response.statusText}` }
        }

        const cards = await response.json()
        return { cards }
    } catch (error) {
        return { error: `Failed to fetch cards: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}
