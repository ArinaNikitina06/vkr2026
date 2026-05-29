import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import { catalogCategories, courses, type CatalogCategory } from '../lib/data/courses'

export default function Catalog(): JSX.Element {
  const router = useRouter()
  const { search } = router.query
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('Все')
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (typeof search === 'string') {
      setSearchTerm(search)
    }
  }, [search])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchTerm.trim()
    const path = query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog'
    router.push(path)
  }

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'Все' ? true : course.category === activeCategory.toUpperCase()
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !query ||
      [course.title, course.description, course.category, ...(course.tags || [])]
        .some((value) => value.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
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
              <input
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

          <div className="filter-buttons">
            {catalogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`filter-button ${
                  activeCategory === category ? 'filter-button--active' : 'filter-button--inactive'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="page-container section">
          <div className="grid-cards">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} href={`/course/${course.id}`} {...course} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
