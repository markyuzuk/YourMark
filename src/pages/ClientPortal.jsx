import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ExternalLink, Eye, Calendar, FileText, Download } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const ClientPortal = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')

  const demoProjects = [
    {
      id: 1,
      clientName: 'Sensorium Clinical Research',
      projectName: 'Rose Theme Demo - Option 1',
      previewUrl: '/rose-demo/landing-v4-patient-centric.html',
      status: 'Review',
      lastUpdated: '2026-04-13',
      thumbnail: '/rose-demo/images/rose-thumbnail.png',
      description: 'Complete rose-themed website design with patient-centric messaging and warm, approachable aesthetic.',
      isRoseColored: true,
      isExternal: true,
      useImageIcon: true,
      versionLabel: 'Rose Colored Version'
    },
    {
      id: 2,
      clientName: 'Sensorium Clinical Research',
      projectName: 'Blue Theme Demo - Option 2',
      previewUrl: '/blue-demo/landing-v4-patient-centric.html',
      status: 'Review',
      lastUpdated: '2026-04-13',
      thumbnail: '/blue-demo/images/blue-thumbnail.png',
      description: 'Complete blue-themed website design with patient-centric messaging and warm, approachable aesthetic.',
      isBlueColored: true,
      isExternal: true,
      useImageIcon: true,
      versionLabel: 'Midnight Blue Version'
    }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
    if (accessCode === 'Welcome2026') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid access code. Please contact your project manager.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center mb-6">
              <span className="text-4xl font-bold text-emerald-600">YourMark.ai</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Client Portal</h1>
            <p className="text-gray-600">Enter your access code to view your project previews</p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium mb-2">
                    Access Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="accessCode"
                      type="password"
                      placeholder="Enter your access code"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Access Portal
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                YourMark.ai
              </span>
            </Link>
            
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-20">
          <h1 className="text-4xl font-bold mb-4">Sensorium Clinical Research</h1>
          <p className="text-xl text-gray-600">
            View and interact with your website projects in development
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          {demoProjects.map((project) => (
            <Card key={project.id} className={`hover:shadow-lg transition-shadow overflow-hidden flex flex-col ${project.isGreyedOut ? 'opacity-50' : ''}`}>
              <div className={`relative h-48 bg-gradient-to-br overflow-hidden flex items-center justify-center ${project.isGreyedOut ? 'from-gray-100 to-gray-200' : project.isRoseColored ? 'from-rose-50 to-rose-100' : project.isBlueColored ? 'from-blue-50 to-blue-100' : 'from-emerald-50 to-emerald-100'}`}>
                {project.useImageIcon ? (
                  <img 
                    src={project.thumbnail} 
                    alt={project.projectName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    {project.isPDF || project.isPDFIcon ? (
                      <>
                        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white mb-2 ${project.isGreyedOut ? 'bg-gray-400' : project.isRoseColored ? 'bg-rose-500' : project.isBlueColored ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                          <FileText className="h-12 w-12" />
                        </div>
                        <p className={`text-sm font-medium ${project.isGreyedOut ? 'text-gray-500' : project.isRoseColored ? 'text-rose-700' : project.isBlueColored ? 'text-blue-700' : 'text-emerald-700'}`}>{project.isPDFIcon ? 'PDF Directory' : 'PDF Document'}</p>
                      </>
                    ) : (
                      <>
                        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white mb-2 ${project.isGreyedOut ? 'bg-gray-400' : project.isRoseColored ? 'bg-rose-500' : project.isBlueColored ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                          <span className={`font-bold ${project.versionLabel ? 'text-2xl' : 'text-4xl'}`}>{project.versionLabel || `V${project.id}`}</span>
                        </div>
                        <p className={`text-sm font-medium ${project.isGreyedOut ? 'text-gray-500' : project.isRoseColored ? 'text-rose-700' : project.isBlueColored ? 'text-blue-700' : 'text-emerald-700'}`}>{project.versionLabel || `Version ${project.id}`}</p>
                      </>
                    )}
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{project.projectName}</CardTitle>
                <CardDescription className="text-sm font-medium text-primary">
                  {project.clientName}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-gray-600 mb-4">
                  {project.description}
                </p>
                
                {project.links && (
                  <div className="mb-4 space-y-2">
                    {project.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        className="block text-sm text-primary hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated {project.lastUpdated}
                </div>
                
                <div className="mt-auto">
                  <div className="flex gap-2">
                    {project.isPDF ? (
                      <Button className="flex-1" size="lg" disabled={project.isGreyedOut}>
                        <Download className="h-5 w-5 mr-2" />
                        Download PDF
                      </Button>
                    ) : (
                      <>
                        <Button 
                          className="flex-1" 
                          size="lg"
                          disabled={project.isGreyedOut}
                          onClick={() => {
                            if (!project.isGreyedOut && project.previewUrl !== '#') {
                              if (project.isExternal) {
                                const newWindow = window.open(project.previewUrl, '_blank');
                                if (newWindow) {
                                  newWindow.addEventListener('load', () => {
                                    newWindow.document.body.style.zoom = '0.8';
                                  });
                                }
                              } else {
                                navigate(project.previewUrl)
                              }
                            }
                          }}
                        >
                          <Eye className="h-5 w-5 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          disabled={project.isGreyedOut}
                          onClick={() => {
                            if (!project.isGreyedOut && project.previewUrl !== '#') {
                              if (project.isExternal) {
                                window.open(project.previewUrl, '_blank')
                              } else {
                                window.open(project.previewUrl, '_blank')
                              }
                            }
                          }}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Design Principles</h3>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Make it Punchy</h4>
                    <p className="text-sm text-gray-600">Bold headlines and clear value propositions</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Tell the Culture Story</h4>
                    <p className="text-sm text-gray-600">Emphasize community and human connection</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Clear Messaging</h4>
                    <p className="text-sm text-gray-600">Direct communication without jargon</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Avoid Stock Photos</h4>
                    <p className="text-sm text-gray-600">Use authentic imagery that reflects real people</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Be Authentic</h4>
                    <p className="text-sm text-gray-600">Genuine voice and transparent approach</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Mobile Friendly</h4>
                    <p className="text-sm text-gray-600">Fully responsive design for all devices</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">7</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Easy Access to Studies</h4>
                    <p className="text-sm text-gray-600">Streamlined navigation to trial information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Welcome to the Sensorium Clinical Research Website Preview</h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-rose-400 rounded-r-xl p-6">
                  <p className="text-lg text-gray-800 leading-relaxed italic">
                    This complete redesign was built around a core principle that sets Sensorium apart in the clinical research industry: <strong className="text-rose-700 not-italic">"Most clinical trial sites scale up and lose their soul. Care becomes corporate. Patients become data points. Communities become markets. Not here. We are different."</strong>
                  </p>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  Every design decision—from the warm rose color palette to the patient-centric messaging—reinforces this commitment to maintaining local culture and community-focused care while scaling operations. The site serves four distinct audiences with tailored content while maintaining a cohesive brand identity that emphasizes trust, transparency, and human-centered care. Built with HTML5 and Tailwind CSS, the site includes 14 interconnected pages with a modern, approachable aesthetic optimized for both desktop and mobile experiences.
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  This design purposefully did not use stock images but will evolve with real images of the sites and people to provide authenticity and reinforce the "we are different" message. Each page has been carefully crafted to build trust through transparency, educate visitors about the clinical research process, and invite them to become part of the Sensorium community.
                </p>
              </div>
            </div>

        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            Secure Preview Access
          </h3>
          <p className="text-gray-700">
            All project previews are password-protected and encrypted. Your access is logged for security purposes. 
            If you have any questions or need assistance, please contact your project manager.
          </p>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold">YourMark.ai</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 YourMark.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ClientPortal
