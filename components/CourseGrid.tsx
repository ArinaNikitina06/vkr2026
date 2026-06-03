import type { Course } from '../lib/types'
import CourseCard from './CourseCard'

type CourseGridProps = {
  courses: Course[]
  getHref?: (course: Course) => string
  disableMetaLinks?: boolean
}

export default function CourseGrid({
  courses,
  getHref = (course) => `/course/${course.id}`,
  disableMetaLinks = false
}: CourseGridProps): JSX.Element {
  return (
    <div className="grid-cards">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          href={getHref(course)}
          disableMetaLinks={disableMetaLinks}
          {...course}
        />
      ))}
    </div>
  )
}
