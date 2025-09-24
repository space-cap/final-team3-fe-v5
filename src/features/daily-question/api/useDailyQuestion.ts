import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useQuestionStore } from '../../../app/store'

export type DailyQuestion = {
  id: string
  title: string
  body: string
  category: string
  dayIndex: number
}

const fetchDailyQuestion = async (): Promise<DailyQuestion> => {
  const response = await fetch('/api/questions/daily')

  if (!response.ok) {
    throw new Error('오늘의 질문을 불러오지 못했습니다.')
  }

  const result = (await response.json()) as DailyQuestion
  return result
}

export function useDailyQuestion() {
  const setCurrentQuestionId = useQuestionStore((state) => state.setCurrentQuestionId)
  const setLastFetchedAt = useQuestionStore((state) => state.setLastFetchedAt)

  const query = useQuery<DailyQuestion>({
    queryKey: ['questions', 'daily'],
    queryFn: fetchDailyQuestion,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  })

  useEffect(() => {
    if (query.data) {
      setCurrentQuestionId(query.data.id)
      setLastFetchedAt(new Date().toISOString())
    }
  }, [query.data, setCurrentQuestionId, setLastFetchedAt])

  return query
}
