import { useParams } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'
import RowLink from '../components/RowLink'
import ProgressBar from '../components/ProgressBar'

export default function SectionOverview() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  if (!section) return <p>Section not found.</p>

  return (
    <div>
      <h1>{section.title}</h1>
      <div>
        {section.domains.map(domain => {
          let total = 0
          let correct = 0
          for (const sub of domain.subsections) {
            const questions = getQuestions(domain.slug, sub.slug)
            total += questions.length
            correct += readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
          }
          return (
            <RowLink
              key={domain.slug}
              to={`/${section.slug}/${domain.slug}`}
              title={domain.title}
              meta={<ProgressBar correct={correct} total={total} />}
            />
          )
        })}
      </div>
    </div>
  )
}
