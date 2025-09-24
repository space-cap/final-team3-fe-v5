import { http, HttpResponse } from 'msw'

import type { OnboardingStatus } from '../../features/onboarding'

const status: OnboardingStatus = {
  steps: [
    {
      id: 'step-1',
      title: '관심사와 현재 감정 선택',
      description: '오늘의 마음 상태와 앞으로 집중하고 싶은 관심사를 선택합니다.',
      completed: true,
    },
    {
      id: 'step-2',
      title: '답변 작성 알림 설정',
      description: '답변을 작성할 시간과 알림 채널(이메일/푸시)을 선택합니다.',
      completed: false,
    },
    {
      id: 'step-3',
      title: '첫 번째 답변 작성',
      description: '오늘의 질문에 대한 답변을 작성하고 마음가짐을 기록합니다.',
      completed: false,
    },
  ],
  nextReminderAt: '2025-09-25T09:00:00Z',
}

export const onboardingHandlers = [
  http.get('/api/onboarding/status', () => HttpResponse.json(status)),
]
