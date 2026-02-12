import { Link, useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import Navbar from '../components/Navbar'

const PdfDirectory = () => {
  const navigate = useNavigate()

  const pdfPages = [
    // Main Pages
    { id: 1, title: 'Homepage', description: 'The Sensorium Effect - Main landing page', section: 'Main Pages', color: 'primary', route: '/4/1' },
    { id: 2, title: 'About Us', description: 'Leadership, team, mission & values', section: 'Main Pages', color: 'primary', route: '/4/2' },
    { id: 3, title: 'Contact Us', description: 'Get in touch with our team', section: 'Main Pages', color: 'primary', route: '/4/3' },
    
    // For Patients
    { id: 4, title: 'For Patients', description: 'Visual story of patient experience', section: 'For Patients', color: 'teal', route: '/4/4' },
    { id: 5, title: 'Find a Clinical Trial', description: 'Search and join available studies', section: 'For Patients', color: 'teal', route: '/4/5' },
    
    // For Sponsors & CROs
    { id: 6, title: 'Partnerships', description: 'Culture-first partnership model', section: 'For Sponsors & CROs', color: 'amber', route: '/4/6' },
    { id: 7, title: 'For Sponsors', description: 'Partnership approach & capabilities', section: 'For Sponsors & CROs', color: 'amber', route: '/4/7' },
    
    // For Site Owners
    { id: 8, title: 'For Site Owners', description: 'Growth & scale without sacrifice', section: 'For Site Owners', color: 'indigo', route: '/4/8' },
    
    // Resources & Insights
    { id: 9, title: 'Resource Library', description: 'Practical guides & tools', section: 'Resources & Insights', color: 'teal', route: '/4/9' },
    { id: 10, title: 'White Papers', description: 'Industry insights & analysis', section: 'Resources & Insights', color: 'amber', route: '/4/10' },
    { id: 11, title: 'News & Updates', description: 'Latest company news', section: 'Resources & Insights', color: 'indigo', route: '/4/11' },
  ]

  const sections = [
    { name: 'Main Pages', number: 1, color: 'bg-rose-600' },
    { name: 'For Patients', number: 2, color: 'bg-teal-600' },
    { name: 'For Sponsors & CROs', number: 3, color: 'bg-amber-600' },
    { name: 'For Site Owners', number: 4, color: 'bg-indigo-600' },
    { name: 'Resources & Insights', number: 5, color: 'bg-purple-600' },
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        gradient: 'from-rose-500 to-rose-600',
        border: 'hover:border-rose-500',
        text: 'text-rose-600 group-hover:text-rose-700'
      },
      teal: {
        gradient: 'from-teal-500 to-teal-600',
        border: 'hover:border-teal-500',
        text: 'text-teal-600 group-hover:text-teal-700'
      },
      amber: {
        gradient: 'from-amber-500 to-amber-600',
        border: 'hover:border-amber-500',
        text: 'text-amber-600 group-hover:text-amber-700'
      },
      indigo: {
        gradient: 'from-indigo-500 to-indigo-600',
        border: 'hover:border-indigo-500',
        text: 'text-indigo-600 group-hover:text-indigo-700'
      }
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-400 text-white py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-4">Project - Sensorium Clinical Research</h1>
          <h2 className="text-2xl mb-2">Website Review - Version 5</h2>
          <p className="text-lg opacity-90">Click any page below to view the PDF preview</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">📋 About This Directory</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            This directory provides PDF previews of all pages in the Sensorium Clinical Research website (Version 5). 
            Each PDF captures the full page design, layout, and content as it appears on the live website.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-800 font-semibold">💡 Tip: Click any page title below to open its PDF in a new tab.</p>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.name} className="mb-12">
            <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6 flex items-center">
              <span className={`${section.color} text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl`}>
                {section.number}
              </span>
              {section.name}
            </h3>
            <div className={`grid ${section.name === 'For Site Owners' ? 'md:grid-cols-1 max-w-2xl' : section.name === 'For Patients' || section.name === 'For Sponsors & CROs' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
              {pdfPages
                .filter(page => page.section === section.name)
                .map((page) => {
                  const colorClasses = getColorClasses(page.color)
                  return (
                    <button
                      key={page.id}
                      onClick={() => navigate(page.route)}
                      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent ${colorClasses.border} group text-left w-full`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.gradient} rounded-lg flex items-center justify-center`}>
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className={`${colorClasses.text} font-semibold`}>View PDF →</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{page.title}</h4>
                      <p className="text-gray-600 text-sm">{page.description}</p>
                    </button>
                  )
                })}
            </div>
          </section>
        ))}

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-8 mt-12">
          <h3 className="text-2xl font-bold mb-4">📝 Review Instructions</h3>
          <div className="space-y-3 text-gray-300">
            <p>• Each PDF captures the complete page as it appears on the website</p>
            <p>• PDFs include all sections, images, and content from top to bottom</p>
            <p>• Colors, gradients, and styling are preserved in the PDF output</p>
            <p>• All PDFs are generated at high resolution for clear viewing</p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Generated: February 12, 2026 | Sensorium Clinical Research Website - Version 5
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2026 YourMark.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default PdfDirectory
