import { useQuery } from '@tanstack/react-query'

import { fetchJson } from '../../../app/api/client'

export type OnboardingStep = {
  id: string
  title: string
  description: string
  completed: boolean
}

export type OnboardingStatus = {
  steps: OnboardingStep[]
  nextReminderAt: string | null
}

async function fetchOnboardingStatus(): Promise<OnboardingStatus> {
  return fetchJson<OnboardingStatus>('/api/onboarding/status')
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboarding', 'status'],
    queryFn: fetchOnboardingStatus,
    staleTime: 1000 * 60 * 10,
  })
}
