# LingoMiner Web

A web interface for LingoMiner, a tool for language learning through authentic context.

## API Usage

The API has been refactored to use SWR for data fetching with better caching, revalidation, and error handling.

### API Hooks

#### Cards API

```typescript
// Get all cards
const { data: cards, error, isLoading } = useCards()

// Get a single card
const { data: card } = useCard(cardId)

// Create a card
const { trigger: createCard } = useCreateCard()
await createCard(newCardData)

// Update a card
const { trigger: updateCard } = useUpdateCard(cardId)
await updateCard(updatedCardData)

// Delete a card
const { trigger: deleteCard } = useDeleteCard()
await deleteCard(cardId)
```

#### Passages API

```typescript
// Get all passages
const { data: passages } = usePassages()

// Get a single passage
const { data: passage } = usePassage(passageId)

// Create a passage
const { trigger: createPassage } = useCreatePassage()
await createPassage({ url: 'https://example.com' })

// Update a passage
const { trigger: updatePassage } = useUpdatePassage(passageId)
await updatePassage(updatedPassageData)

// Delete a passage
const { trigger: deletePassage } = useDeletePassage()
await deletePassage(passageId)
```

#### Templates API

```typescript
// Get all templates
const { data: templates } = useTemplates()

// Get a single template detail
const { data: template } = useTemplateDetail(templateId)

// Get generation detail
const { data: generation } = useGenerationDetail(templateId, generationId)

// Create a template
const { trigger: createTemplate } = useCreateTemplate()
await createTemplate({ name: 'My Template', lang: 'en' })

// Delete a template
const { trigger: deleteTemplate } = useDeleteTemplate()
await deleteTemplate(templateId)

// Create a generation
const { trigger: createGeneration } = useCreateGeneration(templateId)
await createGeneration({ name: 'My Generation', method: 'completion', inputs: [] })

// Update a generation
const { trigger: updateGeneration } = useUpdateGeneration(templateId, generationId)
await updateGeneration({ name: 'Updated Generation' })

// Delete a generation
const { trigger: deleteGeneration } = useDeleteGeneration(templateId)
await deleteGeneration(generationId)

// Create a field
const { trigger: createField } = useCreateField(templateId)
await createField({ name: 'My Field', type: 'text', generation_id: generationId })

// Update a field
const { trigger: updateField } = useUpdateField(templateId, fieldId)
await updateField({ description: 'Updated description' })

// Delete a field
const { trigger: deleteField } = useDeleteField(templateId)
await deleteField(fieldId)
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
