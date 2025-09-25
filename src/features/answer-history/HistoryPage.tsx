import { useAnswerHistory } from './api/useAnswerHistory'

export function HistoryPage() {
  const { data, isLoading, isError, refetch } = useAnswerHistory()

  if (isLoading) {
    return (
      <section data-testid='history-list-section' className='space-y-4 rounded-xl bg-surface-contrast p-6 shadow-card'>
        <header className='space-y-2'>
          <div className='h-5 w-28 animate-pulse rounded-full bg-surface-muted' />
          <div className='h-4 w-56 animate-pulse rounded-full bg-surface-muted' />
        </header>
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='space-y-3 rounded-xl border border-divider bg-surface p-4'>
              <div className='h-3 w-32 animate-pulse rounded-full bg-surface-muted' />
              <div className='h-4 w-2/3 animate-pulse rounded-full bg-surface-muted' />
              <div className='h-12 w-full animate-pulse rounded-lg bg-surface-muted' />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className='space-y-4 rounded-xl bg-surface-contrast p-6 text-sm text-muted shadow-card'>
        <p>답변 히스토리를 불러오는 데 문제가 발생했어요.</p>
        <button
          type='button'
          onClick={() => refetch()}
          className='rounded-full border border-divider px-4 py-2 text-muted transition hover:border-primary hover:text-primary'
        >
          다시 시도
        </button>
      </section>
    )
  }

  return (
    <section className='space-y-4 rounded-xl bg-surface-contrast p-6 shadow-card'>
      <header className='space-y-2'>
        <h2 className='text-xl font-semibold text-foreground'>최근 답변</h2>
        <p className='text-sm text-muted'>작성한 답변을 다시 읽어보며 감정의 변화를 살펴보세요.</p>
      </header>

      <div className='flex flex-col gap-4'>
        {data.map((item) => (
          <article data-testid='history-item' key={item.id} className='space-y-3 rounded-xl border border-divider bg-surface p-4 transition hover:border-primary/70'>
            <div className='flex flex-wrap items-center justify-between gap-2 text-xs text-muted'>
              <span>{new Date(item.createdAt).toLocaleString('ko-KR')}</span>
              <span className='rounded-full bg-surface-muted px-3 py-1 font-medium text-muted'>Day {item.id}</span>
            </div>
            <h3 className='text-sm font-semibold text-foreground'>{item.questionTitle}</h3>
            <p className='text-sm leading-relaxed text-muted'>{item.preview}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
