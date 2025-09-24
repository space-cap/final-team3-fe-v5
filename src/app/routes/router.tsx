import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '../layouts'
import { NotFoundPage } from './NotFoundPage'
import { TodayQuestionPanel } from '../../features/daily-question'
import { HistoryPage } from '../../features/answer-history'
import { OnboardingPage } from '../../features/onboarding'
import {
  onboardingOnlyLoader,
  redirectToTodayLoader,
  requireOnboardingCompleteLoader,
  rootLoader,
} from './loaders'

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <RootLayout />,
    loader: rootLoader,
    children: [
      { index: true, loader: redirectToTodayLoader },
      { path: 'today', element: <TodayQuestionPanel />, loader: requireOnboardingCompleteLoader },
      { path: 'history', element: <HistoryPage />, loader: requireOnboardingCompleteLoader },
      { path: 'onboarding', element: <OnboardingPage />, loader: onboardingOnlyLoader },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
