import { Link } from 'react-router-dom'
import { Brain, Palette, TrendingUp, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const LandingPage = () => {
  const services = [
    {
      icon: Brain,
      title: 'AI Solutions',
      description: 'Cutting-edge artificial intelligence implementations tailored to your business needs. From machine learning to automation.',
      features: ['Custom AI Models', 'Process Automation', 'Data Analytics', 'Predictive Insights']
    },
    {
      icon: Palette,
      title: 'Design Excellence',
      description: 'Beautiful, user-centric design that elevates your brand and creates memorable experiences for your customers.',
      features: ['UI/UX Design', 'Brand Identity', 'Web Design', 'Mobile Apps']
    },
    {
      icon: TrendingUp,
      title: 'Management Consulting',
      description: 'Strategic guidance to transform your operations, optimize processes, and drive sustainable growth.',
      features: ['Digital Transformation', 'Process Optimization', 'Change Management', 'Strategic Planning']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Consulting</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">
            Make Your Mark
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-700">
            Transform Your Business
            <br />
            With AI & Design
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            We combine artificial intelligence, exceptional design, and strategic management 
            to help companies innovate, scale, and succeed in the digital age.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-started">
              <Button size="lg" className="text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/client-portal">
              <Button size="lg" variant="outline" className="text-lg">
                Client Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">
              Comprehensive solutions to elevate your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose YourMark.ai?</h2>
              <p className="text-lg text-gray-600 mb-6">
                We're not just consultants—we're your partners in digital transformation. 
                Our unique blend of AI expertise, design thinking, and management acumen 
                sets us apart.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Proven Track Record</h3>
                    <p className="text-gray-600">Delivered successful projects for companies of all sizes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Cutting-Edge Technology</h3>
                    <p className="text-gray-600">Always at the forefront of AI and design innovation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Client-Centric Approach</h3>
                    <p className="text-gray-600">Your success is our priority, every step of the way</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Logo className="h-32 w-32 mx-auto mb-4" />
                <p className="text-2xl font-semibold text-gray-800">Innovation Meets Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how we can help you achieve your goals with AI, design, and strategic consulting.
          </p>
          <Link to="/schedule-consultation">
            <Button size="lg" className="text-lg">
              Let's Have A Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold">YourMark.ai</span>
          </div>
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

export default LandingPage
