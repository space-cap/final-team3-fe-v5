import { create } from 'zustand'

type QuestionState = {
  currentQuestionId: string | null
  draft: string
  lastFetchedAt: string | null
  setCurrentQuestionId: (id: string | null) => void
  updateDraft: (value: string) => void
  resetDraft: () => void
  setLastFetchedAt: (iso: string | null) => void
}

export const useQuestionStore = create<QuestionState>((set) => ({
  currentQuestionId: null,
  draft: '',
  lastFetchedAt: null,
  setCurrentQuestionId: (id) =>
    set((state) => ({
      currentQuestionId: id,
      draft: state.currentQuestionId === id ? state.draft : '',
    })),
  updateDraft: (value) => set(() => ({ draft: value })),
  resetDraft: () => set(() => ({ draft: '' })),
  setLastFetchedAt: (iso) => set(() => ({ lastFetchedAt: iso })),
}))
