import { Link, useParams } from 'react-router-dom'
import { sections } from '../content/index'

export default function DomainPage() {
  const { sectionSlug, domainSlug } = useParams<{ sectionSlug: string; domainSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  const domain = section?.domains.find(d => d.slug === domainSlug)
  if (!section || !domain) return <p>Domain not found.</p>

  return (
    <div>
      <h1>{domain.title}</h1>
      <ul>
        {domain.subsections.map(sub => (
          <li key={sub.slug}>
            <Link to={`/${section.slug}/${domain.slug}/${sub.slug}`}>{sub.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
