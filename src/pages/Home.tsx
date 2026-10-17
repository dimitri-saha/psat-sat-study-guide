import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>PSAT/SAT Study Guide</h1>
      <p>
        The digital SAT has two sections: Reading & Writing and Math. Each is scored
        200-800, for a combined 400-1600. Pick a section below, work through the lesson
        for a subsection, then practice with hints and full walkthroughs.
      </p>
      <ul>
        <li><Link to="/reading-writing">Reading & Writing</Link></li>
        <li><Link to="/math">Math</Link></li>
        <li><Link to="/desmos-tricks">Desmos Tricks</Link></li>
      </ul>
    </div>
  )
}
