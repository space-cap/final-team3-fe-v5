import { AppProviders } from './app/providers'
import { TodayQuestionPanel } from './features/daily-question'

function App() {
  return (
    <AppProviders>
      <div className='min-h-screen bg-surface text-foreground'>
        <header className='border-b border-divider bg-surface-contrast/80 backdrop-blur'>
          <div className='mx-auto flex max-w-5xl items-center justify-between px-6 py-6'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-muted'>Daily Reflection</p>
              <h1 className='text-2xl font-semibold text-foreground'>Q&A 케어 저널</h1>
            </div>
            <button className='rounded-full border border-divider px-4 py-2 text-sm font-medium text-muted transition hover:border-primary hover:text-primary'>
              알림 설정
            </button>
          </div>
        </header>

        <main className='mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10'>
          <section className='rounded-xl border border-divider bg-surface-contrast/70 p-5 text-sm text-muted shadow-card'>
            <p>
              매일 하나의 질문으로 마음을 다시 정돈해보세요. 답변은 추후 히스토리에서 다시 확인하고 편집할 수 있습니다.
            </p>
          </section>

          <TodayQuestionPanel />
        </main>
      </div>
    </AppProviders>
  )
}

export default App
