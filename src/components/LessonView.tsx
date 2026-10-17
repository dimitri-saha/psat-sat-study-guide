import type { Lesson } from '../content/types'
import styles from './LessonView.module.css'

export default function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article>
      <h1>{lesson.title}</h1>
      <p className={styles.summary}>{lesson.summary}</p>
      <p>{lesson.body}</p>
      <div className={styles.tips}>
        <h2>Tips</h2>
        <ul>
          {lesson.tips.map(tip => <li key={tip}>{tip}</li>)}
        </ul>
      </div>
      <iframe
        title={`${lesson.title} video`}
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${lesson.videoId}`}
        allowFullScreen
      />
    </article>
  )
}
