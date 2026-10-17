import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/reading-writing">Reading & Writing</Link>
        <Link to="/math">Math</Link>
        <Link to="/desmos-tricks">Desmos Tricks</Link>
      </nav>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
