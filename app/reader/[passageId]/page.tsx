"use client"

import Reader from "@/components/reader/reader"
import { useParams } from "next/navigation"

export default function PassagePage() {
  const params = useParams()
  const passageId = params.passageId as string

  return (
    <div className="min-h-screen bg-background">
      <Reader passageId={passageId} />
    </div>
  )
} 