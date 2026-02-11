import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Mail, Phone, User, Building, MessageSquare } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const ScheduleConsultation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Thank You!</h1>
            <p className="text-xl text-gray-600 mb-8">
              We've received your request. Our team will reach out to you within 24 hours to schedule your conversation.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                <strong>What's Next?</strong><br />
                You'll receive a confirmation email shortly with available time slots. 
                We look forward to discussing how we can help transform your business!
              </p>
            </div>
            <Link to="/">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Let's Have A Conversation
            </h1>
            <p className="text-xl text-gray-600">
              Let's discuss how we can help transform your business with AI, design, and strategic consulting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">30 Minutes</h3>
                <p className="text-sm text-gray-600">Free conversation</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-sm text-gray-600">Choose a time that works for you</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Obligation</h3>
                <p className="text-sm text-gray-600">Just a friendly conversation about your needs</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Fill out the form and we'll be in touch soon</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      Service Interest *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="ai">AI Solutions</option>
                      <option value="design">Design Excellence</option>
                      <option value="management">Management Consulting</option>
                      <option value="all">All Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Tell us about your project
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Describe your needs and goals..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Discovery Call</h4>
                      <p className="text-sm text-gray-600">
                        We'll discuss your business challenges, goals, and vision for the future.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Custom Proposal</h4>
                      <p className="text-sm text-gray-600">
                        Receive a tailored strategy and roadmap designed specifically for your needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Get Started</h4>
                      <p className="text-sm text-gray-600">
                        Once approved, we'll begin transforming your vision into reality.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">Questions?</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Feel free to reach out directly if you have any questions before scheduling.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>contact@yourmark.ai</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            AI, Design & Management Consulting
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 YourMark.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ScheduleConsultation
