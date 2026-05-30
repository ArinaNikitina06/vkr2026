import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/EmptyState'
import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import { catalogCategories, courses, type CatalogCategory } from '../lib/data/courses'
import type { CourseLevel } from '../lib/types'

type CatalogLevel = 'Все' | CourseLevel

const catalogLevels: CatalogLevel[] = ['Все', 'Начальный', 'Средний', 'Продвинутый']

export default function Catalog(): JSX.Element {
  const router = useRouter()
  const { category, level, search, tag } = router.query
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('Все')
  const [activeLevel, setActiveLevel] = useState<CatalogLevel>('Все')
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (typeof search === 'string') {
      setSearchTerm(search)
    }

    if (typeof tag === 'string') {
      setSearchTerm(tag)
    }

    if (typeof category === 'string') {
      const normalizedCategory = catalogCategories.find((item) => (
        item.toLowerCase() === category.toLowerCase() ||
        item.toUpperCase() === category.toUpperCase()
      ))

      setActiveCategory(normalizedCategory ?? 'Все')
    }

    if (typeof level === 'string') {
      const normalizedLevel = catalogLevels.find((item) => item.toLowerCase() === level.toLowerCase())

      setActiveLevel(normalizedLevel ?? 'Все')
    }
  }, [category, level, search, tag])

  const updateFilters = (nextFilters: {
    category?: CatalogCategory
    level?: CatalogLevel
    search?: string
  }) => {
    const nextCategory = nextFilters.category ?? activeCategory
    const nextLevel = nextFilters.level ?? activeLevel
    const nextSearch = nextFilters.search ?? searchTerm
    const params = new URLSearchParams()

    setActiveCategory(nextCategory)
    setActiveLevel(nextLevel)
    setSearchTerm(nextSearch)

    if (nextSearch.trim()) {
      params.set('search', nextSearch.trim())
    }

    if (nextCategory !== 'Все') {
      params.set('category', nextCategory)
    }

    if (nextLevel !== 'Все') {
      params.set('level', nextLevel)
    }

    const query = params.toString()
    router.push(query ? `/catalog?${query}` : '/catalog')
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateFilters({ search: searchTerm })
  }

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'Все' ? true : course.category === activeCategory.toUpperCase()
    const matchesLevel = activeLevel === 'Все' ? true : course.level === activeLevel
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !query ||
      [course.title, course.description, course.category, ...(course.tags || [])]
        .some((value) => value.toLowerCase().includes(query))

    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section">
          <h1 className="section-title section-title--lg mb-4">Каталог курсов</h1>
          <p className="section-subtitle section-subtitle--large">Изучите более 200+ курсов по дизайну, разработке и бизнесу.</p>
        </section>

        <section className="page-container section section--compact">
          <div className="search-panel">
            <form onSubmit={handleSearch} className="search-form">
              <label className="sr-only" htmlFor="catalog-search">Поиск курсов</label>
              <input
                id="catalog-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Поиск курсов, навыков или преподавателей"
                className="search-input"
              />
              <button type="submit" className="search-button" aria-label="Поиск">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <div className="filter-buttons" role="group" aria-label="Фильтр по категории">
            {catalogCategories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => updateFilters({ category })}
                aria-pressed={activeCategory === category}
                className={`filter-button ${
                  activeCategory === category ? 'filter-button--active' : 'filter-button--inactive'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="filter-buttons mt-4" role="group" aria-label="Фильтр по уровню">
            {catalogLevels.map((levelItem) => (
              <button
                type="button"
                key={levelItem}
                onClick={() => updateFilters({ level: levelItem })}
                aria-pressed={activeLevel === levelItem}
                className={`filter-button ${
                  activeLevel === levelItem ? 'filter-button--active' : 'filter-button--inactive'
                }`}
              >
                {levelItem}
              </button>
            ))}
          </div>
        </section>

        <section className="page-container section">
          {filteredCourses.length > 0 ? (
            <div className="grid-cards">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} href={`/course/${course.id}`} {...course} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Курсы не найдены"
              description="Попробуйте изменить запрос или сбросить фильтры."
              action={<Link href="/catalog" className="button button--secondary">Сбросить фильтры</Link>}
            />
          )}
        </section>
      </main>
    </>
  )
}
