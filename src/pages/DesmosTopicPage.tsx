import { useParams } from 'react-router-dom'
import { getDesmosTopics, getDesmosTopic } from '../content/index'
import DesmosCalculator from '../components/DesmosCalculator'

export default function DesmosTopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  if (!topicSlug) return <p>Not found.</p>

  const topic = getDesmosTopics().find(t => t.slug === topicSlug)
  if (!topic) return <p>Topic not found.</p>

  const fullTopic = getDesmosTopic(topicSlug)

  return (
    <div>
      <h1>{fullTopic.title}</h1>
      <p>{fullTopic.body}</p>
      <ul>
        {fullTopic.tips.map(tip => <li key={tip}>{tip}</li>)}
      </ul>
      <DesmosCalculator config={fullTopic.desmosConfig} />
    </div>
  )
}
