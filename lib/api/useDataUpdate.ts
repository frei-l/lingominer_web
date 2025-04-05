"use client"

import { apiFetch } from './core'
import { Card, GenerationDetail, GenerationField, PassageList, Template, CreateNoteRequest, Note, CreateCardRequest } from './types'



// Cards
export const cardsAPI = {
    create: (data: CreateCardRequest) =>
        apiFetch<Card>('/cards', 'POST', data),

    update: (id: string, data: Partial<Card>) =>
        apiFetch<Card>(`/cards/${id}`, 'PATCH', data),

    delete: (id: string) =>
        apiFetch<void>(`/cards/${id}`, 'DELETE')
}

// Passages
export const passagesAPI = {
    create: (data: { url: string }) =>
        apiFetch<PassageList>('/passages', 'POST', data),

    update: (id: string, data: Partial<PassageList>) =>
        apiFetch<PassageList>(`/passages/${id}`, 'PATCH', data),

    delete: (id: string) =>
        apiFetch<void>(`/passages/${id}`, 'DELETE'),

    createNote: (passageId: string, data: CreateNoteRequest) =>
        apiFetch<Note>(`/passages/${passageId}/notes`, 'POST', data)
}

// Templates
export const templatesAPI = {
    create: (data: any) =>
        apiFetch<Template>('/templates', 'POST', data),

    delete: (id: string) =>
        apiFetch<void>(`/templates/${id}`, 'DELETE'),

    createGeneration: (templateId: string, data: any) =>
        apiFetch<GenerationDetail>(`/templates/${templateId}/generations`, 'POST', data),

    updateGeneration: (templateId: string, generationId: string, data: any) =>
        apiFetch<GenerationDetail>(`/templates/${templateId}/generations/${generationId}`, 'PATCH', data),

    deleteGeneration: (templateId: string, generationId: string) =>
        apiFetch<void>(`/templates/${templateId}/generations/${generationId}`, 'DELETE'),

    createField: (templateId: string, data: any) =>
        apiFetch<GenerationField>(`/templates/${templateId}/fields`, 'POST', data),

    updateField: (templateId: string, fieldId: string, data: any) =>
        apiFetch<GenerationField>(`/templates/${templateId}/fields/${fieldId}`, 'PATCH', data),

    deleteField: (templateId: string, fieldId: string) =>
        apiFetch<void>(`/templates/${templateId}/fields/${fieldId}`, 'DELETE')
} 