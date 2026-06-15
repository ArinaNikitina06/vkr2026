import { useState } from 'react'
import {
  defaultPreferences,
  preferenceGoals,
  preferenceInterests,
  preferenceLevels
} from '../lib/data/preferences'
import { isCourseLevel } from '../lib/types'
import type { UserPreferences } from '../lib/types'

type PreferencesModalProps = {
  onSave: (preferences: UserPreferences) => void
}

export default function PreferencesModal({ onSave }: PreferencesModalProps): JSX.Element {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [error, setError] = useState('')

  const addInterest = (interest: string) => {
    if (!interest) {
      return
    }

    setPreferences((currentPreferences) => {
      if (currentPreferences.interests.includes(interest)) {
        return currentPreferences
      }

      return {
        ...currentPreferences,
        interests: [...currentPreferences.interests, interest]
      }
    })
  }

  const removeInterest = (interest: string) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      interests: currentPreferences.interests.filter((item) => item !== interest)
    }))
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
          <h2 id="preferences-modal-title" className="preferences-modal__title">
            Цели обучения
          </h2>
          <p className="preferences-modal__subtitle">Настройте свои рекомендации.</p>

          <div className="form-group">
            <label className="settings-label" htmlFor="learning-goal">
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
            <label className="settings-label" htmlFor="learning-interest">
              Интересы
            </label>
            <select
              id="learning-interest"
              value=""
              onChange={(event) => addInterest(event.target.value)}
              className="settings-input"
            >
              <option value="">Выберите направление</option>
              {preferenceInterests.map((interest) => (
                <option key={interest} value={interest} disabled={preferences.interests.includes(interest)}>
                  {interest}
                </option>
              ))}
            </select>
            {preferences.interests.length > 0 && (
              <div className="preferences-modal__selected-interests" aria-label="Выбранные интересы">
                {preferences.interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className="preferences-modal__selected-interest"
                    onClick={() => removeInterest(interest)}
                    aria-label={`Убрать интерес ${interest}`}
                  >
                    {interest}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="settings-label" htmlFor="learning-level">
              Уровень подготовки
            </label>
            <select
              id="learning-level"
              value={preferences.level}
              onChange={(event) => {
                if (isCourseLevel(event.target.value)) {
                  setPreferences({ ...preferences, level: event.target.value })
                }
              }}
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
            <h3 className="settings-subtitle">Персонализированные рекомендации</h3>
            <p className="section-subtitle">
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
