export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text()

  if (!text) {
    // @ts-expect-error allow empty body
    return undefined
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApiError('응답을 파싱하지 못했습니다.', response.status)
  }
}

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const message = response.status === 404 ? '요청한 리소스를 찾을 수 없습니다.' : '요청을 처리하지 못했습니다.'
    throw new ApiError(message, response.status)
  }

  return parseJson<T>(response)
}
