"use client"

import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface SearchBarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchBar({ onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder="Search cards..."
        className="pl-10 py-2 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ease-in-out"
        onChange={onChange}
      />
    </div>
  )
}

