import { TemplateEditor } from "@/components/template-editor"

export default function TemplatePage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <TemplateEditor />
      </div>
    </main>
  )
}

