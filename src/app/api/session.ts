import { fetchJson } from './client'

export type Session = {
  userId: string
  displayName: string
  isAuthenticated: boolean
  onboardingCompleted: boolean
}

export async function fetchSession(init?: RequestInit): Promise<Session> {
  return fetchJson<Session>('/api/session', init)
}
