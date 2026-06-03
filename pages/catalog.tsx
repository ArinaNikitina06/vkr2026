import Header from '../components/Header'
import CourseGrid from '../components/CourseGrid'
import EmptyState from '../components/EmptyState'
import Chip from '../components/ui/Chip'
import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import { catalogCategories, courses, type CatalogCategory } from '../lib/data/courses'
import {
  catalogLevels,
  defaultCatalogSort,
  filterCourses,
  sortOptions,
  type CatalogLevel,
  type CatalogSort
} from '../lib/catalogFilters'

export default function Catalog(): JSX.Element {
  const router = useRouter()
  const { category, level, q, search, sort, tag } = router.query
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('Все')
  const [activeLevel, setActiveLevel] = useState<CatalogLevel>('Все')
  const [activeSort, setActiveSort] = useState<CatalogSort>(defaultCatalogSort)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (typeof q === 'string') {
      setSearchTerm(q)
    } else if (typeof search === 'string') {
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

    if (typeof sort === 'string') {
      const normalizedSort = sortOptions.find((item) => item.value === sort)

      setActiveSort(normalizedSort?.value ?? defaultCatalogSort)
    }
  }, [category, level, q, search, sort, tag])

  const updateFilters = (nextFilters: {
    category?: CatalogCategory
    level?: CatalogLevel
    sort?: CatalogSort
    search?: string
  }) => {
    const nextCategory = nextFilters.category ?? activeCategory
    const nextLevel = nextFilters.level ?? activeLevel
    const nextSort = nextFilters.sort ?? activeSort
    const nextSearch = nextFilters.search ?? searchTerm
    const params = new URLSearchParams()

    setActiveCategory(nextCategory)
    setActiveLevel(nextLevel)
    setActiveSort(nextSort)
    setSearchTerm(nextSearch)

    if (nextSearch.trim()) {
      params.set('q', nextSearch.trim())
    }

    if (nextCategory !== 'Все') {
      params.set('category', nextCategory)
    }

    if (nextLevel !== 'Все') {
      params.set('level', nextLevel)
    }

    if (nextSort !== defaultCatalogSort) {
      params.set('sort', nextSort)
    }

    const query = params.toString()
    router.push(query ? `/catalog?${query}` : '/catalog')
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateFilters({ search: searchTerm })
  }

  const filteredCourses = filterCourses({
    courses,
    category: activeCategory,
    level: activeLevel,
    search: searchTerm,
    sort: activeSort
  })

  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section">
          <h1 className="section-title section-title--lg section-title--with-subtitle">Каталог курсов</h1>
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
                <svg className="search-button__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <div className="filter-buttons" role="group" aria-label="Фильтр по категории">
            {catalogCategories.map((category) => (
              <Chip
                key={category}
                onClick={() => updateFilters({ category })}
                active={activeCategory === category}
              >
                {category}
              </Chip>
            ))}
          </div>

          <div className="filter-buttons filter-buttons--spaced" role="group" aria-label="Фильтр по уровню">
            {catalogLevels.map((levelItem) => (
              <Chip
                key={levelItem}
                onClick={() => updateFilters({ level: levelItem })}
                active={activeLevel === levelItem}
              >
                {levelItem}
              </Chip>
            ))}
          </div>

          <div className="catalog-sort">
            <label htmlFor="catalog-sort" className="catalog-sort__label">Сортировка</label>
            <select
              id="catalog-sort"
              value={activeSort}
              onChange={(event) => updateFilters({ sort: event.target.value as CatalogSort })}
              className="catalog-sort__select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="page-container section">
          {filteredCourses.length > 0 ? (
            <CourseGrid courses={filteredCourses} />
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
