import Header from '../components/Header'
import { useState, type ChangeEvent } from 'react'

type SettingsSection = 'profile' | 'notifications' | 'billing' | 'security'

type SettingsFormData = {
  avatar: string
  username: string
  bio: string
  goalCareer: string
  interests: string
}

export default function Settings(): JSX.Element {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [formData, setFormData] = useState<SettingsFormData>({
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100',
    username: 'arina_designer',
    bio: 'Продуктовый дизайлер из Сан-Франциско. Научаю React и Next.js.',
    goalCareer: 'Смена карьеры',
    interests: 'Дизайн, Разработка, UX'
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  return (
    <>
      <Header />
      <main className="page-layout">
        <div className="page-container">
          <h1 className="section-title mb-8">Настройки</h1>

          <div className="settings-grid">
            <aside className="sidebar">
              <nav className="sidebar-nav">
                {([
                  { id: 'profile', label: 'Профиль' },
                  { id: 'notifications', label: 'Уведомления' },
                  { id: 'billing', label: 'Оплата' },
                  { id: 'security', label: 'Безопасность' }
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`sidebar-item ${
                      activeSection === item.id ? 'sidebar-item--active' : 'sidebar-item--inactive'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="lg:col-span-3">
              {activeSection === 'profile' && (
                <section className="settings-card">
                  <h2 className="section-title text-2xl mb-8">Профиль</h2>

                  <div className="settings-section">
                    <h3 className="settings-header">Профиль</h3>

                    <div className="settings-row">
                      <img src={formData.avatar} alt="Avatar" className="profile-avatar" />
                      <button className="profile-button" type="button">
                        Изменить аватар
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Имя пользователя</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="settings-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-900 mb-2">О себе</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="settings-input"
                      />
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3 className="settings-header">Цели обучения</h3>
                    <p className="section-subtitle mb-4">Настройте свои рекомендации.</p>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Основная цель</label>
                      <select
                        value={formData.goalCareer}
                        onChange={(e) => setFormData({ ...formData, goalCareer: e.target.value })}
                        className="settings-input"
                      >
                        <option>Смена карьеры</option>
                        <option>Улучшение навыков</option>
                        <option>Хобби</option>
                        <option>Сертификация</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Интересы</label>
                      <div className="form-tags">
                        {['Дизайн', 'Разработка', 'UX', 'Добавить'].map((tag) => (
                          <span key={tag} className="profile-tag">
                            {tag} {tag !== 'Добавить' && '×'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="settings-summary">
                    <div>
                      <h3 className="text-md font-semibold text-gray-900">Персонализированные рекомендации</h3>
                      <p className="text-gray-600 text-sm">Получайте предложения курсов на основе вашей активности.</p>
                    </div>
                    <div className="toggle">
                      <div className="toggle-handle"></div>
                    </div>
                  </div>

                  <button className="settings-button mt-8" type="button">
                    Сохранить изменения
                  </button>
                </section>
              )}

              {activeSection === 'notifications' && (
                <section className="settings-card">
                  <h2 className="section-title text-2xl mb-8">Уведомления</h2>
                  <p className="section-subtitle">Пока здесь нет настроек уведомлений.</p>
                </section>
              )}

              {activeSection === 'billing' && (
                <section className="settings-card">
                  <h2 className="section-title text-2xl mb-8">Оплата</h2>
                  <p className="section-subtitle">Пока здесь нет информации об оплате.</p>
                </section>
              )}

              {activeSection === 'security' && (
                <section className="settings-card">
                  <h2 className="section-title text-2xl mb-8">Безопасность</h2>
                  <p className="section-subtitle">Пока здесь нет параметров безопасности.</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
