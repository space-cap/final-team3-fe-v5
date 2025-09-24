import { useQuery } from '@tanstack/react-query'

import { fetchJson } from '../../../app/api/client'

export type AnswerHistoryItem = {
  id: string
  questionTitle: string
  createdAt: string
  preview: string
}

export async function fetchAnswerHistory(): Promise<AnswerHistoryItem[]> {
  return fetchJson<AnswerHistoryItem[]>('/api/answers/history')
}

export function useAnswerHistory() {
  return useQuery({
    queryKey: ['answers', 'history'],
    queryFn: fetchAnswerHistory,
    staleTime: 1000 * 60 * 5,
  })
}
