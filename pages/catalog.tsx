import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'

type Course = {
  id: string
  image: string
  category: string
  title: string
  description: string
  tags: string[]
  duration: string
  students: number
}

type CatalogCategory = 'Все' | 'Разработка' | 'Дизайн' | 'Бизнес' | 'Маркетинг' | 'Данные'

const allCourses: Course[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'ДИЗАЙН',
    title: 'Основы UI дизайна',
    description: 'Освойте принципы дизайна интерфейсов, теорию цвета и типографику.',
    tags: ['Дизайн', 'Начальный'],
    duration: '4ч 20м',
    students: 1200
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'РАЗРАБОТКА',
    title: 'Fullstack Next.js 14',
    description: 'Создавайте масштабируемые приложения с новейшими возможностями Next.js.',
    tags: ['Разработка', 'Продвинутый'],
    duration: '8ч 15м',
    students: 2300
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'БИЗНЕС',
    title: 'Продакт-менеджмент',
    description: 'Научитесь управлять продуктовыми командами и определять стратегию.',
    tags: ['Бизнес', 'Средний'],
    duration: '6ч 00м',
    students: 1500
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'ДАННЫЕ',
    title: 'Data Science с Python',
    description: 'Анализируйте данные и создавайте визуализации с помощью Pandas.',
    tags: ['Данные', 'Начальный'],
    duration: '12ч 45м',
    students: 2100
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'РАЗРАБОТКА',
    title: 'JavaScript для начинающих',
    description: 'Изучите основы программирования на JavaScript с нуля.',
    tags: ['Разработка', 'Начальный'],
    duration: '10ч 30м',
    students: 3100
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'ДИЗАЙН',
    title: 'Брендинг и айдентика',
    description: 'Создавайте запоминающиеся бренды и визуальные системы.',
    tags: ['Дизайн', 'Продвинутый'],
    duration: '5ч 45м',
    students: 890
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'МАРКЕТИНГ',
    title: 'Цифровой маркетинг',
    description: 'Освойте SEO, контент-маркетинг и социальные сети.',
    tags: ['Маркетинг', 'Средний'],
    duration: '7ч 20м',
    students: 1340
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'БИЗНЕС',
    title: 'Финансовая грамотность',
    description: 'Управляйте личными финансами и инвестициями эффективно.',
    tags: ['Бизнес', 'Начальный'],
    duration: '9ч 10м',
    students: 2450
  }
]

const categories: CatalogCategory[] = ['Все', 'Разработка', 'Дизайн', 'Бизнес', 'Маркетинг', 'Данные']

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

  const filteredCourses = allCourses.filter((course) => {
    const matchesCategory = activeCategory === 'Все' ? true : course.category.includes(activeCategory.toUpperCase())
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
            {categories.map((category) => (
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
