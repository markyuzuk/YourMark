import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ExternalLink, Eye, Calendar, FileText, Download } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const ClientPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')

  const demoProjects = [
    {
      id: 5,
      clientName: 'Sensorium Clinical Research',
      projectName: 'New Rose Colored Theme (PDF Review)',
      previewUrl: '/4',
      status: 'Review',
      lastUpdated: '2026-01-27',
      thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
      description: 'Warm and welcoming theme, improved content language, expansion to additional audiences. Note: The Sensorium logo depicted is just a placeholder and will be updated as we finalize.',
      isRoseColored: true
    },
    {
      id: 1,
      clientName: 'Sensorium Clinical Research',
      projectName: 'Original Blue Theme',
      previewUrl: '#',
      status: 'In Progress',
      lastUpdated: '2026-01-28',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      description: 'Original blue theme, improved content language, expansion to additional audiences.',
      isGreyedOut: true
    },
    {
      id: 3,
      clientName: 'Sensorium Clinical Research',
      projectName: 'Brand/Vision',
      previewUrl: '#',
      status: 'Completed',
      lastUpdated: '2026-01-25',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      description: 'Downloadable PDF with comprehensive brand guidelines and vision documentation.',
      isPDF: true,
      isGreyedOut: true
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
              <Logo className="h-10 w-auto" showText={true} />
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
              <Logo className="h-10 w-auto" showText={true} />
            </Link>
            
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Sensorium Clinical Research</h1>
          <p className="text-xl text-gray-600">
            View and interact with your website projects in development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoProjects.map((project) => (
            <Card key={project.id} className={`hover:shadow-lg transition-shadow overflow-hidden ${project.isGreyedOut ? 'opacity-50' : ''}`}>
              <div className={`relative h-48 bg-gradient-to-br overflow-hidden flex items-center justify-center ${project.isGreyedOut ? 'from-gray-100 to-gray-200' : project.isRoseColored ? 'from-rose-50 to-rose-100' : 'from-emerald-50 to-emerald-100'}`}>
                <div className="text-center">
                  {project.isPDF ? (
                    <>
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white mb-2 ${project.isGreyedOut ? 'bg-gray-400' : 'bg-emerald-500'}`}>
                        <FileText className="h-12 w-12" />
                      </div>
                      <p className={`text-sm font-medium ${project.isGreyedOut ? 'text-gray-500' : 'text-emerald-700'}`}>PDF Document</p>
                    </>
                  ) : (
                    <>
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white mb-2 ${project.isGreyedOut ? 'bg-gray-400' : project.isRoseColored ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                        <span className="text-4xl font-bold">V{project.id}</span>
                      </div>
                      <p className={`text-sm font-medium ${project.isGreyedOut ? 'text-gray-500' : project.isRoseColored ? 'text-rose-700' : 'text-emerald-700'}`}>Version {project.id}</p>
                    </>
                  )}
                </div>
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
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {project.description}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated {project.lastUpdated}
                </div>
                
                <div className="flex gap-2">
                  {project.isPDF ? (
                    <Button className="flex-1" size="sm" disabled={project.isGreyedOut}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="flex-1" 
                        size="sm"
                        disabled={project.isGreyedOut}
                        onClick={() => !project.isGreyedOut && project.previewUrl !== '#' && window.open(project.previewUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={project.isGreyedOut}
                        onClick={() => !project.isGreyedOut && project.previewUrl !== '#' && window.open(project.previewUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
