import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import styles from './App.module.css'

function Placeholder({ label }: { label: string }) {
  return <p className={styles.placeholder}>{label}</p>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Placeholder label="Home" />} />
        <Route path="*" element={<Placeholder label="Not found" />} />
      </Route>
    </Routes>
  )
}
