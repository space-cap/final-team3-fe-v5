import { FormEvent } from 'react'

import { useQuestionStore } from '../../../app/store'
import { useDailyQuestion } from '../api/useDailyQuestion'

export function TodayQuestionPanel() {
  const { data, isLoading, isError, refetch } = useDailyQuestion()
  const draft = useQuestionStore((state) => state.draft)
  const updateDraft = useQuestionStore((state) => state.updateDraft)
  const resetDraft = useQuestionStore((state) => state.resetDraft)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!draft.trim()) {
      return
    }

    console.info('임시 저장된 답변', draft)
    resetDraft()
  }

  if (isLoading) {
    return (
      <section className='space-y-6'>
        <div className='h-6 w-40 animate-pulse rounded-full bg-surface-muted' />
        <div className='space-y-4 rounded-xl bg-surface-contrast p-6 shadow-card'>
          <div className='h-4 w-32 animate-pulse rounded-full bg-surface-muted' />
          <div className='h-8 w-3/4 animate-pulse rounded-full bg-surface-muted' />
          <div className='h-28 w-full animate-pulse rounded-lg bg-surface-muted' />
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className='rounded-xl border border-divider bg-surface-contrast p-6 text-sm text-muted'>
        <p>오늘의 질문을 불러오는 데 문제가 생겼어요. 다시 시도해 주세요.</p>
        <button
          type='button'
          onClick={() => refetch()}
          className='mt-4 rounded-full border border-divider px-4 py-2 text-muted hover:border-primary hover:text-primary'
        >
          새로 고침
        </button>
      </section>
    )
  }

  return (
    <section className='grid gap-6 lg:grid-cols-[2fr,3fr]'>
      <article className='space-y-4 rounded-xl bg-surface-contrast p-6 shadow-card'>
        <span className='inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted'>
          Day {data.dayIndex}
        </span>
        <header className='space-y-2'>
          <h2 className='text-sm font-medium text-muted'>{data.category}</h2>
          <h1 className='text-2xl font-semibold text-foreground'>{data.title}</h1>
        </header>
        <p className='text-base leading-relaxed text-muted'>{data.body}</p>
      </article>

      <form onSubmit={handleSubmit} className='flex flex-col rounded-xl bg-surface-contrast p-6 shadow-card'>
        <label htmlFor='daily-answer' className='mb-2 text-sm font-medium text-muted'>
          오늘의 답변
        </label>
        <textarea
          id='daily-answer'
          value={draft}
          onChange={(event) => updateDraft(event.target.value)}
          placeholder='오늘의 질문에 대한 생각을 자유롭게 적어보세요.'
          className='min-h-[220px] flex-1 resize-none rounded-xl border border-divider bg-surface px-4 py-3 text-sm leading-relaxed text-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40'
        />
        <div className='mt-4 flex items-center justify-between text-xs text-muted'>
          <span>{draft.trim().length}자</span>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => resetDraft()}
              className='rounded-full border border-divider px-4 py-2 text-muted hover:border-primary hover:text-primary'
            >
              초기화
            </button>
            <button
              type='submit'
              disabled={!draft.trim()}
              className='rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-surface-contrast'
            >
              임시 저장
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
