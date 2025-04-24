import { useTemplates } from "@/lib/api"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function LingoMinerSelector({
    selectedTemplateId,
    onTemplateChange
}: {
    selectedTemplateId: string,
    onTemplateChange: (templateId: string) => void
}) {
    const { data: lingoMinerTemplates, isLoading: lingoMinerTemplatesLoading, error: lingoMinerTemplatesError } = useTemplates()

    if (lingoMinerTemplatesLoading) {
        return <div>Loading templates...</div>
    }

    if (lingoMinerTemplatesError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load LingoMiner templates</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="lingo-template">Select LingoMiner Template</Label>
                <Select
                    value={selectedTemplateId}
                    onValueChange={onTemplateChange}
                >
                    <SelectTrigger id="lingo-template" className="w-full">
                        <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                        {lingoMinerTemplates?.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                                {template.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {!selectedTemplateId && (
                <Alert
                    variant="default"
                    className="bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please select a LingoMiner template to start mapping fields
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
