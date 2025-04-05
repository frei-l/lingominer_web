"use client"
import { TemplateDetail } from "@/components/template/template-detail"
import { useParams } from "next/navigation"

export default function TemplateDetailPage() {
    const params = useParams()
    const templateId = params.templateId as string
    return <TemplateDetail templateId={templateId} />
}

