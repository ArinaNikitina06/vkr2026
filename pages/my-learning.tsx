import Header from '../components/Header'
import CourseGrid from '../components/CourseGrid'
import EmptyState from '../components/EmptyState'
import LearningCourseList from '../components/LearningCourseList'
import LearningTabs, { type LearningTabId } from '../components/LearningTabs'
import type { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useState } from 'react'
import { authOptions } from '../lib/server/authOptions'
import {
  getLearningCoursesForUser,
  type LearningCourseCollections
} from '../lib/server/courseRepository'

type MyLearningProps = {
  tabData: LearningCourseCollections
}

export const getServerSideProps: GetServerSideProps<MyLearningProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  const tabData = await getLearningCoursesForUser(session?.user?.email)

  return {
    props: {
      tabData
    }
  }
}

export default function MyLearning({ tabData }: MyLearningProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<LearningTabId>('inProgress')
  const activeCourses = tabData[activeTab]

  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section section--compact">
          <h1 className="section-title section-title--lg section-title--with-subtitle-sm">Мое обучение</h1>
          <p className="section-subtitle">Отслеживайте свой прогресс и продолжайте обучение.</p>
        </section>

        <section className="page-container section">
          <LearningTabs activeTab={activeTab} onChange={setActiveTab} />
        </section>

        <section className="page-container section">
          {activeCourses.length === 0 ? (
            <EmptyState
              title="Здесь пока нет курсов"
              description="Запишитесь на курс, чтобы он появился в этом разделе."
            />
          ) : activeTab === 'inProgress' ? (
            <LearningCourseList courses={tabData.inProgress} />
          ) : (
            <CourseGrid courses={activeCourses} />
          )}
        </section>
      </main>
    </>
  )
}
