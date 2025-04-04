// Service for generating explanations
import type { SelectionInfo } from "./types"

// This simulates an API call to a language model
export async function generateExplanation(selectionInfo: SelectionInfo): Promise<string> {
    // In a real app, this would call an API
    return new Promise((resolve) => {
        console.log("Generating explanation..." + JSON.stringify(selectionInfo))
        setTimeout(() => {
            // Generate random placeholder explanation text
            const randomExplanations = [
                "This passage describes how tulip bulbs are traded as financial instruments, creating an early form of a futures market. This innovative financial system allowed traders to buy and sell tulips year-round despite their limited growing season.",
                "The text explains the classification system used for tulips during the Dutch Tulip Mania. Rarer varieties with multiple colors commanded higher prices, showing how scarcity and aesthetic qualities drove market valuation.",
                "This excerpt details how the tulip market evolved into a speculative bubble, with prices increasing dramatically between 1634-1637. The text highlights how traders reinvested profits and merchants liquidated assets to participate in the growing market.",
                "The passage discusses how the mosaic virus created unique patterns on tulip petals, making infected bulbs more valuable. This demonstrates how an accidental biological factor significantly impacted market prices and desirability.",
                "This text explains the economic impact of the tulip trade, comparing historical prices to modern equivalents. It illustrates how speculation drove prices to unsustainable levels, creating what is considered the first documented financial bubble.",
            ]

            // Select a random explanation
            const randomIndex = Math.floor(Math.random() * randomExplanations.length)
            resolve(randomExplanations[randomIndex])
        }, 1000) // Simulate 1 second loading time
    })
}

