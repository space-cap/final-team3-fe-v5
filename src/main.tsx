declare global {
  interface Window {
    __disableMSW?: boolean
    __mswReady?: boolean
    __mswControls?: {
      resetMocks: () => void
    }
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

async function enableMocking() {
  console.info('[msw] enableMocking called')
  if (import.meta.env.DEV && !(typeof window !== 'undefined' && window.__disableMSW)) {
    console.info('[msw] starting worker')
    const { startMockWorker } = await import('./mocks/browser')
    await startMockWorker()
  }
}

async function bootstrap() {
  await enableMocking()

  const rootElement = document.getElementById('root')

  if (!rootElement) {
    throw new Error('Root element not found')
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
