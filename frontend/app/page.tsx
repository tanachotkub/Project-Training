'use client'

import Link from 'next/link'
import { BookOpen, TrendingUp, Zap, ArrowRight, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EduFlow
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-blue-400 transition">
                Features
              </a>
              <a href="#courses" className="hover:text-blue-400 transition">
                Courses
              </a>
              <a href="#stats" className="hover:text-blue-400 transition">
                Stats
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-semibold border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-semibold transition transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-sm font-semibold">
                  ✨ Learn Better. Grow Faster.
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Master New Skills with{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    EduFlow
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Join thousands of learners discovering their potential. Access high-quality
                  courses from expert instructors and track your progress in real-time.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  Start Learning
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-lg font-bold text-lg border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition flex items-center justify-center gap-2 group"
                >
                  Browse Courses
                  <BookOpen size={20} />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold">1,000+</div>
                  <div className="text-gray-400">Active Learners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-gray-400">Expert Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold text-center mb-4">Ready to Level Up?</h3>
                <p className="text-gray-300 text-center">
                  Begin your learning journey today and unlock your potential
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EduFlow?</h2>
            <p className="text-xl text-gray-400">Everything you need to learn effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 hover:border-blue-400/50 transition transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/40 transition">
                <BookOpen size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comprehensive Courses</h3>
              <p className="text-gray-400">
                Access a wide range of carefully curated courses designed by industry experts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 hover:border-blue-400/50 transition transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/40 transition">
                <TrendingUp size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-gray-400">
                Monitor your learning journey with detailed progress analytics and milestones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 hover:border-blue-400/50 transition transform hover:scale-105">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/40 transition">
                <Zap size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Learn at Your Pace</h3>
              <p className="text-gray-400">
                Flexible learning with video lessons, resources, and interactive content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-400">Start learning from our most popular courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Course Card 1 */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 hover:border-blue-400/50 transition">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 group-hover:translate-x-full transition-transform duration-500" />
                <div className="text-6xl">📱</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Web Development</h3>
                <p className="text-gray-400 text-sm mb-4">Learn HTML, CSS, and JavaScript</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold">4.8 (120)</span>
                  </div>
                  <span className="text-sm text-gray-400">12 lessons</span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 hover:border-blue-400/50 transition">
              <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 group-hover:translate-x-full transition-transform duration-500" />
                <div className="text-6xl">🎨</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">UI/UX Design</h3>
                <p className="text-gray-400 text-sm mb-4">Master modern design principles</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold">4.9 (95)</span>
                  </div>
                  <span className="text-sm text-gray-400">15 lessons</span>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 hover:border-blue-400/50 transition">
              <div className="h-48 bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 group-hover:translate-x-full transition-transform duration-500" />
                <div className="text-6xl">⚙️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Backend Development</h3>
                <p className="text-gray-400 text-sm mb-4">Node.js and database design</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold">4.7 (110)</span>
                  </div>
                  <span className="text-sm text-gray-400">18 lessons</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-bold text-lg transition transform hover:scale-105 group"
            >
              Explore All Courses
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                1000+
              </div>
              <p className="text-gray-400">Students Learning</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                50+
              </div>
              <p className="text-gray-400">Expert Courses</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                4.8★
              </div>
              <p className="text-gray-400">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                95%
              </div>
              <p className="text-gray-400">Completion Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-transparent" />

            {/* Content */}
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of successful learners who have already started their journey with
                EduFlow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-lg transition transform hover:scale-105"
                >
                  Start Learning Today
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg transition"
                >
                  View Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <span className="text-xl font-bold">EduFlow</span>
              </div>
              <p className="text-gray-400 text-sm">Empowering learners worldwide</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/courses" className="hover:text-blue-400 transition">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-blue-400 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#stats" className="hover:text-blue-400 transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 EduFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-blue-400 transition">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                GitHub
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}