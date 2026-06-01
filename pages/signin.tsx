import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, type FormEvent } from 'react'

function getQueryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '/' : value ?? '/'
}

export default function SignIn(): JSX.Element {
  const router = useRouter()
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const callbackUrl = getQueryValue(router.query.callbackUrl)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      name: isRegisterMode ? name : undefined,
      callbackUrl,
      redirect: false
    })

    if (result?.error) {
      setError(isRegisterMode ? 'Не удалось зарегистрироваться. Проверьте данные.' : 'Не удалось войти. Проверьте email и пароль.')
      return
    }

    router.push(result?.url ?? callbackUrl)
  }

  const handleDemoSignIn = async () => {
    const result = await signIn('credentials', {
      email: email || 'demo@vkr.local',
      password: password || 'demo',
      name: 'Demo user',
      callbackUrl,
      redirect: false
    })

    router.push(result?.url ?? callbackUrl)
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

        <div className="auth-divider">
          <span></span>
          <p>или продолжить с</p>
          <span></span>
        </div>

        <button type="button" className="auth-social" onClick={handleDemoSignIn}>
          <span aria-hidden="true">⌘</span>
          GitHub
        </button>

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
