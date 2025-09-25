import { http, HttpResponse } from 'msw'

import { resetOnboardingStatus } from '../handlers/onboardingHandlers'
import { resetSessionPayload } from '../handlers/sessionHandlers'

export const testingHandlers = [
  http.post('/testing/reset', async () => {
    resetSessionPayload()
    resetOnboardingStatus()
    return HttpResponse.json({ ok: true })
  }),
]
