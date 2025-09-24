export type Session = {
  userId: string
  displayName: string
  isAuthenticated: boolean
  onboardingCompleted: boolean
}

export async function fetchSession(init?: RequestInit): Promise<Session> {
  const response = await fetch('/api/session', {
    credentials: 'include',
    ...init,
  })

  if (!response.ok) {
    throw new Error('세션 정보를 불러오지 못했습니다.')
  }

  return (await response.json()) as Session
}
