// Define the Note type and other shared types
export interface Note {
    id: string
    text: string
    context: string
    explanation: string
    paragraphIndex: number
    startIndex: number
    endIndex: number
    timestamp: number
}

export interface SelectionInfo {
    text: string
    context: string
    paragraphIndex: number
    startIndex: number
    endIndex: number
}

