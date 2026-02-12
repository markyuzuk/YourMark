import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'

const PdfViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const pdfMap = {
    '1': { title: 'Homepage', file: '/pdfs/homepage.pdf' },
    '2': { title: 'About Us', file: '/pdfs/about-us.pdf' },
    '3': { title: 'Contact Us', file: '/pdfs/contact.pdf' },
    '4': { title: 'For Patients', file: '/pdfs/for-patients.pdf' },
    '5': { title: 'Find a Clinical Trial', file: '/pdfs/join-trial.pdf' },
    '6': { title: 'Partnerships', file: '/pdfs/partnerships.pdf' },
    '7': { title: 'For Sponsors', file: '/pdfs/for-sponsors-partnership.pdf' },
    '8': { title: 'For Site Owners', file: '/pdfs/for-site-owners.pdf' },
    '9': { title: 'Resource Library', file: '/pdfs/resource-library.pdf' },
    '10': { title: 'White Papers', file: '/pdfs/white-papers.pdf' },
    '11': { title: 'News & Updates', file: '/pdfs/news.pdf' },
  }

  const currentPdf = pdfMap[id]

  if (!currentPdf) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Not Found</h1>
          <Button onClick={() => navigate('/4')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-4 mt-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/4')}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Button>
            <h1 className="text-xl font-semibold text-white">{currentPdf.title}</h1>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="w-full h-[calc(100vh-73px)]">
        <iframe
          src={currentPdf.file}
          className="w-full h-full"
          title={currentPdf.title}
        />
      </div>
    </div>
  )
}

export default PdfViewer
