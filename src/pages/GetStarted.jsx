import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MessageSquare, Calendar, Rocket } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const GetStarted = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Initial Conversation',
      description: 'We start with a conversation to understand your business needs, challenges, and goals.',
      duration: '30-60 minutes'
    },
    {
      icon: Calendar,
      title: 'Strategy Session',
      description: 'Our team develops a customized strategy and roadmap tailored to your specific requirements.',
      duration: '1-2 weeks'
    },
    {
      icon: Rocket,
      title: 'Implementation',
      description: 'We execute the plan with regular updates and collaboration to ensure success.',
      duration: 'Ongoing'
    }
  ]

  const services = [
    'AI Solutions & Automation',
    'Web & Mobile Design',
    'Brand Identity Development',
    'Digital Transformation',
    'Process Optimization',
    'Strategic Consulting'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">
            Let's Get Started
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your business with AI, design, and strategic consulting. 
            Here's how we'll work together to achieve your goals.
          </p>
          <Link to="/3">
            <Button size="lg" className="text-lg">
              Let's Have A Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">
              A proven approach to deliver exceptional results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="relative">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <CardHeader>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-emerald-600 font-medium">
                      Timeline: {step.duration}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">What We Offer</h2>
              <p className="text-lg text-gray-600 mb-6">
                Comprehensive solutions designed to help your business thrive in the digital age.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Begin?</h3>
              <p className="text-gray-700 mb-6">
                Schedule a free conversation to discuss your project and discover how we can help you achieve your goals.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">No obligation, completely free</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">30-minute conversation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom recommendations for your business</span>
                </li>
              </ul>
              <Link to="/3">
                <Button size="lg" className="w-full">
                  Schedule Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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

export default GetStarted
