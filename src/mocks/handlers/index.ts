import { answerHandlers } from './answerHandlers'
import { questionHandlers } from './questionHandlers'
import { sessionHandlers } from './sessionHandlers'
import { onboardingHandlers } from './onboardingHandlers'

export const handlers = [
  ...sessionHandlers,
  ...questionHandlers,
  ...answerHandlers,
  ...onboardingHandlers,
]
