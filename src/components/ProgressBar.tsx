import styles from './ProgressBar.module.css'

export default function ProgressBar({ correct, total, suffix = 'correct' }: { correct: number; total: number; suffix?: string }) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100)
  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={correct}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Questions correct"
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.count}>{correct} / {total} {suffix}</span>
    </div>
  )
}
