import { Link, useParams } from 'react-router-dom'
import { sections } from '../content/index'

export default function SectionOverview() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  if (!section) return <p>Section not found.</p>

  return (
    <div>
      <h1>{section.title}</h1>
      <ul>
        {section.domains.map(domain => (
          <li key={domain.slug}>
            <Link to={`/${section.slug}/${domain.slug}`}>{domain.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
