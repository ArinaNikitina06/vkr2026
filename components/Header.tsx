import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, type FormEvent } from 'react'

export default function Header(): JSX.Element {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchTerm.trim()
    const path = query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog'
    router.push(path)
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__row">
          <div className="navbar__brand">
            <div className="navbar__logo">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="navbar__title">EduFlow</span>
          </div>

          <nav className="navbar__nav">
            <Link href="/" className="navbar__link">
              Главная
            </Link>
            <Link href="/catalog" className="navbar__link">
              Каталог
            </Link>
            <Link href="/my-learning" className="navbar__link">
              Мои курсы
            </Link>
            <Link href="/settings" className="navbar__link">
              Настройки
            </Link>
          </nav>

          <div className="navbar__actions">
            <form onSubmit={handleSearch} className="navbar__search">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Поиск курсов..."
                className="navbar__search-input"
              />
              <button type="submit" className="navbar__search-button" aria-label="Поиск">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <button className="navbar__action" aria-label="Уведомления">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/settings" className="navbar__profile-button">
              А
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
