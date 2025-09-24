import { http, HttpResponse } from 'msw'

import type { DailyQuestion } from '../../features/daily-question'

const dailyQuestion: DailyQuestion = {
  id: '2025-09-24',
  title: '오늘 하루를 돌아볼 때 가장 고마웠던 순간은 언제였나요?',
  body: '감사함을 느낀 이유와 그 순간이 지금의 나에게 어떤 의미였는지 적어보세요.',
  category: '감사',
  dayIndex: 142,
}

export const questionHandlers = [
  http.get('/api/questions/daily', () => HttpResponse.json(dailyQuestion)),
]
