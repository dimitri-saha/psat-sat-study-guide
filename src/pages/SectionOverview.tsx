import { Link, useParams } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'

export default function SectionOverview() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  if (!section) return <p>Section not found.</p>

  return (
    <div>
      <h1>{section.title}</h1>
      <ul>
        {section.domains.map(domain => {
          let total = 0
          let correct = 0
          for (const sub of domain.subsections) {
            const questions = getQuestions(domain.slug, sub.slug)
            total += questions.length
            correct += readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
          }
          return (
            <li key={domain.slug}>
              <Link to={`/${section.slug}/${domain.slug}`}>{domain.title}</Link>
              {' '}<span>({correct} / {total} correct)</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
