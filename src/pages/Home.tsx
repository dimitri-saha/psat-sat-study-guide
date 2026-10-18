import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'
import ScoreScale from '../components/ScoreScale'
import ProgressBar from '../components/ProgressBar'
import RowLink from '../components/RowLink'
import styles from './Home.module.css'

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
      <h1>Score your way to a 1600.</h1>
      <p className={styles.lead}>
        The digital SAT has two sections, each scored 200&ndash;800. Pick a section below,
        work through the lesson for a subsection, then practice with hints and full walkthroughs.
      </p>

      <ScoreScale />

      <div className={styles.progressRow}>
        <ProgressBar correct={correct} total={total} suffix="correct overall" />
      </div>

      <div className={styles.sections}>
        <RowLink
          to="/reading-writing"
          title="Reading & Writing"
          description="Information and ideas, craft and structure, expression of ideas, conventions."
        />
        <RowLink
          to="/math"
          title="Math"
          description="Algebra, advanced math, problem-solving and data analysis, geometry and trig."
        />
        <RowLink
          to="/desmos-tricks"
          title="Desmos Tricks"
          description="Calculator techniques that save time on the math section."
        />
      </div>
    </div>
  )
}
