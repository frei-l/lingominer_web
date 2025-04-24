"use client"

import Link from "next/link"
import { useMochiDeckMappings } from "@/lib/api/useDataFetch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, FileText } from "lucide-react"

export default function DeckMappingList() {
    const { data: decks, isLoading: decksLoading, error: decksError } = useMochiDeckMappings()

    if (decksLoading) {
        return <div>Loading...</div>
    }
    if (decksError) {
        return <div>Error loading decks: {decksError?.message}</div>
    }

    if (!decks || decks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No decks found</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-4">
                {decks.map((deck) => {
                    return (
                        <Card key={deck.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{deck.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText className="mr-2 h-4 w-4" />
                                        {deck.lingominer_template_name && (
                                            <div className="mt-2 text-sm text-green-600">
                                                Mapped to: {deck.lingominer_template_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button asChild>
                                        <Link href={`/mochi/${deck.id}`}>
                                            {deck.lingominer_template_name ? "Configure Mapping" : "Create Mapping"}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

