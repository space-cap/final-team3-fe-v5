import { answerHandlers } from './answerHandlers'
import { questionHandlers } from './questionHandlers'
import { sessionHandlers } from './sessionHandlers'
import { onboardingHandlers } from './onboardingHandlers'
import { testingHandlers } from '../testing/testingHandlers'

export const handlers = [
  ...sessionHandlers,
  ...questionHandlers,
  ...answerHandlers,
  ...onboardingHandlers,
  ...testingHandlers,
]
