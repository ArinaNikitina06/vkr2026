import type { CurriculumItem } from '../lib/types'

type CourseCurriculumProps = {
  sections: CurriculumItem[]
}

export default function CourseCurriculum({ sections }: CourseCurriculumProps): JSX.Element {
  return (
    <section className="course-section">
      <h2 className="course-section__title">Содержание курса</h2>
      <div className="course-curriculum">
        {sections.map((section) => (
          <article key={section.title} className="course-curriculum__item">
            <button
              className="course-curriculum__button"
              type="button"
            >
              <div>
                <h3 className="course-curriculum__title">{section.title}</h3>
                <p className="course-curriculum__meta">{section.sections} уроков</p>
              </div>
              <svg className="course-curriculum__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
