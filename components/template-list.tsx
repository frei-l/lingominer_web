import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 定义模板的类型
type Template = {
  id: number
  name: string
  language: string
}

// 模拟的模板数据
const templates: Template[] = [
  { id: 1, name: "Basic Vocabulary", language: "English" },
  { id: 2, name: "Grammar Rules", language: "Spanish" },
  { id: 3, name: "Conversation Starters", language: "French" },
  { id: 4, name: "Business Terms", language: "German" },
]

export function TemplateList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Link href={`/templates/${template.id}`} key={template.id}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Language: {template.language}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

