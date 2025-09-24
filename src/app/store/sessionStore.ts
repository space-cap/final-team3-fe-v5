import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Session } from '../api/session'

type SessionState = Session & {
  initialized: boolean
  setSession: (session: Session) => void
  resetSession: () => void
}

const initialState: Session = {
  userId: '',
  displayName: '게스트',
  isAuthenticated: false,
  onboardingCompleted: false,
}

const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0
  },
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      initialized: false,
      setSession: (session) =>
        set(() => ({
          ...session,
          initialized: true,
        })),
      resetSession: () =>
        set(() => ({
          ...initialState,
          initialized: true,
        })),
    }),
    {
      name: 'session-store-v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.sessionStorage : memoryStorage)),
      partialize: (state) => ({
        userId: state.userId,
        displayName: state.displayName,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
        initialized: true,
      }),
    },
  ),
)
