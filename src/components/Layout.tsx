import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.linkActive}` : styles.link

export default function Layout() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink to="/" end className={styles.wordmark} aria-label="Home">
            SAT<span className={styles.wordmarkSlash}>/</span>PSAT
          </NavLink>
          <div className={styles.links}>
            <NavLink to="/reading-writing" className={navLinkClass}>Reading &amp; Writing</NavLink>
            <NavLink to="/math" className={navLinkClass}>Math</NavLink>
            <NavLink to="/desmos-tricks" className={navLinkClass}>Desmos Tricks</NavLink>
          </div>
        </nav>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
