import type { Course } from '../lib/types'
import CourseCard from './CourseCard'

type CourseGridProps = {
  courses: Course[]
  getHref?: (course: Course) => string
  disableMetaLinks?: boolean
  onOpen?: (courseId: string) => void
}

export default function CourseGrid({
  courses,
  getHref = (course) => `/course/${course.id}`,
  disableMetaLinks = false,
  onOpen
}: CourseGridProps): JSX.Element {
  return (
    <div className="grid-cards">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          href={getHref(course)}
          disableMetaLinks={disableMetaLinks}
          onOpen={onOpen}
          {...course}
        />
      ))}
    </div>
  )
}
