import Header from '../components/Header'
import CourseGrid from '../components/CourseGrid'
import LearningCourseList from '../components/LearningCourseList'
import LearningTabs, { type LearningTabId } from '../components/LearningTabs'
import { useState } from 'react'
import { myLearningCourses } from '../lib/data/courses'

export default function MyLearning(): JSX.Element {
  const [activeTab, setActiveTab] = useState<LearningTabId>('inProgress')

  const tabData = {
    inProgress: myLearningCourses.inProgress,
    saved: myLearningCourses.saved,
    completed: myLearningCourses.completed
  }

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
          {activeTab === 'inProgress' ? (
            <LearningCourseList courses={tabData.inProgress} />
          ) : (
            <CourseGrid courses={tabData[activeTab]} />
          )}
        </section>
      </main>
    </>
  )
}
