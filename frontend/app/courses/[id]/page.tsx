'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  BookOpen, Star, Users, Clock, PlayCircle,
  CheckCircle2, Lock, Award,
  BarChart2, Globe, Zap, LogOut, User, ChevronRight, ArrowLeft
} from 'lucide-react'
import { useState, useEffect } from 'react'

// ---- Types ----
interface Lesson {
  id: number
  title: string
  content: string
  video_url: string
  duration: string
  is_free: boolean
}

interface CourseDetail {
  id: number
  title: string
  description: string
  long_description?: string
  createdBy?: number
  createdByUsername?: string
  lessons: Lesson[]
  studentCount?: number
  rating?: number
  ratingCount?: number
  level?: string
  language?: string
  duration?: string
  emoji?: string
  whatYouLearn?: string[] | string
  requirements?: string[] | string
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showAllLessons, setShowAllLessons] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    // Auth Logic (Same as Home/Courses)
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || payload.name
        setUsername(nameClaim)
      } catch (e) { console.error("Token error") }
    }

    if (params.id) {
      fetchCourseDetail(params.id as string)
      if (token) checkEnrollmentStatus(params.id as string)
    }
  }, [params.id])

  const fetchCourseDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/courses/${id}`)
      if (!res.ok) throw new Error("Course not found")
      const data = await res.json()

      const formattedData = {
        ...data,
        whatYouLearn: typeof data.whatYouLearn === 'string' ? JSON.parse(data.whatYouLearn) : (data.whatYouLearn || []),
        requirements: typeof data.requirements === 'string' ? JSON.parse(data.requirements) : (data.requirements || [])
      }
      setCourse(formattedData)
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnrollmentStatus = async (courseId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`${API_URL}/api/my-courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const myCourses = await res.json()
        const found = myCourses.some((c: any) => c.id === parseInt(courseId))
        setIsEnrolled(found)
      }
    } catch (e) { console.error("Enrollment check failed") }
  }

  const handleEnroll = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    setEnrolling(true)
    try {
      const res = await fetch(`${API_URL}/api/enrollments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ course_id: course?.id }),
      })

      if (res.ok) {
        setIsEnrolled(true)
        alert('Enrolled successfully!')
      } else {
        const d = await res.json()
        alert(d.message || 'Enrollment failed')
      }
    } catch {
      alert('Connection error.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
    </div>
  )

  if (!course) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">😕</div>
      <h2 className="text-3xl font-bold">Course Not Found</h2>
      <Link href="/courses" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
        <ArrowLeft size={18} /> Back to Courses
      </Link>
    </div>
  )

  const visibleLessons = showAllLessons ? (course.lessons || []) : (course.lessons || []).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pb-24">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
      </nav>

      <div className="h-16" />

      {/* --- Hero Section --- */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          <div className="max-w-3xl space-y-6">
            <nav className="flex items-center gap-2 text-sm text-blue-300/60 mb-4">
              <Link href="/courses" className="hover:text-blue-400">Courses</Link>
              <ChevronRight size={14} />
              <span className="text-blue-300">Detail</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-xl">
              <Zap size={12} fill="currentColor" /> Premium Content
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              {course.title}
            </h1>

            <p className="text-xl text-blue-100/60 leading-relaxed max-w-2xl font-medium">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-8 text-sm pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Rating</span>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                  <b className="text-white text-base">{course.rating ?? '4.8'}</b>
                  <span className="text-gray-500">({course.ratingCount ?? 120})</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Students</span>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <b className="text-white text-base">{(course.studentCount || 0).toLocaleString()}</b>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Language</span>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-emerald-400" />
                  <b className="text-white text-base">{course.language || 'English'}</b>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-lg shadow-lg">
                {course.createdByUsername?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Instructor</p>
                <p className="text-blue-300 font-bold text-lg leading-tight hover:underline cursor-pointer">
                  {course.createdByUsername || 'Expert Instructor'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Outcomes Card */}
          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition" />
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Award size={24} /></div>
              What you will learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {(Array.isArray(course.whatYouLearn) && course.whatYouLearn.length > 0 
                ? course.whatYouLearn 
                : ['Fundamental concepts', 'Real-world projects', 'Best practices', 'Industry workflows']
              ).map((item, i) => (
                <div key={i} className="flex gap-4 items-start text-gray-300 group/item">
                  <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5 group-hover/item:scale-110 transition" />
                  <span className="text-sm font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum Section */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Course Content</h2>
                <p className="text-sm text-gray-500">Structured learning path with {course.lessons?.length || 0} lessons</p>
              </div>
              <div className="text-xs font-black text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-400/20 uppercase tracking-widest">
                {course.duration || 'Flexible Time'}
              </div>
            </div>

            <div className="space-y-3">
              {visibleLessons.length > 0 ? visibleLessons.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center gap-5 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-black text-gray-500 group-hover:text-blue-400 transition shadow-inner">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-200 group-hover:text-white transition">{lesson.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12}/> {lesson.duration || '12:45'}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span>{lesson.is_free ? 'Preview Available' : 'Premium Lesson'}</span>
                    </div>
                  </div>
                  {isEnrolled ? (
                    <div className="p-3 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 group-hover:scale-110 transition">
                      <PlayCircle size={20} className="text-white fill-white/20" />
                    </div>
                  ) : (
                    <div className="p-3 bg-white/5 rounded-full">
                      <Lock size={18} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-gray-500 font-medium">Coming soon: Lessons are being prepared by the instructor.</p>
                </div>
              )}

              {(course.lessons?.length || 0) > 5 && (
                <button 
                  onClick={() => setShowAllLessons(!showAllLessons)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black text-blue-400 uppercase tracking-[0.2em] transition"
                >
                  {showAllLessons ? 'Show Less' : `View all ${course.lessons.length} lessons`}
                </button>
              )}
            </div>
          </section>

          {/* Detailed Description */}
          <section className="border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Course Description</h2>
            <div className="text-gray-400 leading-relaxed text-lg font-medium space-y-4">
              <p>{course.long_description || course.description}</p>
              {!course.long_description && (
                <p>This comprehensive course is designed to take you from a beginner to an advanced level. Through hands-on exercises and real-world examples, you will gain a deep understanding of the subject matter.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Enrollment Card */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-[#1e293b] border border-white/10 rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="bg-slate-900 rounded-[2.2rem] p-6 space-y-8">
              {/* Preview Thumbnail */}
              <div className="aspect-[16/10] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[1.8rem] flex items-center justify-center border border-white/5 relative overflow-hidden group">
                 <span className="text-7xl group-hover:scale-110 transition duration-700">{course.emoji || '🚀'}</span>
                 <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">Free</span>
                    <span className="text-gray-500 line-through font-bold text-lg">$99</span>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black rounded-lg uppercase">
                    Limited Time
                  </div>
                </div>

                {isEnrolled ? (
                  <Link 
                    href={`/courses/${course.id}/learn`}
                    className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg shadow-blue-600/30"
                  >
                    Continue Learning <ChevronRight size={18} />
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="group w-full py-5 bg-white text-slate-900 hover:bg-blue-50 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {enrolling ? (
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <><Zap size={18} className="fill-slate-900"/> Enroll Now</>
                    )}
                  </button>
                )}

                <div className="space-y-4 pt-4 px-2">
                  <p className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Course Includes:</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><Clock size={16}/></div>
                      Full Lifetime Access
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Award size={16}/></div>
                      Certificate of Completion
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><BarChart2 size={16}/></div>
                      {course.level || 'Intermediate'} Level
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}