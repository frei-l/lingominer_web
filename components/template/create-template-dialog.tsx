"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { templatesAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { mutate } from "swr"

export function CreateTemplateDialog() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [lang, setLang] = useState("en")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const template = await templatesAPI.create({ name, lang })
      setOpen(false)
      setName("")
      setLang("en")
      toast({
        title: "Success",
        description: "Template created successfully",
      })
      mutate("/templates")
      router.push(`/templates/${template.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create template",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Template</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Template name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lang">Language</Label>
            <Select value={lang} onValueChange={setLang} required>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={!name.trim()} className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 