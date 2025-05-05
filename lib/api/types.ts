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
  template_id: string
  modified_at: string
}

// Passage types
export interface PassageItem {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
  modified_at: string
}

export interface Passage extends PassageItem {
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
export interface TemplateItem {
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

export interface Generation {
  id: string
  name: string
  method: string
  prompt?: string
  template_id: string
  inputs: GenerationField[]
  outputs: GenerationField[]
}

// User types
export interface User {
  id: string
  name: string
  api_keys: ApiKey[]
  mochi_api_key: string
  created_at: string
  modified_at: string
}

export interface ApiKey {
  id: string
  key: string
  created_at: string
  modified_at: string
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

export interface CreateCardRequest {
  paragraph: string
  pos_start: number
  pos_end: number
  template_id?: string
  url?: string
}
export interface UpdateUserRequest {
  mochi_api_key?: string
}
// Utility types
export type FieldType = "text" | "audio"

export interface MochiDeckMappingItem {
  id: string
  name: string

  template_id: string

  lingominer_template_name: string | null
  lingominer_template_id: string | null
}

export interface MochiDeckMapping extends MochiDeckMappingItem {
  lingominer_template_name: string | null
  lingominer_template_id: string | null

  template_content: string
  template_fields: Record<
    string,
    {
      id: string
      name: string
      type: string | null
      options: Record<string, string | boolean> | null
      source: string | null

      lingominer_field_name: string | null
      lingominer_field_id: string | null
    }
  >
}

export interface MochiMappingCreate {
  mochi_deck_id: string
  mochi_template_id: string

  lingominer_template_id: string
  lingominer_template_name: string
  mapping: Record<string,
    {
      id: string
      name: string
    } | null>
}
