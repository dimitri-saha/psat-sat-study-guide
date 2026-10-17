import { Link } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'

export default function Home() {
  let total = 0
  let correct = 0
  for (const section of sections) {
    for (const domain of section.domains) {
      for (const sub of domain.subsections) {
        const questions = getQuestions(domain.slug, sub.slug)
        total += questions.length
        correct += readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
      }
    }
  }

  return (
    <div>
      <h1>PSAT/SAT Study Guide</h1>
      <p>
        The digital SAT has two sections: Reading & Writing and Math. Each is scored
        200-800, for a combined 400-1600. Pick a section below, work through the lesson
        for a subsection, then practice with hints and full walkthroughs.
      </p>
      <p>{correct} / {total} correct overall</p>
      <ul>
        <li><Link to="/reading-writing">Reading & Writing</Link></li>
        <li><Link to="/math">Math</Link></li>
        <li><Link to="/desmos-tricks">Desmos Tricks</Link></li>
      </ul>
    </div>
  )
}
