import { Link, useParams } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'

export default function DomainPage() {
  const { sectionSlug, domainSlug } = useParams<{ sectionSlug: string; domainSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  const domain = section?.domains.find(d => d.slug === domainSlug)
  if (!section || !domain) return <p>Domain not found.</p>

  return (
    <div>
      <h1>{domain.title}</h1>
      <ul>
        {domain.subsections.map(sub => {
          const questions = getQuestions(domain.slug, sub.slug)
          const correct = readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
          return (
            <li key={sub.slug}>
              <Link to={`/${section.slug}/${domain.slug}/${sub.slug}`}>{sub.title}</Link>
              {' '}<span>({correct} / {questions.length} correct)</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
