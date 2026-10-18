import { getDesmosTopics } from '../content/index'
import RowLink from '../components/RowLink'
import styles from './DesmosTricksHub.module.css'

export default function DesmosTricksHub() {
  const topics = getDesmosTopics()
  return (
    <div>
      <h1>Desmos Tricks</h1>
      <p className={styles.lead}>
        Techniques for using the built-in Desmos calculator to solve SAT Math problems faster.
      </p>
      <div>
        {topics.map(topic => (
          <RowLink key={topic.slug} to={`/desmos-tricks/${topic.slug}`} title={topic.title} description={topic.summary} />
        ))}
      </div>
    </div>
  )
}
