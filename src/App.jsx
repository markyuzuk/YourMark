import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ClientPortal from './pages/ClientPortal'
import GetStarted from './pages/GetStarted'
import ScheduleConsultation from './pages/ScheduleConsultation'
import PdfDirectory from './pages/PdfDirectory'
import PdfViewer from './pages/PdfViewer'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/1" element={<ClientPortal />} />
        <Route path="/2" element={<GetStarted />} />
        <Route path="/3" element={<ScheduleConsultation />} />
        <Route path="/4" element={<PdfDirectory />} />
        <Route path="/4/:id" element={<PdfViewer />} />
      </Routes>
    </Router>
  )
}

export default App
