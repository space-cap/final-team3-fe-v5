import { useQuery } from '@tanstack/react-query'

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
  const response = await fetch('/api/onboarding/status', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('온보딩 정보를 불러오지 못했습니다.')
  }

  return (await response.json()) as OnboardingStatus
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboarding', 'status'],
    queryFn: fetchOnboardingStatus,
    staleTime: 1000 * 60 * 10,
  })
}
