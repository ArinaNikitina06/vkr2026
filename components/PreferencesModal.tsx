import { useState } from 'react'
import {
  defaultPreferences,
  preferenceGoals,
  preferenceInterests,
  preferenceLevels
} from '../lib/data/preferences'
import type { CourseLevel, UserPreferences } from '../lib/types'

type PreferencesModalProps = {
  onSave: (preferences: UserPreferences) => void
}

export default function PreferencesModal({ onSave }: PreferencesModalProps): JSX.Element {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [error, setError] = useState('')

  const toggleInterest = (interest: string) => {
    setPreferences((currentPreferences) => {
      const interests = currentPreferences.interests.includes(interest)
        ? currentPreferences.interests.filter((item) => item !== interest)
        : [...currentPreferences.interests, interest]

      return {
        ...currentPreferences,
        interests
      }
    })
  }

  const handleSubmit = () => {
    if (preferences.interests.length === 0) {
      setError('Выберите хотя бы одно направление, чтобы сформировать рекомендации.')
      return
    }

    if (!preferences.consent) {
      setError('Подтвердите согласие на использование данных для персонализации.')
      return
    }

    onSave({
      ...preferences,
      onboarded: true
    })
  }

  return (
    <div className="preferences-modal" role="dialog" aria-modal="true" aria-labelledby="preferences-modal-title">
      <div className="preferences-modal__backdrop" />
      <section className="preferences-modal__panel">
        <div className="settings-section">
          <h2 id="preferences-modal-title" className="section-title text-2xl mb-2">
            Цели обучения
          </h2>
          <p className="section-subtitle mb-6">Настройте свои рекомендации.</p>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-900 mb-2" htmlFor="learning-goal">
              Основная цель
            </label>
            <select
              id="learning-goal"
              value={preferences.goal}
              onChange={(event) => setPreferences({ ...preferences, goal: event.target.value })}
              className="settings-input"
            >
              {preferenceGoals.map((goal) => (
                <option key={goal}>{goal}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <span className="block text-sm font-medium text-gray-900 mb-2">Интересы</span>
            <div className="form-tags">
              {preferenceInterests.map((interest) => {
                const isSelected = preferences.interests.includes(interest)

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`filter-button ${isSelected ? 'filter-button--active' : 'filter-button--inactive'}`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-900 mb-2" htmlFor="learning-level">
              Уровень подготовки
            </label>
            <select
              id="learning-level"
              value={preferences.level}
              onChange={(event) => setPreferences({ ...preferences, level: event.target.value as CourseLevel })}
              className="settings-input"
            >
              {preferenceLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="settings-summary">
          <div>
            <h3 className="text-md font-semibold text-gray-900">Персонализированные рекомендации</h3>
            <p className="text-gray-600 text-sm">
              Платформа использует выбранные цели и интересы, чтобы показать стартовую подборку курсов.
            </p>
          </div>
          <label className="preferences-modal__consent">
            <input
              type="checkbox"
              checked={preferences.consent}
              onChange={(event) => setPreferences({ ...preferences, consent: event.target.checked })}
            />
            <span>Согласна на использование данных для персонализации</span>
          </label>
        </div>

        {error && <p className="preferences-modal__error">{error}</p>}

        <div className="preferences-modal__actions">
          <button className="settings-button" type="button" onClick={handleSubmit}>
            Показать рекомендации
          </button>
        </div>
      </section>
    </div>
  )
}
