import { useQuery } from '@tanstack/react-query'

export type AnswerHistoryItem = {
  id: string
  questionTitle: string
  createdAt: string
  preview: string
}

export async function fetchAnswerHistory(): Promise<AnswerHistoryItem[]> {
  const response = await fetch('/api/answers/history', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('답변 히스토리를 불러오지 못했습니다.')
  }

  return (await response.json()) as AnswerHistoryItem[]
}

export function useAnswerHistory() {
  return useQuery({
    queryKey: ['answers', 'history'],
    queryFn: fetchAnswerHistory,
    staleTime: 1000 * 60 * 5,
  })
}
