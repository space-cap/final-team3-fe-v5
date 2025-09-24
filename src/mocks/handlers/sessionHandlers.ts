import { http, HttpResponse } from 'msw'

import type { Session } from '../../app/api/session'

const sessionPayload: Session = {
  userId: 'user-001',
  displayName: '김온유',
  isAuthenticated: true,
  onboardingCompleted: false,
}

export const sessionHandlers = [
  http.get('/api/session', () => HttpResponse.json(sessionPayload)),
]
