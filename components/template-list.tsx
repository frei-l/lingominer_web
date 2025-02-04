import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Template } from "@/lib/data/fetchTemplates"

interface TemplateListProps {
  templates: Template[]
}

export function TemplateList({ templates }: TemplateListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Link href={`/templates/${template.id}`} key={template.id}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Language: {template.lang}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(template.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated: {new Date(template.updated_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

