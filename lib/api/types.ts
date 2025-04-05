// Common types for API models

// Card types
export interface Card {
  id: string
  paragraph: string
  pos_start: number
  pos_end: number
  content: object
  url: string
  status: string
  created_at: string
  modified_at: string
}

// Passage types
export interface PassageList {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
  modified_at: string
}

export interface Passage extends PassageList {
  content: string
  notes: Note[]
}

export interface Note {
  id: string
  content: string
  selected_text: string
  context: string
  paragraph_index: number
  start_index: number
  end_index: number
  created_at: string
  modified_at: string
}

// Template types
export interface TemplateList {
  id: string
  name: string
  lang: string
  created_at: string
  updated_at: string
}

export interface TemplateField {
  id: string
  name: string
  type: FieldType
  description?: string
  source_id: string
}

export interface TemplateGeneration {
  id: string
  name: string
  method: string
  prompt?: string
}

export interface Template {
  id: string
  name: string
  lang: string
  fields: TemplateField[]
  generations: TemplateGeneration[]
}

export interface GenerationField {
  id: string
  name: string
  type: FieldType
  description?: string
  source_id: string
}

export interface GenerationDetail {
  id: string
  name: string
  method: string
  prompt?: string
  template_id: string
  inputs: GenerationField[]
  outputs: GenerationField[]
}

// Request/Response types
export interface CreateTemplateRequest {
  name: string
  lang: string
}

export interface CreateGenerationRequest {
  name: string
  method: string
  inputs: string[]
}

export interface UpdateGenerationRequest {
  name?: string
  method?: string
  prompt?: string
}

export interface CreateFieldRequest {
  name: string
  type: FieldType
  description?: string
  generation_id: string
}

export interface UpdateFieldRequest {
  description?: string
  type?: FieldType
}

export interface CreateNoteRequest {
  selected_text: string
  context: string
  paragraph_index: number
  start_index: number
  end_index: number
}


// Utility types
export type FieldType = "text" | "audio" 