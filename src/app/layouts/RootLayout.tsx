import { useEffect, useMemo, useRef } from 'react'
import { NavLink, Outlet, useLoaderData } from 'react-router-dom'

import type { Session } from '../api/session'
import { useSessionStore } from '../store'

declare global {
  interface Window {
    __skipSessionSync?: boolean
  }
}

function navClass(isActive: boolean) {
  return [
    'rounded-full px-4 py-2 transition-colors',
    isActive ? 'bg-primary text-primary-foreground shadow-card' : 'hover:text-primary',
  ].join(' ')
}

const SESSION_FALLBACK_NAME = '게스트'

function normalizeSessionShape(session: Session): Session {
  return {
    userId: session.userId ?? '',
    displayName: session.displayName?.trim() ? session.displayName : SESSION_FALLBACK_NAME,
    isAuthenticated: Boolean(session.isAuthenticated),
    onboardingCompleted: Boolean(session.onboardingCompleted),
  }
}

function sessionsAreEqual(a: Session, b: Session) {
  const normalizedA = normalizeSessionShape(a)
  const normalizedB = normalizeSessionShape(b)
  return (
    normalizedA.userId === normalizedB.userId &&
    normalizedA.displayName === normalizedB.displayName &&
    normalizedA.isAuthenticated === normalizedB.isAuthenticated &&
    normalizedA.onboardingCompleted === normalizedB.onboardingCompleted
  )
}

function createSessionSignature(session: Session): string {
  return [
    session.userId,
    session.displayName,
    session.isAuthenticated ? '1' : '0',
    session.onboardingCompleted ? '1' : '0',
  ].join('|')
}

export function RootLayout() {
  const { session } = useLoaderData() as { session: Session }
  const normalizedSession = useMemo(
    () => normalizeSessionShape(session),
    [session.userId, session.displayName, session.isAuthenticated, session.onboardingCompleted],
  )
  const lastSyncedSignatureRef = useRef<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__skipSessionSync === true) {
      return
    }

    const signature = createSessionSignature(normalizedSession)
    if (lastSyncedSignatureRef.current === signature) {
      return
    }

    const current = useSessionStore.getState()
    const matches =
      current.initialized &&
      sessionsAreEqual(
        {
          userId: current.userId,
          displayName: current.displayName,
          isAuthenticated: current.isAuthenticated,
          onboardingCompleted: current.onboardingCompleted,
        },
        normalizedSession,
      )

    if (matches) {
      lastSyncedSignatureRef.current = signature
      return
    }

    current.setSession(normalizedSession)
    lastSyncedSignatureRef.current = signature
  }, [normalizedSession])

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
              <NavLink to='/today' data-testid='nav-today' className={({ isActive }) => navClass(isActive)}>
                오늘의 질문
              </NavLink>
              <NavLink to='/history' data-testid='nav-history' className={({ isActive }) => navClass(isActive)}>
                답변 히스토리
              </NavLink>
              <NavLink to='/onboarding' data-testid='nav-onboarding' className={({ isActive }) => navClass(isActive)}>
                온보딩
              </NavLink>
            </nav>
            <div
              data-testid='user-badge'
              className='rounded-full border border-divider px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted'
            >
              {normalizedSession.displayName}
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
