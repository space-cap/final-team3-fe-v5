import { Navigate, createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '../layouts'
import { NotFoundPage } from './NotFoundPage'
import { TodayQuestionPanel } from '../../features/daily-question'
import { HistoryPage } from '../../features/answer-history'
import { OnboardingPage } from '../../features/onboarding'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to='/today' replace /> },
      { path: 'today', element: <TodayQuestionPanel /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
