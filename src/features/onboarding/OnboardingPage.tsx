import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSessionStore } from '../../app/store'
import { useCompleteOnboardingStep } from './api/useOnboardingActions'
import { useOnboardingStatus } from './api/useOnboardingStatus'

const interestOptions = ['마음돌봄', '관계', '커리어', '습관', '감정관리']
const moodOptions = ['평온해요', '기쁨이 가득해요', '조금 지쳤어요', '상큼하게 시작하고 싶어요']
const channelOptions = [
  { id: 'email', label: '이메일' },
  { id: 'push', label: '푸시 알림' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useOnboardingStatus()
  const completeStepMutation = useCompleteOnboardingStep()

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['마음돌봄'])
  const [selectedMood, setSelectedMood] = useState<string>('평온해요')
  const [reminderTime, setReminderTime] = useState<string>('07:00')
  const [reminderChannel, setReminderChannel] = useState<'email' | 'push'>('email')
  const [initialReflection, setInitialReflection] = useState<string>('')
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({})

  const allCompleted = useMemo(() => data?.steps.every((step) => step.completed) ?? false, [data])
  const isSubmitting = completeStepMutation.isPending

  const updateFormError = (stepId: string, message: string | null) => {
    setFormErrors((prev) => ({ ...prev, [stepId]: message }))
  }

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest],
    )
  }

  const handleStepComplete = (stepId: string, payload: Record<string, unknown>) => {
    updateFormError(stepId, null)

    completeStepMutation.mutate(
      { stepId, data: payload },
      {
        onSuccess: (status) => {
          if (status.steps.every((step) => step.completed)) {
            const store = useSessionStore.getState()
            store.setSession({
              userId: store.userId,
              displayName: store.displayName,
              isAuthenticated: store.isAuthenticated,
              onboardingCompleted: true,
            })
            navigate('/today', { replace: true })
          }
          if (stepId === 'step-3') {
            setInitialReflection('')
          }
        },
        onError: () => {
          updateFormError(stepId, '단계를 완료하는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <section className='space-y-6 rounded-xl bg-surface-contrast p-6 shadow-card'>
        <header className='space-y-2'>
          <div className='h-5 w-28 animate-pulse rounded-full bg-surface-muted' />
          <div className='h-4 w-64 animate-pulse rounded-full bg-surface-muted' />
        </header>
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='h-12 animate-pulse rounded-xl bg-surface-muted' />
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className='space-y-4 rounded-xl bg-surface-contrast p-6 text-sm text-muted shadow-card'>
        <p>온보딩 정보를 불러오는 데 문제가 발생했어요.</p>
        <button
          type='button'
          onClick={() => refetch()}
          className='rounded-full border border-divider px-4 py-2 text-muted transition hover:border-primary hover:text-primary'
        >
          다시 시도
        </button>
      </section>
    )
  }

  const renderStepContent = (stepId: string, completed: boolean) => {
    if (completed) {
      return null
    }

    switch (stepId) {
      case 'step-1':
        return (
          <form
            className='space-y-3'
            onSubmit={(event) => {
              event.preventDefault()
              if (selectedInterests.length === 0) {
                updateFormError(stepId, '관심사를 최소 1개 이상 선택해 주세요.')
                return
              }
              handleStepComplete(stepId, { interests: selectedInterests, mood: selectedMood })
            }}
          >
            <div>
              <p className='text-xs font-semibold text-muted'>요즘 집중하고 싶은 관심사를 골라 주세요.</p>
              <div className='mt-2 flex flex-wrap gap-2'>
                {interestOptions.map((interest) => {
                  const isSelected = selectedInterests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type='button'
                      onClick={() => handleToggleInterest(interest)}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-card'
                          : 'border border-divider text-muted hover:border-primary hover:text-primary'
                      }`}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label htmlFor='mood' className='mb-1 block text-xs font-semibold text-muted'>
                오늘의 기분을 선택해 주세요.
              </label>
              <select
                id='mood'
                value={selectedMood}
                onChange={(event) => setSelectedMood(event.target.value)}
                className='w-full rounded-xl border border-divider bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40'
              >
                {moodOptions.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>

            {formErrors[stepId] ? <p className='text-xs text-red-500'>{formErrors[stepId]}</p> : null}

            <button
              type='submit'
              disabled={isSubmitting}
              className='rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
            >
              관심사 설정 완료
            </button>
          </form>
        )
      case 'step-2':
        return (
          <form
            data-testid='onboarding-step-2-form'
            className='space-y-3'
            onSubmit={(event) => {
              event.preventDefault()
              if (!reminderTime) {
                updateFormError(stepId, '알림 받을 시간을 입력해 주세요.')
                return
              }
              handleStepComplete(stepId, { reminderTime, reminderChannel })
            }}
          >
            <div className='flex flex-col gap-2 sm:flex-row'>
              <label className='flex flex-1 flex-col text-xs font-semibold text-muted'>
                알림 시간
                <input
                  type='time'
                  data-testid='reminder-time-input'
                  value={reminderTime}
                  onChange={(event) => setReminderTime(event.target.value)}
                  className='mt-1 rounded-xl border border-divider bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40'
                />
              </label>
              <div className='flex flex-1 flex-col text-xs font-semibold text-muted'>
                알림 채널
                <div className='mt-1 flex gap-2'>
                  {channelOptions.map((channel) => (
                    <button
                      data-testid={`channel-option-${channel.id}`}
                      key={channel.id}
                      type='button'
                      onClick={() => setReminderChannel(channel.id as 'email' | 'push')}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        reminderChannel === channel.id
                          ? 'bg-primary text-primary-foreground shadow-card'
                          : 'border border-divider text-muted hover:border-primary hover:text-primary'
                      }`}
                    >
                      {channel.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {formErrors[stepId] ? <p className='text-xs text-red-500'>{formErrors[stepId]}</p> : null}

            <button
              type='submit'
              data-testid='submit-step-2'
              disabled={isSubmitting}
              className='rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
            >
              알림 설정 완료
            </button>
          </form>
        )
      case 'step-3':
        return (
          <form
            data-testid='onboarding-step-3-form'
            className='space-y-3'
            onSubmit={(event) => {
              event.preventDefault()
              if (initialReflection.trim().length < 20) {
                updateFormError(stepId, '20자 이상으로 첫 답변을 작성해 주세요.')
                return
              }
              handleStepComplete(stepId, { reflection: initialReflection.trim() })
            }}
          >
            <label htmlFor='first-reflection' className='text-xs font-semibold text-muted'>
              지금 떠오르는 마음가짐을 적어 주세요.
            </label>
            <textarea
              id='first-reflection'
              data-testid='first-reflection-input'
              value={initialReflection}
              onChange={(event) => setInitialReflection(event.target.value)}
              placeholder='오늘의 질문에 대한 생각을 자유롭게 적어보세요.'
              className='min-h-[160px] w-full resize-none rounded-xl border border-divider bg-surface px-4 py-3 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40'
            />

            <div className='flex items-center justify-between text-xs text-muted'>
              <span>{initialReflection.trim().length}자</span>
              {formErrors[stepId] ? <p className='text-xs text-red-500'>{formErrors[stepId]}</p> : null}
            </div>

            <button
              type='submit'
              data-testid='submit-step-3'
              disabled={isSubmitting}
              className='rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
            >
              첫 답변 저장
            </button>
          </form>
        )
      default:
        return null
    }
  }

  return (
    <section className='space-y-6 rounded-xl bg-surface-contrast p-6 shadow-card'>
      <header className='space-y-2'>
        <h2 className='text-xl font-semibold text-foreground'>시작하기</h2>
        <p className='text-sm text-muted'>
          온보딩 과정을 통해 목표를 설정하고, 알림을 받아 꾸준히 작성할 준비를 마쳐보세요.
        </p>
      </header>
      <ol className='space-y-4 text-sm text-muted'>
        {data.steps.map((step, index) => (
          <li key={step.id} className='flex flex-col gap-3 rounded-xl border border-divider bg-surface px-4 py-3'>
            <div className='flex items-start gap-4'>
              <span className='mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-muted'>
                {index + 1}
              </span>
              <div className='flex-1 space-y-1'>
                <div>
                  <p className='text-sm font-semibold text-foreground'>{step.title}</p>
                  <p className='text-xs leading-relaxed text-muted'>{step.description}</p>
                </div>
                {step.completed ? (
                  <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                    완료됨
                  </span>
                ) : null}
              </div>
            </div>

            {step.completed && step.summary ? (
              <p className='rounded-xl bg-surface-muted px-4 py-2 text-xs text-primary'>{step.summary}</p>
            ) : null}

            {renderStepContent(step.id, step.completed)}
          </li>
        ))}
      </ol>

      {data.nextReminderAt ? (
        <p className='rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-xs text-primary'>
          다음 알림 예정 시각: {new Date(data.nextReminderAt).toLocaleString('ko-KR')}
        </p>
      ) : null}

      {allCompleted ? (
        <div className='rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary'>
          모든 온보딩 단계가 완료되었습니다. 이제 오늘의 질문으로 이동해보세요.
        </div>
      ) : null}

      {completeStepMutation.isError && !isSubmitting ? (
        <p className='text-xs text-red-500'>단계 완료 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.</p>
      ) : null}
    </section>
  )
}
