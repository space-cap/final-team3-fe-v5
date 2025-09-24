import { useOnboardingStatus } from './api/useOnboardingStatus'

export function OnboardingPage() {
  const { data, isLoading, isError, refetch } = useOnboardingStatus()

  if (isLoading) {
    return (
      <section className='space-y-6 rounded-xl bg-surface-contrast p-6 shadow-card'>
        <header className='space-y-2'>
          <div className='h-5 w-28 animate-pulse rounded-full bg-surface-muted' />
          <div className='h-4 w-64 animate-pulse rounded-full bg-surface-muted' />
        </header>
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='h-12 animate-pulse rounded-xl bg-surface-muted' />
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className='space-y-4 rounded-xl bg-surface-contrast p-6 text-sm text-muted shadow-card'>
        <p>온보딩 정보를 불러오는 데 문제가 발생했어요.</p>
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
    <section className='space-y-6 rounded-xl bg-surface-contrast p-6 shadow-card'>
      <header className='space-y-2'>
        <h2 className='text-xl font-semibold text-foreground'>시작하기</h2>
        <p className='text-sm text-muted'>
          온보딩 과정을 통해 목표를 설정하고, 알림을 받아 꾸준히 작성할 준비를 마쳐보세요.
        </p>
      </header>
      <ol className='space-y-4 text-sm text-muted'>
        {data.steps.map((step, index) => (
          <li
            key={step.id}
            className='flex items-start gap-4 rounded-xl border border-divider bg-surface px-4 py-3'
          >
            <span className='mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-muted'>
              {index + 1}
            </span>
            <div className='space-y-1'>
              <p className='text-sm font-semibold text-foreground'>{step.title}</p>
              <p className='text-xs leading-relaxed text-muted'>{step.description}</p>
              {step.completed ? (
                <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                  완료됨
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {data.nextReminderAt ? (
        <p className='rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-xs text-primary'>
          다음 알림 예정 시각: {new Date(data.nextReminderAt).toLocaleString('ko-KR')}
        </p>
      ) : null}
    </section>
  )
}
