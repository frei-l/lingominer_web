"use client"

import useSWR, { SWRConfiguration } from 'swr'
import { fetcher, ApiError } from './core'
import { Card, PassageList, TemplateList, Template, GenerationDetail, Passage } from './types'

// Cards
export function useCards(config?: SWRConfiguration) {
  return useSWR<Card[], ApiError>(
    '/cards',
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}

export function useCard(cardId: string, config?: SWRConfiguration) {
  return useSWR<Card, ApiError>(
    cardId ? `/cards/${cardId}` : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      ...config
    }
  )
}

// Passages
export function usePassages(config?: SWRConfiguration) {
  return useSWR<PassageList[], ApiError>(
    '/passages',
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}

export function usePassage(passageId: string, config?: SWRConfiguration) {
  return useSWR<Passage, ApiError>(
    `/passages/${passageId}`,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      ...config
    }
  )
}

// Templates
export function useTemplates(config?: SWRConfiguration) {
  return useSWR<TemplateList[], ApiError>(
    '/templates',
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}

export function useTemplateDetail(templateId: string, config?: SWRConfiguration) {
  return useSWR<Template, ApiError>(
    `/templates/${templateId}`,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}

export function useGenerationDetail(templateId: string, generationId: string, config?: SWRConfiguration) {
  return useSWR<GenerationDetail, ApiError>(
    `/templates/${templateId}/generations/${generationId}`,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      ...config
    }
  )
} 