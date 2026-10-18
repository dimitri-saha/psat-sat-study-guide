import type { Lesson } from '../content/types'
import styles from './LessonView.module.css'

export default function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article>
      <h1>{lesson.title}</h1>
      <p className={styles.summary}>{lesson.summary}</p>
      <p>{lesson.body}</p>
      <div className={styles.tips}>
        <h2 className={styles.tipsHeading}>Tips</h2>
        <ul className={styles.tipsList}>
          {lesson.tips.map(tip => <li key={tip}>{tip}</li>)}
        </ul>
      </div>
      <div className={styles.videoFrame}>
        <iframe
          title={`${lesson.title} video`}
          src={`https://www.youtube.com/embed/${lesson.videoId}`}
          allowFullScreen
        />
      </div>
    </article>
  )
}
