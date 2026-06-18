import { useState } from 'react'
import Button from './ui/Button'
import Checkbox from './ui/Checkbox'
import SelectField from './ui/SelectField'
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

          <SelectField
            id="learning-goal"
            label="Основная цель"
            value={preferences.goal}
            onChange={(event) => setPreferences({ ...preferences, goal: event.target.value })}
            options={preferenceGoals.map((goal) => ({ label: goal, value: goal }))}
          />

          <>
            <SelectField
              id="learning-interest"
              label="Интересы"
              value=""
              onChange={(event) => addInterest(event.target.value)}
              options={[
                { label: 'Выберите направление', value: '' },
                ...preferenceInterests.map((interest) => ({
                  disabled: preferences.interests.includes(interest),
                  label: interest,
                  value: interest
                }))
              ]}
            />
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
          </>

          <SelectField
            id="learning-level"
            label="Уровень подготовки"
            value={preferences.level}
            onChange={(event) => {
              if (isCourseLevel(event.target.value)) {
                setPreferences({ ...preferences, level: event.target.value })
              }
            }}
            options={preferenceLevels.map((level) => ({ label: level, value: level }))}
          />
        </div>

        <div className="settings-summary">
          <div>
            <h3 className="settings-subtitle">Персонализированные рекомендации</h3>
            <p className="section-subtitle">
              Платформа использует выбранные цели и интересы, чтобы показать стартовую подборку курсов.
            </p>
          </div>
          <Checkbox
            checked={preferences.consent}
            onChange={(event) => setPreferences({ ...preferences, consent: event.target.checked })}
            label="Согласна на использование данных для персонализации"
          />
        </div>

        {error && <p className="preferences-modal__error">{error}</p>}

        <div className="preferences-modal__actions">
          <Button onClick={handleSubmit}>
            Показать рекомендации
          </Button>
        </div>
      </section>
    </div>
  )
}
