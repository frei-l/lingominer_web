"use client"

import { apiFetch } from './core'
import { Card, CreateCardRequest, CreateNoteRequest, Generation, GenerationField, MochiMappingCreate, Note, PassageItem, Template, UpdateUserRequest, User } from './types'

// Users
export const usersAPI = {
    update: (data: UpdateUserRequest) =>
        apiFetch<User>(`/me/settings`, 'PATCH', data)
}

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
    create: (data: { url: string }) => {
        const querystring = new URLSearchParams(data)
        return apiFetch<PassageItem>(`/passages?${querystring.toString()}`, 'POST')
    },

    update: (id: string, data: Partial<PassageItem>) =>
        apiFetch<PassageItem>(`/passages/${id}`, 'PATCH', data),

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
        apiFetch<Generation>(`/templates/${templateId}/generations`, 'POST', data),

    updateGeneration: (templateId: string, generationId: string, data: any) =>
        apiFetch<Generation>(`/templates/${templateId}/generations/${generationId}`, 'PATCH', data),

    deleteGeneration: (templateId: string, generationId: string) =>
        apiFetch<void>(`/templates/${templateId}/generations/${generationId}`, 'DELETE'),

    createField: (templateId: string, data: any) =>
        apiFetch<GenerationField>(`/templates/${templateId}/fields`, 'POST', data),

    updateField: (templateId: string, fieldId: string, data: any) =>
        apiFetch<GenerationField>(`/templates/${templateId}/fields/${fieldId}`, 'PATCH', data),

    deleteField: (templateId: string, fieldId: string) =>
        apiFetch<void>(`/templates/${templateId}/fields/${fieldId}`, 'DELETE')
}

// Mochi
export const mochiAPI = {
    createMapping: (data: MochiMappingCreate) =>
        apiFetch<void>(`/mochi`, 'POST', data),
    createCard: (deckId: string, lm_card_id: string) =>
        apiFetch<Card>(`/mochi/${deckId}/cards?lm_card_id=${lm_card_id}`, 'POST'),
}