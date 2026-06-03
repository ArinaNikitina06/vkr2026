import type { RecommendationItem } from '../lib/types'
import CourseCard from './CourseCard'

type RecommendationCourseGridProps = {
  items: RecommendationItem[]
  onLike?: (courseId: string) => void
  onHide?: (courseId: string) => void
}

export default function RecommendationCourseGrid({
  items,
  onLike,
  onHide
}: RecommendationCourseGridProps): JSX.Element {
  return (
    <div className="grid-cards">
      {items.map((item) => (
        <CourseCard
          key={item.course.id}
          href={`/course/${item.course.id}`}
          reasons={item.reasons}
          onLike={onLike}
          onHide={onHide}
          {...item.course}
        />
      ))}
    </div>
  )
}
