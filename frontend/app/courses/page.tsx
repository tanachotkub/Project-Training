'use client'

import Link from 'next/link'
import { BookOpen, Search, Star, Users, Clock, ChevronDown, Zap, Filter, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

// ---- Types ----
interface Course {
  id: number
  title: string
  description: string
  createdBy: string
  lessonCount: number
  studentCount: number
  rating: number
  ratingCount: number
  category: string
  level: string
  duration: string
  emoji: string
  gradient: string
}

// ---- Mock data (replace with real API fetch) ----
const MOCK_COURSES: Course[] = [
  { id: 1, title: 'Web Development Fundamentals', description: 'Learn HTML, CSS, and JavaScript from scratch to build modern websites.', createdBy: 'Alex Chen', lessonCount: 12, studentCount: 320, rating: 4.8, ratingCount: 120, category: 'Development', level: 'Beginner', duration: '8h 30m', emoji: '🌐', gradient: 'from-blue-600 to-cyan-500' },
  { id: 2, title: 'UI/UX Design Mastery', description: 'Master modern design principles, Figma workflows, and user research techniques.', createdBy: 'Sara Kim', lessonCount: 15, studentCount: 210, rating: 4.9, ratingCount: 95, category: 'Design', level: 'Intermediate', duration: '10h 15m', emoji: '🎨', gradient: 'from-purple-600 to-pink-500' },
  { id: 3, title: 'Backend with Node.js', description: 'Build scalable REST APIs with Node.js, Express, and database integration.', createdBy: 'Mike Turner', lessonCount: 18, studentCount: 275, rating: 4.7, ratingCount: 110, category: 'Development', level: 'Intermediate', duration: '12h 00m', emoji: '⚙️', gradient: 'from-green-600 to-emerald-500' },
  { id: 4, title: 'Data Science with Python', description: 'Explore data analysis, visualization, and machine learning foundations.', createdBy: 'Emma Liu', lessonCount: 20, studentCount: 190, rating: 4.6, ratingCount: 88, category: 'Data', level: 'Advanced', duration: '15h 45m', emoji: '📊', gradient: 'from-orange-600 to-yellow-500' },
  { id: 5, title: 'React & Next.js Deep Dive', description: 'Build production-grade React apps with Next.js, server components, and more.', createdBy: 'Alex Chen', lessonCount: 22, studentCount: 350, rating: 4.9, ratingCount: 140, category: 'Development', level: 'Intermediate', duration: '14h 20m', emoji: '⚛️', gradient: 'from-cyan-600 to-blue-500' },
  { id: 6, title: 'Digital Marketing 101', description: 'Learn SEO, social media, email campaigns, and analytics from real campaigns.', createdBy: 'Jordan Park', lessonCount: 10, studentCount: 160, rating: 4.5, ratingCount: 72, category: 'Marketing', level: 'Beginner', duration: '6h 00m', emoji: '📣', gradient: 'from-rose-600 to-pink-500' },
  { id: 7, title: 'DevOps & CI/CD Pipelines', description: 'Master Docker, Kubernetes, GitHub Actions, and cloud deployment workflows.', createdBy: 'Mike Turner', lessonCount: 16, studentCount: 130, rating: 4.7, ratingCount: 60, category: 'DevOps', level: 'Advanced', duration: '11h 30m', emoji: '🚀', gradient: 'from-slate-600 to-indigo-500' },
  { id: 8, title: 'Graphic Design Essentials', description: 'Adobe Illustrator, Photoshop, typography, and color theory for beginners.', createdBy: 'Sara Kim', lessonCount: 14, studentCount: 180, rating: 4.8, ratingCount: 82, category: 'Design', level: 'Beginner', duration: '9h 10m', emoji: '🖼️', gradient: 'from-violet-600 to-purple-500' },
  { id: 9, title: 'Mobile App with Flutter', description: 'Build cross-platform iOS & Android apps with Flutter and Dart.', createdBy: 'Emma Liu', lessonCount: 19, studentCount: 145, rating: 4.6, ratingCount: 66, category: 'Development', level: 'Intermediate', duration: '13h 00m', emoji: '📱', gradient: 'from-teal-600 to-cyan-500' },
]

const CATEGORIES = ['All', 'Development', 'Design', 'Data', 'Marketing', 'DevOps']
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

const levelColor: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  Intermediate: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Advanced: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All Levels')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate API fetch
  useEffect(() => {
    // Replace with: fetch('/api/courses').then(r => r.json()).then(setCourses)
    const t = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filtered = courses
    .filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'All' || c.category === category
      const matchLevel = level === 'All Levels' || c.level === level
      return matchSearch && matchCategory && matchLevel
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.studentCount - a.studentCount
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'newest') return b.id - a.id
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
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

      {/* Hero Header */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-semibold text-blue-300">
            <Zap size={14} />
            {MOCK_COURSES.length} Courses Available
          </div>
          <h1 className="text-5xl font-bold">
            Find Your Next{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Skill
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Explore expert-led courses across development, design, data, and more.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl" />
            <div className="relative flex items-center bg-white/5 border border-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 gap-3 focus-within:border-blue-500/50 transition">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-500 hover:text-white transition text-sm">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  category === cat
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2 shrink-0">
              {/* Level Filter */}
              <div className="relative">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-300 outline-none cursor-pointer hover:border-white/30 transition"
                >
                  {LEVELS.map((l) => <option key={l} value={l} className="bg-slate-800">{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-300 outline-none cursor-pointer hover:border-white/30 transition"
                >
                  <option value="popular" className="bg-slate-800">Most Popular</option>
                  <option value="rating" className="bg-slate-800">Highest Rated</option>
                  <option value="newest" className="bg-slate-800">Newest</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-semibold">{filtered.length}</span> courses
            {search && <> for <span className="text-blue-400">{search}</span></>}
            {category !== 'All' && <> in <span className="text-blue-400">{category}</span></>}
          </p>
        </div>

        {isLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/10 animate-pulse">
                <div className="h-44 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty */
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All Levels') }}
              className="px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group rounded-2xl overflow-hidden bg-white/3 border border-white/10 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Thumbnail */}
                <div className={`relative h-44 bg-gradient-to-br ${course.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl drop-shadow-lg">{course.emoji}</span>
                  </div>
                  {/* Level badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${levelColor[course.level]}`}>
                    {course.level}
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/40 backdrop-blur-sm border border-white/10 text-white">
                    {course.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {course.createdBy.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-400 truncate">{course.createdBy}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} className="fill-yellow-400" />
                      <span className="font-bold text-white">{course.rating}</span>
                      <span className="text-gray-500">({course.ratingCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users size={13} />
                      <span>{course.studentCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <BookOpen size={13} />
                      <span>{course.lessonCount} lessons</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock size={13} />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600" />
          <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">Want to teach on EduFlow?</h3>
              <p className="text-blue-100">Create and share your knowledge with thousands of learners.</p>
            </div>
            <Link
              href="/register"
              className="shrink-0 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-2 group"
            >
              Become an Instructor
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}