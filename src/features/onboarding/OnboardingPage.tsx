export function OnboardingPage() {
  return (
    <section className='space-y-6 rounded-xl bg-surface-contrast p-6 shadow-card'>
      <header className='space-y-2'>
        <h2 className='text-xl font-semibold text-foreground'>시작하기</h2>
        <p className='text-sm text-muted'>
          온보딩 과정을 통해 목표를 설정하고, 알림을 받아 꾸준히 작성할 준비를 마쳐보세요.
        </p>
      </header>
      <ol className='space-y-4 text-sm text-muted'>
        <li className='rounded-xl border border-divider bg-surface px-4 py-3'>
          1. 당신의 주요 관심사와 현재 감정 상태를 선택하세요.
        </li>
        <li className='rounded-xl border border-divider bg-surface px-4 py-3'>
          2. 매일 답변을 작성할 시간을 정하고 알림을 설정하세요.
        </li>
        <li className='rounded-xl border border-divider bg-surface px-4 py-3'>
          3. 첫 번째 답변을 작성하고 오늘의 마음가짐을 기록하세요.
        </li>
      </ol>
    </section>
  )
}
