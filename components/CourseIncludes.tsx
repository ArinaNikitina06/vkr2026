type CourseIncludesProps = {
  items: string[]
}

export default function CourseIncludes({ items }: CourseIncludesProps): JSX.Element {
  return (
    <div className="course-includes">
      <h3 className="course-includes__title">Этот курс включает:</h3>
      {items.map((item) => (
        <div key={item} className="course-includes__item">
          <svg className="course-includes__icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}
