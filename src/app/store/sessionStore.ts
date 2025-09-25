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

function normalizeSession(session: Session): Session {
  return {
    userId: session.userId ?? '',
    displayName: session.displayName ?? '게스트',
    isAuthenticated: Boolean(session.isAuthenticated),
    onboardingCompleted: Boolean(session.onboardingCompleted),
  }
}

function sessionsAreEqual(a: SessionState, b: Session): boolean {
  const normalized = normalizeSession(b)
  return (
    a.userId === normalized.userId &&
    a.displayName === normalized.displayName &&
    a.isAuthenticated === normalized.isAuthenticated &&
    a.onboardingCompleted === normalized.onboardingCompleted
  )
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
      ...normalizeSession(initialState),
      initialized: false,
      setSession: (session) =>
        set(
          (prev) => {
            const next = normalizeSession(session)
            if (sessionsAreEqual(prev, next) && prev.initialized) {
              return prev
            }

            return {
              ...prev,
              ...next,
              initialized: true,
            }
          }),
      resetSession: () =>
        set(
          (prev) => {
            if (sessionsAreEqual(prev, initialState) && prev.initialized) {
              return prev
            }

            return {
              ...prev,
              ...normalizeSession(initialState),
              initialized: true,
            }
          }),
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
