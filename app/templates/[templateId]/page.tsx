import { TemplateDetail } from "@/components/template-detail"

type FieldType = "text" | "audio"

interface Field {
  id: number
  name: string
  type: FieldType
  description: string
  generationId: number
}

interface Template {
  id: number
  name: string
  fields: Field[]
}

// 模拟的模板数据
const templateData: Template = {
  id: 1,
  name: "Advanced Vocabulary",
  fields: [
    { id: 1, name: "Word", type: "text", description: "The vocabulary word", generationId: 1 },
    { id: 2, name: "Definition", type: "text", description: "The definition of the word", generationId: 1 },
    { id: 3, name: "Pronunciation", type: "audio", description: "Audio pronunciation of the word", generationId: 2 },
    {
      id: 4,
      name: "Example Sentence",
      type: "text",
      description: "An example sentence using the word",
      generationId: 2,
    },
    { id: 5, name: "Translation", type: "text", description: "Translation of the word", generationId: 3 },
  ],
}

export default function TemplateDetailPage() {
  return <TemplateDetail template={templateData} />
}

