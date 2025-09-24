const mockHistory = [
  {
    id: '2025-09-22',
    question: '오늘 하루를 돌아보며 가장 고마웠던 순간은?',
    createdAt: '2025-09-22T21:35:00Z',
    preview:
      '퇴근길에 친구가 건넨 말 한마디 덕분에 마음이 풀렸어요. 덕분에 오늘 하루를 긍정적으로 마무리할 수 있었어요.',
  },
  {
    id: '2025-09-21',
    question: '이번 주에 실천한 작은 습관은 무엇이었나요?',
    createdAt: '2025-09-21T22:10:00Z',
    preview: '출근 전에 10분간 스트레칭을 하며 몸을 깨웠고, 덕분에 오전 집중력이 좋아졌어요.',
  },
]

export function HistoryPage() {
  return (
    <section className='space-y-4 rounded-xl bg-surface-contrast p-6 shadow-card'>
      <header className='space-y-2'>
        <h2 className='text-xl font-semibold text-foreground'>최근 답변</h2>
        <p className='text-sm text-muted'>작성한 답변을 다시 읽어보며 감정의 변화를 살펴보세요.</p>
      </header>

      <div className='flex flex-col gap-4'>
        {mockHistory.map((item) => (
          <article key={item.id} className='space-y-3 rounded-xl border border-divider bg-surface p-4 transition hover:border-primary/70'>
            <div className='flex items-center justify-between text-xs text-muted'>
              <span>{new Date(item.createdAt).toLocaleString('ko-KR')}</span>
              <span className='rounded-full bg-surface-muted px-3 py-1 font-medium text-muted'>Day {item.id}</span>
            </div>
            <h3 className='text-sm font-semibold text-foreground'>{item.question}</h3>
            <p className='text-sm leading-relaxed text-muted'>{item.preview}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
