import { http, HttpResponse } from 'msw'

import type { Session } from '../../app/api/session'

const initialSessionPayload: Session = {
  userId: 'user-001',
  displayName: '김온유',
  isAuthenticated: true,
  onboardingCompleted: false,
}

let sessionPayload: Session = { ...initialSessionPayload }

export function setSessionPayload(next: Session) {
  sessionPayload = next
}

export function resetSessionPayload() {
  sessionPayload = { ...initialSessionPayload }
}

export function getSessionPayload() {
  return sessionPayload
}

export const sessionHandlers = [
  http.get('/api/session', () => HttpResponse.json(sessionPayload)),
]
