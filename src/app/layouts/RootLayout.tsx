import { useEffect } from 'react'
import { NavLink, Outlet, useLoaderData } from 'react-router-dom'

import type { Session } from '../api/session'
import { useSessionStore } from '../store'

function navClass(isActive: boolean) {
  return [
    'rounded-full px-4 py-2 transition-colors',
    isActive ? 'bg-primary text-primary-foreground shadow-card' : 'hover:text-primary',
  ].join(' ')
}

export function RootLayout() {
  const { session } = useLoaderData() as { session: Session }
  const setSession = useSessionStore((state) => state.setSession)

  useEffect(() => {
    setSession(session)
  }, [session, setSession])

  return (
    <div className='min-h-screen bg-surface text-foreground'>
      <header className='border-b border-divider bg-surface-contrast/80 backdrop-blur'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-6 py-6'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-muted'>Daily Reflection</p>
            <h1 className='text-2xl font-semibold text-foreground'>Q&A 케어 저널</h1>
          </div>
          <div className='flex items-center gap-6'>
            <nav className='flex items-center gap-4 text-sm font-medium text-muted'>
              <NavLink to='/today' className={({ isActive }) => navClass(isActive)}>
                오늘의 질문
              </NavLink>
              <NavLink to='/history' className={({ isActive }) => navClass(isActive)}>
                답변 히스토리
              </NavLink>
              <NavLink to='/onboarding' className={({ isActive }) => navClass(isActive)}>
                온보딩
              </NavLink>
            </nav>
            <div className='rounded-full border border-divider px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted'>
              {session.displayName}
            </div>
          </div>
        </div>
      </header>

      <main className='mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10'>
        <section className='rounded-xl border border-divider bg-surface-contrast/70 p-5 text-sm text-muted shadow-card'>
          <p>매일 하나의 질문으로 마음을 다시 정돈해보세요. 답변은 히스토리에서 다시 열람하고 편집할 수 있습니다.</p>
        </section>

        <Outlet />
      </main>
    </div>
  )
}
