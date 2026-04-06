'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  BookOpen, Star, Users, Clock, ArrowLeft, PlayCircle,
  CheckCircle2, Lock, ChevronDown, ChevronUp, Award,
  BarChart2, Globe, Zap, ArrowRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

// ---- Types ----
interface Lesson {
  id: number
  title: string
  content: string
  videoUrl: string
  duration: string
  isFree: boolean
}

interface CourseDetail {
  id: number
  title: string
  description: string
  longDescription: string
  createdBy: string
  creatorAvatar: string
  lessonCount: number
  studentCount: number
  rating: number
  ratingCount: number
  category: string
  level: string
  duration: string
  emoji: string
  gradient: string
  language: string
  lastUpdated: string
  whatYouLearn: string[]
  requirements: string[]
  lessons: Lesson[]
}

// ---- Mock Data ----
const MOCK_COURSE: CourseDetail = {
  id: 1,
  title: 'Web Development Fundamentals',
  description: 'Learn HTML, CSS, and JavaScript from scratch to build modern websites.',
  longDescription: 'This comprehensive course takes you from zero to a confident web developer. You will learn the building blocks of the web — HTML for structure, CSS for styling, and JavaScript for interactivity. By the end, you will have built multiple real-world projects and have a strong foundation to continue with any frontend framework.',
  createdBy: 'Alex Chen',
  creatorAvatar: 'A',
  lessonCount: 12,
  studentCount: 320,
  rating: 4.8,
  ratingCount: 120,
  category: 'Development',
  level: 'Beginner',
  duration: '8h 30m',
  emoji: '🌐',
  gradient: 'from-blue-600 to-cyan-500',
  language: 'English',
  lastUpdated: 'March 2025',
  whatYouLearn: [
    'Build responsive websites with HTML & CSS',
    'Understand JavaScript core concepts',
    'Work with DOM manipulation and events',
    'Use Flexbox and CSS Grid layouts',
    'Fetch data from APIs with fetch()',
    'Deploy your site to the web',
  ],
  requirements: [
    'A computer with internet access',
    'No prior programming experience needed',
    'Willingness to learn and practice',
  ],
  lessons: [
    { id: 1, title: 'Introduction to Web Development', content: 'Overview of how the web works', videoUrl: '', duration: '12:30', isFree: true },
    { id: 2, title: 'HTML Structure & Semantics', content: 'Learn tags, elements, and document structure', videoUrl: '', duration: '24:15', isFree: true },
    { id: 3, title: 'CSS Basics & Selectors', content: 'Styling elements, specificity, and cascade', videoUrl: '', duration: '30:00', isFree: false },
    { id: 4, title: 'Flexbox Layout System', content: 'Master one-dimensional layouts with Flexbox', videoUrl: '', duration: '28:45', isFree: false },
    { id: 5, title: 'CSS Grid Layouts', content: 'Two-dimensional layout with CSS Grid', videoUrl: '', duration: '32:10', isFree: false },
    { id: 6, title: 'Responsive Design', content: 'Media queries and mobile-first design', videoUrl: '', duration: '26:00', isFree: false },
    { id: 7, title: 'JavaScript Fundamentals', content: 'Variables, data types, functions, and control flow', videoUrl: '', duration: '45:30', isFree: false },
    { id: 8, title: 'DOM Manipulation', content: 'Selecting and modifying HTML elements with JS', videoUrl: '', duration: '38:20', isFree: false },
    { id: 9, title: 'Events & Interactivity', content: 'Click handlers, forms, and user interaction', videoUrl: '', duration: '34:15', isFree: false },
    { id: 10, title: 'Fetching Data from APIs', content: 'Using fetch(), async/await, and JSON', videoUrl: '', duration: '42:00', isFree: false },
    { id: 11, title: 'Project: Build a Portfolio', content: 'Apply everything to build a real portfolio site', videoUrl: '', duration: '55:00', isFree: false },
    { id: 12, title: 'Deployment & Next Steps', content: 'Deploy to Netlify and plan your learning path', videoUrl: '', duration: '18:00', isFree: false },
  ],
}

const levelColor: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  Intermediate: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Advanced: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showAllLessons, setShowAllLessons] = useState(false)
  const [expandedSection, setExpandedSection] = useState<'learn' | 'req' | null>('learn')

  useEffect(() => {
    // Replace with: fetch(`/api/courses/${params.id}`).then(r => r.json()).then(setCourse)
    const t = setTimeout(() => {
      setCourse(MOCK_COURSE)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [params.id])

  const handleEnroll = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: course?.id }),
      })
      if (res.ok) setIsEnrolled(true)
      else {
        const d = await res.json()
        alert(d.message || 'Enrollment failed')
      }
    } catch {
      alert('Connection error.')
    } finally {
      setEnrolling(false)
    }
  }

  const visibleLessons = showAllLessons ? course?.lessons : course?.lessons.slice(0, 5)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <Link href="/courses" className="text-blue-400 hover:text-blue-300 underline">
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              EduFlow
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold border border-blue-400/50 text-blue-400 hover:bg-blue-400/10 rounded-lg transition">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-r ${course.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

        {/* Decorative emoji bg */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 text-[180px] opacity-10 select-none">
          {course.emoji}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6 transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
            Back to Courses
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/20">
                {course.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${levelColor[course.level]}`}>
                {course.level}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{course.title}</h1>
            <p className="text-xl text-gray-200 leading-relaxed">{course.description}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-300">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white text-base">{course.rating}</span>
                <span className="text-gray-400">({course.ratingCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>{course.studentCount.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>{course.lessonCount} lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={14} />
                <span>{course.language}</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center font-bold">
                {course.creatorAvatar}
              </div>
              <div>
                <span className="text-sm text-gray-400">Created by </span>
                <span className="text-sm font-semibold text-blue-300">{course.createdBy}</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">Updated {course.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* What You'll Learn */}
            <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'learn' ? null : 'learn')}
                className="w-full flex items-center justify-between p-6 hover:bg-white/3 transition"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Award size={20} className="text-blue-400" />
                  What You'll Learn
                </h2>
                {expandedSection === 'learn' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              {expandedSection === 'learn' && (
                <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'req' ? null : 'req')}
                className="w-full flex items-center justify-between p-6 hover:bg-white/3 transition"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart2 size={20} className="text-blue-400" />
                  Requirements
                </h2>
                {expandedSection === 'req' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              {expandedSection === 'req' && (
                <div className="px-6 pb-6 space-y-2">
                  {course.requirements.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-300 leading-relaxed">{course.longDescription}</p>
            </div>

            {/* Lessons */}
            <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold">Course Content</h2>
                <span className="text-sm text-gray-400">{course.lessonCount} lessons · {course.duration}</span>
              </div>

              <div className="divide-y divide-white/5">
                {visibleLessons?.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      lesson.isFree
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-blue-300 transition truncate">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{lesson.content}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                      {lesson.isFree ? (
                        <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                          <PlayCircle size={13} />
                          Free
                        </span>
                      ) : (
                        <Lock size={14} className="text-gray-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {(course.lessons.length > 5) && (
                <button
                  onClick={() => setShowAllLessons(!showAllLessons)}
                  className="w-full py-4 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:bg-white/3 transition flex items-center justify-center gap-2 border-t border-white/10"
                >
                  {showAllLessons ? (
                    <><ChevronUp size={16} /> Show less</>
                  ) : (
                    <><ChevronDown size={16} /> Show all {course.lessons.length} lessons</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right — Sticky Enroll Card */}
          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

                {/* Course preview */}
                <div className={`h-40 bg-gradient-to-br ${course.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="relative text-7xl">{course.emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition bg-black/40">
                    <PlayCircle size={48} className="text-white" />
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">Free</div>
                    <div className="text-gray-400 text-sm">Full access to all lessons</div>
                  </div>

                  {isEnrolled ? (
                    <Link
                      href={`/courses/${course.id}/learn`}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition group"
                    >
                      <PlayCircle size={20} />
                      Start Learning
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="relative w-full group overflow-hidden rounded-xl py-4 font-bold text-base transition"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all" />
                      <span className="relative flex items-center justify-center gap-2">
                        {enrolling ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Zap size={18} />
                            Enroll Now — It's Free
                          </>
                        )}
                      </span>
                    </button>
                  )}

                  {/* Course includes */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <p className="text-sm font-semibold text-gray-300">This course includes:</p>
                    {[
                      { icon: <Clock size={14} />, text: `${course.duration} of content` },
                      { icon: <BookOpen size={14} />, text: `${course.lessonCount} lessons` },
                      { icon: <PlayCircle size={14} />, text: 'Video lectures' },
                      { icon: <Globe size={14} />, text: 'Full lifetime access' },
                      { icon: <Award size={14} />, text: 'Certificate of completion' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="text-blue-400">{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      30-day money-back guarantee · No credit card required
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="mt-4 bg-white/3 border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Instructor</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-lg font-bold shrink-0">
                  {course.creatorAvatar}
                </div>
                <div>
                  <p className="font-bold">{course.createdBy}</p>
                  <p className="text-sm text-gray-400">Senior Developer & Educator</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span>4.8 rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={13} />
                  <span>800+ students</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={13} />
                  <span>3 courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}