import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLesson, getQuestions, sections } from '../content/index'
import LessonView from '../components/LessonView'
import Practice from '../components/Practice'
import styles from './SubsectionPage.module.css'

export default function SubsectionPage() {
  const { sectionSlug, domainSlug, subsectionSlug } = useParams<{ sectionSlug: string; domainSlug: string; subsectionSlug: string }>()
  const [tab, setTab] = useState<'lesson' | 'practice'>('lesson')
  if (!sectionSlug || !domainSlug || !subsectionSlug) return <p>Not found.</p>

  const section = sections.find(s => s.slug === sectionSlug)
  const domain = section?.domains.find(d => d.slug === domainSlug)
  const subsection = domain?.subsections.find(sub => sub.slug === subsectionSlug)
  if (!section || !domain || !subsection) return <p>Subsection not found.</p>

  const lesson = getLesson(domainSlug, subsectionSlug)
  const questions = getQuestions(domainSlug, subsectionSlug)

  return (
    <div>
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          className={tab === 'lesson' ? styles.tabActive : styles.tab}
          onClick={() => setTab('lesson')}
          aria-pressed={tab === 'lesson'}
        >
          Lesson
        </button>
        <button
          type="button"
          className={tab === 'practice' ? styles.tabActive : styles.tab}
          onClick={() => setTab('practice')}
          aria-pressed={tab === 'practice'}
        >
          Practice
        </button>
      </div>
      <div className={styles.panel}>
        {tab === 'lesson'
          ? <LessonView lesson={lesson} />
          : <Practice subsectionKey={`${domainSlug}/${subsectionSlug}`} questions={questions} />}
      </div>
    </div>
  )
}
