import { Link } from 'react-router-dom'
import { getDesmosTopics } from '../content/index'

export default function DesmosTricksHub() {
  const topics = getDesmosTopics()
  return (
    <div>
      <h1>Desmos Tricks</h1>
      <p>Techniques for using the built-in Desmos calculator to solve SAT Math problems faster.</p>
      <ul>
        {topics.map(topic => (
          <li key={topic.slug}>
            <Link to={`/desmos-tricks/${topic.slug}`}>{topic.title}</Link> — {topic.summary}
          </li>
        ))}
      </ul>
    </div>
  )
}
