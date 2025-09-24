import { http, HttpResponse } from 'msw'

import type { OnboardingStatus } from '../../features/onboarding'
import { getSessionPayload, setSessionPayload } from './sessionHandlers'

let status: OnboardingStatus = {
  steps: [
    {
      id: 'step-1',
      title: '관심사와 현재 감정 선택',
      description: '오늘의 마음 상태와 앞으로 집중하고 싶은 관심사를 선택합니다.',
      completed: true,
      summary: '선택한 관심사: 마음돌봄 | 오늘 기분: 평온해요',
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

function createSummary(stepId: string, data?: Record<string, unknown>) {
  if (stepId === 'step-1') {
    const interests = Array.isArray(data?.interests) ? (data?.interests as string[]) : []
    const mood = typeof data?.mood === 'string' ? (data.mood as string) : '미입력'
    return `선택한 관심사: ${interests.length ? interests.join(', ') : '없음'} | 오늘 기분: ${mood}`
  }

  if (stepId === 'step-2') {
    const reminderTime = typeof data?.reminderTime === 'string' ? (data.reminderTime as string) : '--:--'
    const reminderChannel = typeof data?.reminderChannel === 'string' ? (data.reminderChannel as string) : '미선택'
    const channelLabel = reminderChannel === 'push' ? '푸시 알림' : '이메일'
    return `알림 시간: ${reminderTime} | 채널: ${channelLabel}`
  }

  if (stepId === 'step-3') {
    const reflection = typeof data?.reflection === 'string' ? (data.reflection as string) : ''
    if (!reflection) {
      return undefined
    }
    const trimmed = reflection.length > 60 ? `${reflection.slice(0, 57)}...` : reflection
    return `첫 답변: ${trimmed}`
  }

  return undefined
}

function markStepComplete(stepId: string, data?: Record<string, unknown>) {
  status = {
    ...status,
    steps: status.steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            completed: true,
            summary: createSummary(stepId, data) ?? step.summary,
          }
        : step,
    ),
  }

  if (stepId === 'step-2' && typeof data?.reminderTime === 'string') {
    const baseDate = new Date('2025-09-25T00:00:00Z')
    const [hours, minutes] = (data.reminderTime as string).split(':').map(Number)
    baseDate.setUTCHours(hours ?? 0, minutes ?? 0, 0, 0)
    status = { ...status, nextReminderAt: baseDate.toISOString() }
  }

  const allCompleted = status.steps.every((step) => step.completed)
  if (allCompleted) {
    const session = getSessionPayload()
    setSessionPayload({ ...session, onboardingCompleted: true })
  }
}

export const onboardingHandlers = [
  http.get('/api/onboarding/status', () => HttpResponse.json(status)),
  http.patch('/api/onboarding/status', async ({ request }) => {
    const body = (await request.json()) as { stepId?: string; data?: Record<string, unknown> }

    if (!body.stepId) {
      return HttpResponse.json({ message: 'stepId is required' }, { status: 400 })
    }

    markStepComplete(body.stepId, body.data)
    return HttpResponse.json(status)
  }),
]
