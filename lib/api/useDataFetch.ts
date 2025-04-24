"use client"

import useSWR, { SWRConfiguration } from 'swr'
import { fetcher, ApiError } from './core'
import { Card, PassageItem, TemplateItem, Template, Generation, Passage, User, MochiDeckMapping, MochiDeckMappingItem } from './types'

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
  return useSWR<PassageItem[], ApiError>(
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
    passageId ? `/passages/${passageId}` : null,
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
  return useSWR<TemplateItem[], ApiError>(
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
    templateId ? `/templates/${templateId}` : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}

export function useGenerationDetail(templateId: string, generationId: string, config?: SWRConfiguration) {
  return useSWR<Generation, ApiError>(
    generationId && templateId ? `/templates/${templateId}/generations/${generationId}` : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: false,
      ...config
    }
  )
}

export function useUser(config?: SWRConfiguration) {
  return useSWR<User, ApiError>(
    '/me',
    fetcher,
    config
  )
}

export function useMochiDeckMappings(config?: SWRConfiguration) {
  return useSWR<MochiDeckMappingItem[], ApiError>(
    '/mochi',
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}

export function useMochiDeckMapping(deckId: string, config?: SWRConfiguration) {
  return useSWR<MochiDeckMapping, ApiError>(
    deckId ? `/mochi/${deckId}` : null,
    fetcher,
    {
      suspense: false,
      revalidateOnFocus: true,
      ...config
    }
  )
}
