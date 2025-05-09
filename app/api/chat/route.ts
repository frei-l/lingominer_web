import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Create a custom OpenAI client with environment variables
const customLLM = createOpenAI({
    apiKey: process.env.LINGOMINER_LLM_API_KEY || "",
    baseURL: process.env.LINGOMINER_LLM_BASE_URL || "",
})

export async function POST(req: Request) {
    const { messages } = await req.json()

    const result = streamText({
        model: customLLM("gpt-4o-mini"), // Use the custom LLM configuration
        system:
            "You are a helpful and patient foreign language teacher. Respond to the user in the same language they use to write to you. Provide gentle corrections when appropriate, but maintain a natural conversation flow. Be encouraging and supportive.",
        messages,
    })

    return result.toDataStreamResponse()
}
