import Header from '../components/Header'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import Chip from '../components/ui/Chip'
import Toast from '../components/ui/Toast'
import { useEffect, useState } from 'react'
import {
  defaultPreferences,
  preferenceGoals,
  preferenceInterests,
  preferenceLevels,
  preferencesStorageKey
} from '../lib/data/preferences'
import type { CourseLevel, UserPreferences } from '../lib/types'

export default function Settings(): JSX.Element {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [toast, setToast] = useState('')
  const isOnboarding = !preferences.onboarded

  useEffect(() => {
    const savedPreferences = window.localStorage.getItem(preferencesStorageKey)

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const toggleInterest = (interest: string) => {
    setPreferences((current) => {
      const exists = current.interests.includes(interest)
      const interests = exists
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]

      return {
        ...current,
        interests
      }
    })
  }

  const savePreferences = async () => {
    const nextPreferences = {
      ...preferences,
      onboarded: true
    }

    await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nextPreferences)
    })

    setPreferences(nextPreferences)
    window.localStorage.setItem(preferencesStorageKey, JSON.stringify(nextPreferences))
    setToast(isOnboarding ? 'Настройки сохранены, рекомендации обновлены' : 'Изменения сохранены')
  }

  return (
    <>
      <Header />
      <main className="page-layout">
        <div className="page-container section">
          <div className="section-heading">
            <div>
              <h1 className="section-title section-title--lg">
                {isOnboarding ? 'Настройка рекомендаций' : 'Настройки персонализации'}
              </h1>
              <p className="section-subtitle mt-2">
                {isOnboarding
                  ? 'Выберите цель, интересы и уровень, чтобы получить стартовую подборку курсов.'
                  : 'Здесь можно изменить цель и темы, которые влияют на персональную ленту.'}
              </p>
            </div>
          </div>

          {toast && (
            <div className="mb-6">
              <Toast tone="success">{toast}</Toast>
            </div>
          )}

          <section className="settings-card">
            <div className="settings-section">
              <h2 className="settings-header">Цель обучения</h2>
              <div className="form-tags">
                {preferenceGoals.map((goal) => (
                  <Chip
                    key={goal}
                    active={preferences.goal === goal}
                    onClick={() => setPreferences((current) => ({ ...current, goal }))}
                  >
                    {goal}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h2 className="settings-header">Интересы</h2>
              <p className="section-subtitle mb-4">По этим темам формируются блоки “Для вас” и “На основе интересов”.</p>
              <div className="form-tags">
                {preferenceInterests.map((interest) => (
                  <Chip
                    key={interest}
                    active={preferences.interests.includes(interest)}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h2 className="settings-header">Уровень подготовки</h2>
              <div className="form-tags">
                {preferenceLevels.map((level) => (
                  <Chip
                    key={level}
                    active={preferences.level === level}
                    onClick={() => setPreferences((current) => ({ ...current, level: level as CourseLevel }))}
                  >
                    {level}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h2 className="settings-header">Как используются данные</h2>
              <p className="section-subtitle">
                Прототип учитывает выбранную цель, интересы, уровень и действия с карточками: лайк, скрытие и добавление в избранное. Эти данные нужны только для настройки учебной ленты.
              </p>
            </div>

            <div className="settings-summary">
              <Checkbox
                checked={preferences.consent}
                onChange={(event) => setPreferences((current) => ({ ...current, consent: event.target.checked }))}
                label="Я согласна на обработку данных для персональных рекомендаций"
                helperText="Согласие требуется для сценария холодного старта и соответствует FR-8."
              />
            </div>

            <div className="mt-8">
              <Button onClick={savePreferences} disabled={!preferences.consent || preferences.interests.length === 0}>
                {isOnboarding ? 'Начать обучение' : 'Сохранить изменения'}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
