import { create } from 'zustand'

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

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,
  initialized: false,
  setSession: (session) =>
    set((state) => ({
      ...state,
      ...session,
      initialized: true,
    })),
  resetSession: () =>
    set((state) => ({
      ...state,
      ...initialState,
      initialized: true,
    })),
}))
