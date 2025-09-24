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
  await new Promise((resolve) => setTimeout(resolve, 120))

  return {
    id: new Date().toISOString().slice(0, 10),
    title: '오늘 하루를 돌아볼 때 가장 고마웠던 순간은 언제였나요?',
    body: '감사함을 느낀 이유와 그 순간이 지금의 나에게 어떤 의미였는지 적어보세요.',
    category: '감사',
    dayIndex: 142,
  }
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
