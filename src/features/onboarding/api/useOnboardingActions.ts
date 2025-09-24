import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchJson } from '../../../app/api/client'
import type { OnboardingStatus } from './useOnboardingStatus'

export type CompleteStepPayload = {
  stepId: string
  data?: Record<string, unknown>
}

export async function completeOnboardingStep(payload: CompleteStepPayload): Promise<OnboardingStatus> {
  return fetchJson<OnboardingStatus>('/api/onboarding/status', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function useCompleteOnboardingStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeOnboardingStep,
    onSuccess: (status) => {
      queryClient.setQueryData(['onboarding', 'status'], status)
    },
  })
}
