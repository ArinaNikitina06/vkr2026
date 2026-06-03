import Image from 'next/image'

type CourseInstructorProps = {
  name?: string
  image?: string
}

export default function CourseInstructor({ name, image }: CourseInstructorProps): JSX.Element {
  return (
    <section className="course-section">
      <h2 className="course-section__title">О преподавателе</h2>
      <div className="course-instructor">
        {image && (
          <Image
            src={image}
            alt={name ?? 'Преподаватель курса'}
            width={64}
            height={64}
            className="course-instructor__avatar"
            unoptimized={image.endsWith('.svg')}
          />
        )}
        <div>
          <h3 className="course-instructor__name">{name}</h3>
          <p className="course-instructor__description">Продуктовый дизайнер из Сан-Франциско. Научу React и Next.js.</p>
        </div>
      </div>
    </section>
  )
}
