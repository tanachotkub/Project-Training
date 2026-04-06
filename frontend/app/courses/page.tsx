'use client'

import Link from 'next/link'
import { BookOpen, Search, Star, Users, Clock, User, LogOut, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All Levels')
  const [sortBy, setSortBy] = useState('popular')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const CATEGORIES = ['All', 'Development', 'Design', 'Data', 'Marketing', 'DevOps']
  const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    // 1. เช็ค Auth สำหรับ Navbar (Logic เดียวกับหน้า Home)
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1]
          const decodedJson = atob(payloadBase64)
          const payload = JSON.parse(decodedJson)
          
          const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || payload.name
          
          if (nameClaim) {
            setUsername(nameClaim)
          }
        } catch (e) { 
          console.error("Token error")
          localStorage.removeItem('token')
        }
      }
    }

    checkAuth()
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setCourses(result.data || result)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUsername(null)
    router.push('/login')
  }

  // Logic การ Filter
  const filtered = (courses || [])
    .filter((c) => {
      const titleMatch = c.title?.toLowerCase().includes(search.toLowerCase())
      const descMatch = c.description?.toLowerCase().includes(search.toLowerCase())
      const matchSearch = titleMatch || descMatch
      const matchCategory = category === 'All' || c.category === category
      const matchLevel = level === 'All Levels' || c.level === level
      return matchSearch && matchCategory && matchLevel
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.studentCount - a.studentCount
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  const levelColor: Record<string, string> = {
    Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
    Intermediate: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Advanced: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      
      {/* --- Navigation (เหมือนหน้า Home) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
           <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EduFlow
              </span>
            </Link>
             <div className="flex items-center gap-4">
              {username ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-blue-300 bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-500/30">
                    <User size={18} />
                    <span className="font-medium">{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-red-400/50 text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-6 py-2 rounded-lg font-semibold border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition">
                    Sign In
                  </Link>
                  <Link href="/register" className="hidden sm:block px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-semibold transition transform hover:scale-105">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer สำหรับ Fixed Nav */}
      <div className="h-16" />

      {/* --- Search & Header Section --- */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[120px] -z-10" />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Level up your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Skills</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Choose from over 50 expert-led courses and start your learning journey today.
          </p>
          
          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition" size={20} />
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500/50 focus:bg-white/10 transition shadow-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- Filter Bar (Sticky) --- */}
      <div className="sticky top-16 z-40 bg-slate-900/80 backdrop-blur-md border-y border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  category === cat 
                    ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                    : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none relative">
              <select 
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none appearance-none cursor-pointer focus:border-blue-500/50"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex-1 sm:flex-none relative">
              <select 
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none appearance-none cursor-pointer focus:border-blue-500/50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- Course Grid --- */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((course) => (
              <div key={course.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 flex flex-col shadow-xl">
                {/* Course Image Area */}
                <div className={`h-48 bg-gradient-to-br ${course.gradient || 'from-blue-600 to-cyan-600'} relative flex items-center justify-center overflow-hidden`}>
                  <span className="text-6xl transform group-hover:scale-110 transition duration-500">{course.emoji || '📚'}</span>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${levelColor[course.level]}`}>
                    {course.level}
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-400/10 px-2 py-0.5 rounded">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">{course.description}</p>
                  
                  {/* Meta Info */}
                  <div className="pt-5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold text-sm">{course.rating}</span>
                      <span className="opacity-60">({course.ratingCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5"><Users size={14} /> {course.studentCount}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /> {course.duration}</div>
                  </div>
                  
                  <Link 
                    href={`/courses/${course.id}`}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-center text-sm font-bold transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group/btn"
                  >
                    View Details
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearch(''); setCategory('All'); setLevel('All Levels');}}
              className="mt-6 text-blue-400 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}