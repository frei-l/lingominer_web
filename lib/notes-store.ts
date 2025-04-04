// Notes state management
import { create } from "zustand"
import { nanoid } from "nanoid"
import type { Note, SelectionInfo } from "./types.ts"
import { persist } from "zustand/middleware"

interface NotesState {
    notes: Note[]
    activeNoteId: string | null
    addNote: (selectionInfo: SelectionInfo, explanation: string) => string
    setActiveNote: (noteId: string | null) => void
    toggleNoteActive: (noteId: string) => void
    getActiveNote: () => Note | null
    getNotesByParagraph: (paragraphIndex: number) => Note[]
}

export const useNotesStore = create<NotesState>()(
    persist(
        (set, get) => ({
            notes: [],
            activeNoteId: null,

            addNote: (selectionInfo, explanation) => {
                const noteId = nanoid()

                const newNote: Note = {
                    id: noteId,
                    text: selectionInfo.text,
                    context: selectionInfo.context,
                    explanation,
                    paragraphIndex: selectionInfo.paragraphIndex,
                    startIndex: selectionInfo.startIndex,
                    endIndex: selectionInfo.endIndex,
                    timestamp: Date.now(),
                }

                set((state) => ({
                    notes: [...state.notes, newNote],
                    activeNoteId: noteId,
                }))

                return noteId
            },

            setActiveNote: (noteId) => {
                set({ activeNoteId: noteId })
            },

            toggleNoteActive: (noteId) => {
                set((state) => ({
                    activeNoteId: state.activeNoteId === noteId ? null : noteId,
                }))
            },

            getActiveNote: () => {
                const { notes, activeNoteId } = get()

                if (activeNoteId) {
                    return notes.find((note) => note.id === activeNoteId) || null
                }

                // If no active note but notes exist, return the most recent one
                return notes.length > 0 ? notes[notes.length - 1] : null
            },

            getNotesByParagraph: (paragraphIndex) => {
                return get().notes.filter((note) => note.paragraphIndex === paragraphIndex)
            },
        }),
        {
            name: "reader-notes-storage",
            // Only persist the notes array, not the methods or active state
            partialize: (state) => ({ notes: state.notes }),
        },
    ),
)

