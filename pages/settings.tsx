import Header from '../components/Header'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import Chip from '../components/ui/Chip'
import Toast from '../components/ui/Toast'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  defaultPreferences,
  preferenceGoals,
  preferenceInterests,
  preferenceLevels,
  preferencesStorageKey
} from '../lib/data/preferences'
import type { CourseLevel, UserPreferences } from '../lib/types'

const profileStorageKey = 'eduflow.profile'

type UserProfile = {
  name: string
  bio: string
}

export default function Settings(): JSX.Element {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [profile, setProfile] = useState<UserProfile>({ name: '', bio: '' })
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const isOnboarding = !preferences.onboarded
  const selectedInterests = preferences.interests.length > 0 ? preferences.interests : defaultPreferences.interests
  const userEmail = session?.user?.email ?? ''
  const registeredName = session?.user?.name ?? ''

  useEffect(() => {
    const savedPreferences = window.localStorage.getItem(preferencesStorageKey)
    const savedProfile = window.localStorage.getItem(profileStorageKey)

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (registeredName) {
      setProfile((current) => ({ ...current, name: registeredName }))
    }
  }, [registeredName])

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

    setError('')

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nextPreferences)
      })

      if (!response.ok) {
        throw new Error('Preferences request failed')
      }
    } catch {
      setError('Не удалось сохранить настройки. Попробуйте ещё раз.')
      return
    }

    setPreferences(nextPreferences)
    window.localStorage.setItem(preferencesStorageKey, JSON.stringify(nextPreferences))
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile))
    setToast(isOnboarding ? 'Настройки сохранены, рекомендации обновлены' : 'Изменения сохранены')
  }

  return (
    <>
      <Header />
      <main className="page-layout">
        <div className="page-container section">
          <div className="settings-page-header">
            <div>
              <h1 className="section-title section-title--lg">Настройки</h1>
              <p className="section-subtitle section-subtitle--offset">
                {isOnboarding
                  ? 'Управляйте настройками аккаунта и задайте стартовые параметры рекомендаций.'
                  : 'Управляйте настройками аккаунта и предпочтениями.'}
              </p>
            </div>
          </div>

          {toast && (
            <div className="settings-alert">
              <Toast tone="success">{toast}</Toast>
            </div>
          )}

          {error && (
            <div className="settings-alert">
              <Toast tone="error">{error}</Toast>
            </div>
          )}

          <div className="settings-grid">
            <aside className="settings-sidebar" aria-label="Разделы настроек">
              {['Общие', 'Уведомления', 'Оплата', 'Безопасность'].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={`settings-nav-item ${index === 0 ? 'settings-nav-item--active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </aside>

            <div className="settings-content">
              <section className="settings-card">
                <div className="settings-card__header">
                  <h2 className="settings-header">Профиль</h2>
                  <p className="section-subtitle">Так вас будут видеть другие пользователи на сайте.</p>
                </div>

                <div className="settings-row">
                  <Image src="/assets/avatar-profile.svg" alt="Аватар профиля" width={64} height={64} className="profile-avatar" unoptimized />
                  <Button variant="secondary">Изменить аватар</Button>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="profile-name">Имя</label>
                  <input
                    id="profile-name"
                    className="settings-input"
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Введите имя"
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="profile-email">Email</label>
                  <input id="profile-email" className="settings-input settings-input--readonly" value={userEmail} placeholder="Email появится после входа" readOnly aria-readonly="true" />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label" htmlFor="profile-bio">О себе</label>
                  <textarea
                    id="profile-bio"
                    className="settings-input settings-textarea"
                    value={profile.bio}
                    onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
                    placeholder="Расскажите немного о себе"
                  />
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card__header">
                  <h2 className="settings-header">Цели обучения</h2>
                  <p className="section-subtitle">Настройте свои рекомендации.</p>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Основная цель</label>
                  <div className="form-tags" role="group" aria-label="Цель обучения">
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

                <div className="settings-form-group">
                  <label className="settings-label">Интересы</label>
                  <div className="form-tags" role="group" aria-label="Интересы">
                    {preferenceInterests.map((interest) => (
                      <Chip
                        key={interest}
                        active={selectedInterests.includes(interest)}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Уровень подготовки</label>
                  <div className="form-tags" role="group" aria-label="Уровень подготовки">
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

                <section className="settings-personalization" aria-labelledby="personalization-title">
                  <div>
                    <h3 id="personalization-title" className="settings-subtitle">Персонализированные рекомендации</h3>
                    <p className="section-subtitle">Получайте предложения курсов на основе цели, уровня, интересов и действий с карточками.</p>
                  </div>
                  <Checkbox
                    checked={preferences.consent}
                    onChange={(event) => setPreferences((current) => ({ ...current, consent: event.target.checked }))}
                    label="Согласие"
                    aria-label="Согласие на обработку данных для персональных рекомендаций"
                  />
                </section>
              </section>

              <div className="settings-actions">
                <Button onClick={savePreferences} disabled={!preferences.consent || preferences.interests.length === 0}>
                  {isOnboarding ? 'Начать обучение' : 'Сохранить изменения'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
