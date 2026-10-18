import styles from './ScoreScale.module.css'

function ScoreRange({ label, min, max }: { label: string; min: number; max: number }) {
  return (
    <div className={styles.range}>
      <span className={styles.rangeLabel}>{label}</span>
      <div className={styles.rangeTrack} aria-hidden="true" />
      <div className={styles.rangeTicks}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default function ScoreScale() {
  return (
    <div className={styles.scale}>
      <ScoreRange label="Reading & Writing" min={200} max={800} />
      <ScoreRange label="Math" min={200} max={800} />
      <ScoreRange label="Combined" min={400} max={1600} />
    </div>
  )
}
