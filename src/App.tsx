import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SectionOverview from './pages/SectionOverview'
import DomainPage from './pages/DomainPage'
import SubsectionPage from './pages/SubsectionPage'
import DesmosTricksHub from './pages/DesmosTricksHub'
import DesmosTopicPage from './pages/DesmosTopicPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="desmos-tricks" element={<DesmosTricksHub />} />
        <Route path="desmos-tricks/:topicSlug" element={<DesmosTopicPage />} />
        <Route path=":sectionSlug" element={<SectionOverview />} />
        <Route path=":sectionSlug/:domainSlug" element={<DomainPage />} />
        <Route path=":sectionSlug/:domainSlug/:subsectionSlug" element={<SubsectionPage />} />
        <Route path="*" element={<p>Not found.</p>} />
      </Route>
    </Routes>
  )
}
