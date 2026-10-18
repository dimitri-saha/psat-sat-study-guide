import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from './RowLink.module.css'

export default function RowLink({ to, title, description, meta }: { to: string; title: string; description?: string; meta?: ReactNode }) {
  return (
    <Link to={to} className={styles.row}>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      {meta && <span className={styles.meta}>{meta}</span>}
    </Link>
  )
}
