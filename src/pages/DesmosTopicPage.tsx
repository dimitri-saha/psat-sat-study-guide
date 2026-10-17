import { useParams } from 'react-router-dom'
import { getDesmosTopic } from '../content/index'
import DesmosCalculator from '../components/DesmosCalculator'

export default function DesmosTopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  if (!topicSlug) return <p>Not found.</p>
  const topic = getDesmosTopic(topicSlug)

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.body}</p>
      <ul>
        {topic.tips.map(tip => <li key={tip}>{tip}</li>)}
      </ul>
      <DesmosCalculator config={topic.desmosConfig} />
    </div>
  )
}
