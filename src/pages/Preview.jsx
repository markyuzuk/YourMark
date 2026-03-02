import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Card, CardContent } from '../components/ui/Card'

const Preview = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already authenticated in session
    const authenticated = sessionStorage.getItem('previewAuthenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (accessCode === 'Welcome2026') {
      setIsAuthenticated(true)
      sessionStorage.setItem('previewAuthenticated', 'true')
      setError('')
      // Redirect to preview.yourmark.ai
      window.location.href = 'https://preview.yourmark.ai/'
    } else {
      setError('Invalid access code. Please contact your project manager.')
    }
  }

  if (isAuthenticated) {
    // Redirect to preview.yourmark.ai
    window.location.href = 'https://preview.yourmark.ai/'
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Redirecting to preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <span className="text-4xl font-bold text-emerald-600">YourMark.ai</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Preview Access</h1>
          <p className="text-gray-600">Enter your access code to view the preview</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium mb-2">
                  Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="accessCode"
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="pl-10"
                    placeholder="Enter access code"
                    required
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full" size="lg">
                Access Preview
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-primary hover:underline inline-flex items-center">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Preview
