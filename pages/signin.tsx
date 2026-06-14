import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, type FormEvent } from 'react'
import { createPendingOnboardingValue, pendingOnboardingStorageKey } from '../lib/data/preferences'
import { getRegisteredUser, saveRegisteredUser } from '../lib/data/registeredUsers'
import { getSafeRelativePath } from '../lib/queryParams'
import { writeLocalStorageText } from '../lib/storage'
import { normalizeUserName } from '../lib/userDisplay'

export default function SignIn(): JSX.Element {
  const router = useRouter()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const callbackUrl = getSafeRelativePath(router.query.callbackUrl)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const savedUser = getRegisteredUser(email)
    const normalizedName = normalizeUserName(name)

    const credentials = {
      email,
      password,
      mode: isRegisterMode ? 'register' : 'login',
      name: isRegisterMode ? normalizedName : savedUser?.name,
      callbackUrl,
      redirect: false
    }

    const result = await signIn('credentials', credentials)

    if (result?.error) {
      setError(isRegisterMode ? 'Не удалось зарегистрироваться. Проверьте данные.' : 'Не удалось войти. Проверьте email и пароль.')
      return
    }

    if (isRegisterMode) {
      saveRegisteredUser(email, normalizedName ?? email)
      writeLocalStorageText(pendingOnboardingStorageKey, createPendingOnboardingValue(email))
      router.push('/?onboarding=1')
      return
    }

    router.push(callbackUrl)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signin-title">
        <div className="auth-logo" aria-hidden="true">
          <span>▱</span>
        </div>

        <div className="auth-heading">
          <h1 id="signin-title" className="auth-title">{isRegisterMode ? 'Регистрация' : 'Вход в систему'}</h1>
          <p className="auth-subtitle">
            {isRegisterMode ? 'Создайте аккаунт для персональных рекомендаций' : 'Введите email для входа в аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegisterMode && (
            <div className="auth-field">
              <label htmlFor="signin-name" className="auth-label">Имя</label>
              <input
                id="signin-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                className="auth-input"
                placeholder="Арина"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="signin-email" className="auth-label">Email</label>
            <input
              id="signin-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="auth-input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signin-password" className="auth-label">Пароль</label>
            <input
              id="signin-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="auth-input"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">{isRegisterMode ? 'Зарегистрироваться' : 'Войти'}</button>
        </form>

        <p className="auth-register">
          {isRegisterMode ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
          <button
            type="button"
            onClick={() => {
              setError('')
              setIsRegisterMode((value) => !value)
            }}
          >
            {isRegisterMode ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>
      </section>
    </main>
  )
}
