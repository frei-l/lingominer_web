"use client"

import { useState } from 'react'
import { ChevronRight, ChevronDown, MoreHorizontal, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Field {
  id: string
  name: string
  subFields?: Field[]
}

const initialFields: Field[] = [
  { id: '1', name: 'Field 1' },
  {
    id: '2',
    name: 'Field 2',
    subFields: [
      { id: '2.1', name: 'Field 2.1' },
      { id: '2.2', name: 'Field 2.2' },
    ],
  },
  {
    id: '3',
    name: 'Field 3',
    subFields: [
      { id: '3.1', name: 'Field 3.1' },
      { id: '3.2', name: 'Field 3.2' },
    ],
  },
]

export function TemplateEditor() {
  const [fields, setFields] = useState<Field[]>(initialFields)
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set(fields.map(f => f.id)))

  const toggleExpand = (field: Field) => {
    if (field.subFields && field.subFields.length > 0) {
      setExpandedFields(prev => {
        const newSet = new Set(prev)
        if (newSet.has(field.id)) {
          newSet.delete(field.id)
        } else {
          newSet.add(field.id)
        }
        return newSet
      })
    }
  }

  const renderField = (field: Field, isSubField: boolean = false) => {
    const hasSubFields = field.subFields && field.subFields.length > 0
    const isExpanded = expandedFields.has(field.id)

    return (
      <div 
        key={field.id} 
        className={`mb-2 ${isSubField ? 'ml-6' : ''} group ${hasSubFields ? 'cursor-pointer' : ''}`}
        onClick={() => toggleExpand(field)}
      >
        <div className="flex items-center justify-between border border-black rounded-md p-2 transition-shadow duration-300 ease-in-out hover:shadow-md">
          <div className="flex items-center">
            <span className="w-6 flex justify-center">
              {!isSubField && hasSubFields && (
                <span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              )}
            </span>
            <span>{field.name}</span>
          </div>
          {!isSubField && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit field</DropdownMenuItem>
                <DropdownMenuItem>Add sub-field</DropdownMenuItem>
                <DropdownMenuItem>Delete field</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {hasSubFields && isExpanded && (
          <div className="mt-2">
            {field.subFields!.map(subField => renderField(subField, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Template Fields</CardTitle>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </CardHeader>
      <CardContent>
        {fields.map(field => renderField(field))}
      </CardContent>
    </Card>
  )
}

