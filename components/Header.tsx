import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useState, type FormEvent } from 'react'

export default function Header(): JSX.Element {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const isAuthenticated = status === 'authenticated'
  const userInitial = session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? 'А'
  const protectedHref = (href: string) => (
    isAuthenticated ? href : `/signin?callbackUrl=${encodeURIComponent(href)}`
  )

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchTerm.trim()
    const path = query ? `/catalog?q=${encodeURIComponent(query)}` : '/catalog'
    router.push(protectedHref(path))
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__row">
          <div className="site-header__brand">
            <div className="site-header__logo">
              <span className="site-header__logo-text">E</span>
            </div>
            <span className="site-header__title">EduFlow</span>
          </div>

          <nav className="site-header__nav">
            <Link href="/" className="site-header__link">
              Главная
            </Link>
            <Link href={protectedHref('/catalog')} className="site-header__link">
              Каталог
            </Link>
            <Link href={protectedHref('/my-learning')} className="site-header__link">
              Мои курсы
            </Link>
            <Link href={protectedHref('/settings')} className="site-header__link">
              Настройки
            </Link>
          </nav>

          <div className="site-header__actions">
            <form onSubmit={handleSearch} className="site-header__search">
              <label className="sr-only" htmlFor="header-search">Поиск курсов</label>
              <input
                id="header-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Поиск курсов..."
                className="site-header__search-input"
              />
              <button type="submit" className="site-header__search-button" aria-label="Поиск">
                <svg className="site-header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <button className="site-header__action" aria-label="Уведомления">
              <svg className="site-header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="site-header__notification-dot" aria-hidden="true"></span>
            </button>
            {isAuthenticated ? (
              <div className="site-header__auth">
                <Link href="/settings" className="site-header__profile-button" aria-label="Открыть настройки профиля">
                  {userInitial.toUpperCase()}
                </Link>
                <span className="site-header__user">{session.user?.name ?? session.user?.email}</span>
                <button
                  type="button"
                  className="site-header__auth-button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link href="/signin" className="site-header__auth-button site-header__auth-button--primary">
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
