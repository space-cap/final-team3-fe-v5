import { http, HttpResponse } from 'msw'

import type { AnswerHistoryItem } from '../../features/answer-history'

const history: AnswerHistoryItem[] = [
  {
    id: '2025-09-22',
    questionTitle: '오늘 하루를 돌아보며 가장 고마웠던 순간은?',
    createdAt: '2025-09-22T21:35:00Z',
    preview:
      '퇴근길에 친구가 건넨 말 한마디 덕분에 마음이 풀렸어요. 덕분에 오늘 하루를 긍정적으로 마무리할 수 있었어요.',
  },
  {
    id: '2025-09-21',
    questionTitle: '이번 주에 실천한 작은 습관은 무엇이었나요?',
    createdAt: '2025-09-21T22:10:00Z',
    preview: '출근 전에 10분간 스트레칭을 하며 몸을 깨웠고, 덕분에 오전 집중력이 좋아졌어요.',
  },
]

export const answerHandlers = [
  http.get('/api/answers/history', () => HttpResponse.json(history)),
]
