import Header from '../components/Header'
import CourseGrid from '../components/CourseGrid'
import EmptyState from '../components/EmptyState'
import Chip from '../components/ui/Chip'
import SearchInput from '../components/ui/SearchInput'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import {
  buildCatalogPath,
  normalizeCatalogCategory,
  normalizeCatalogLevel,
  normalizeCatalogSort
} from '../lib/catalogQuery'
import {
  catalogLevels,
  defaultCatalogSort,
  filterCourses,
  sortOptions,
  type CatalogLevel,
  type CatalogSort
} from '../lib/catalogFilters'
import { getCatalogCategoriesFromDatabase, getCoursesFromDatabase } from '../lib/server/courseRepository'
import type { CatalogCategory, Course } from '../lib/types'

type CatalogProps = {
  catalogCategories: CatalogCategory[]
  courses: Course[]
}

export const getServerSideProps: GetServerSideProps<CatalogProps> = async () => {
  const [courses, catalogCategories] = await Promise.all([
    getCoursesFromDatabase(),
    getCatalogCategoriesFromDatabase()
  ])

  return {
    props: {
      catalogCategories,
      courses
    }
  }
}

export default function Catalog({ catalogCategories, courses }: CatalogProps): JSX.Element {
  const router = useRouter()
  const { category, level, q, search, sort, tag } = router.query
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('Все')
  const [activeLevel, setActiveLevel] = useState<CatalogLevel>('Все')
  const [activeSort, setActiveSort] = useState<CatalogSort>(defaultCatalogSort)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    setSearchTerm(
      typeof tag === 'string'
        ? tag
        : typeof q === 'string'
          ? q
          : typeof search === 'string'
            ? search
            : ''
    )
    setActiveCategory(normalizeCatalogCategory(
      typeof category === 'string' ? category : undefined,
      catalogCategories
    ))
    setActiveLevel(normalizeCatalogLevel(typeof level === 'string' ? level : undefined))
    setActiveSort(normalizeCatalogSort(typeof sort === 'string' ? sort : undefined))
  }, [catalogCategories, category, level, q, search, sort, tag])

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

    setActiveCategory(nextCategory)
    setActiveLevel(nextLevel)
    setActiveSort(nextSort)
    setSearchTerm(nextSearch)
    router.push(buildCatalogPath({
      category: nextCategory,
      level: nextLevel,
      search: nextSearch,
      sort: nextSort
    }))
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
              <SearchInput
                id="catalog-search"
                label="Поиск курсов"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск курсов, навыков или преподавателей"
                inputClassName="search-input"
                wrapperClassName="search-form__input"
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
          <h2 className="sr-only">Список курсов</h2>
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
