import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'
import { resetSessionPayload } from './handlers/sessionHandlers'
import { resetOnboardingStatus } from './handlers/onboardingHandlers'

export const worker = setupWorker(...handlers)

export async function startMockWorker() {
  console.info('[msw] startMockWorker called')
  resetSessionPayload()
  resetOnboardingStatus()
  const instance = await worker.start({ onUnhandledRequest: 'bypass' })
  if (typeof window !== 'undefined') {
    const globalWindow = window as typeof window & {
      __mswReady?: boolean
      __mswControls?: { resetMocks: () => void }
    }
    globalWindow.__mswReady = true
    globalWindow.__mswControls = {
      resetMocks: () => {
        resetSessionPayload()
        resetOnboardingStatus()
      },
    }
  }
  return instance
}
