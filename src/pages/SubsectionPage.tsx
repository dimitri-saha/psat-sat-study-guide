import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLesson, getQuestions } from '../content/index'
import LessonView from '../components/LessonView'
import Practice from '../components/Practice'

export default function SubsectionPage() {
  const { domainSlug, subsectionSlug } = useParams<{ domainSlug: string; subsectionSlug: string }>()
  const [tab, setTab] = useState<'lesson' | 'practice'>('lesson')
  if (!domainSlug || !subsectionSlug) return <p>Not found.</p>

  const lesson = getLesson(domainSlug, subsectionSlug)
  const questions = getQuestions(domainSlug, subsectionSlug)

  return (
    <div>
      <div role="tablist">
        <button onClick={() => setTab('lesson')} aria-pressed={tab === 'lesson'}>Lesson</button>
        <button onClick={() => setTab('practice')} aria-pressed={tab === 'practice'}>Practice</button>
      </div>
      {tab === 'lesson'
        ? <LessonView lesson={lesson} />
        : <Practice subsectionKey={`${domainSlug}/${subsectionSlug}`} questions={questions} />}
    </div>
  )
}
