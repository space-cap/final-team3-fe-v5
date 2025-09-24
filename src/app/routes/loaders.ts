import type { LoaderFunctionArgs } from 'react-router-dom'
import { redirect } from 'react-router-dom'

import { fetchSession } from '../api/session'

export async function rootLoader() {
  const session = await fetchSession()
  return { session }
}

export async function requireOnboardingCompleteLoader({ request }: LoaderFunctionArgs) {
  const session = await fetchSession({ signal: request.signal })

  if (!session.isAuthenticated || !session.onboardingCompleted) {
    throw redirect('/onboarding')
  }

  return null
}

export async function onboardingOnlyLoader({ request }: LoaderFunctionArgs) {
  const session = await fetchSession({ signal: request.signal })

  if (session.onboardingCompleted) {
    throw redirect('/today')
  }

  return { session }
}

export async function redirectToTodayLoader() {
  throw redirect('/today')
}
