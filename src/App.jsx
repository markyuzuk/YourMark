import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ClientPortal from './pages/ClientPortal'
import GetStarted from './pages/GetStarted'
import ScheduleConsultation from './pages/ScheduleConsultation'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/client-portal" element={<ClientPortal />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
      </Routes>
    </Router>
  )
}

export default App
