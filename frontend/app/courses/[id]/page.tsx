'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  BookOpen, Star, Users, Clock, PlayCircle,
  CheckCircle2, Lock, Award,
  BarChart2, Globe, Zap, LogOut, User, ChevronRight, ArrowLeft, Eye
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2' // เพิ่ม SweetAlert2

// ---- Types ----
interface Lesson {
  id: number
  title: string
  content: string
  video_url: string
  duration: string
  is_free: boolean // สัมพันธ์กับหน้า Create Lesson
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

      console.log("Course Data from API:", data); // <-- ลองเช็คตรงนี้ว่า studentCount เป็น 0 หรือเปล่า?

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
        body: JSON.stringify({ courseId: Number(params.id) }),
      })

      if (res.ok) {
        setIsEnrolled(true)
        
        // --- ส่วนที่เพิ่มใหม่: อัปเดตจำนวนนักเรียนในหน้าจอทันที ---
        setCourse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            studentCount: (prev.studentCount || 0) + 1 // บวกเพิ่ม 1
          }
        })
        // --------------------------------------------------

        Swal.fire({
          icon: 'success',
          title: 'ลงทะเบียนสำเร็จ!',
          text: 'ยินดีต้อนรับเข้าสู่บทเรียนครับ 🚀',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        })
      } else {
        const d = await res.json()
        Swal.fire({ icon: 'error', title: 'Oops...', text: d.message || 'Enrollment failed', background: '#1e293b', color: '#fff' })
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'การเชื่อมต่อขัดข้อง', background: '#1e293b', color: '#fff' })
    } finally {
      setEnrolling(false)
    }
  }
  // ฟังก์ชันคลิกเข้าดูบทเรียน (สัมพันธ์กับ ID ของบทเรียน)
  const handleLessonClick = (lesson: Lesson) => {
    if (isEnrolled || lesson.is_free) {
        // พาไปหน้าเรียนโดยส่ง Course ID และ Lesson ID
      router.push(`/courses/${params.id}/lessons/${lesson.id}`)
    } else {
      Swal.fire({
        icon: 'lock',
        title: 'เฉพาะนักเรียนเท่านั้น',
        text: 'กรุณาลงทะเบียนเรียนก่อนเข้าชมบทเรียนพรีเมียมครับ',
        background: '#1e293b',
        color: '#fff',
        confirmButtonText: 'ลงทะเบียนเลย'
      }).then((result) => {
        if (result.isConfirmed && !isEnrolled) handleEnroll()
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!course) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">😕</div>
      <h2 className="text-3xl font-bold">Course Not Found</h2>
      <Link href="/courses" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
        <ArrowLeft size={18} /> Back to Courses
      </Link>
    </div>
  )

  const visibleLessons = showAllLessons ? (course.lessons || []) : (course.lessons || []).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pb-24">
      
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


      {/* Hero Section */}
      <div className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-blue-400/60 text-sm font-bold uppercase tracking-widest">
                <Zap size={14} fill="currentColor"/> Enrollment Open
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">{course.title}</h1>
            <p className="text-lg text-gray-400 leading-relaxed">{course.description}</p>
            
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2"><Star size={16} className="text-yellow-500 fill-yellow-500"/> <b>{course.rating || '4.9'}</b></div>
                <div className="flex items-center gap-2"><Users size={16} className="text-blue-400"/> <b>{(course.studentCount || 0).toLocaleString()} students</b></div>
                <div className="flex items-center gap-2 text-emerald-400"><Globe size={16}/> <b>{course.language || 'Thai'}</b></div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Outcomes */}
          <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400"><Award size={24} /></div>
              สิ่งที่คุณจะได้เรียนรู้
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(course.whatYouLearn) ? course.whatYouLearn : []).map((item, i) => (
                <div key={i} className="flex gap-3 text-gray-300 items-start">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-1" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum สัมพันธ์กับ Lessons */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold">เนื้อหาหลักสูตร</h2>
                    <p className="text-sm text-gray-500">{course.lessons?.length || 0} บทเรียนคุณภาพ</p>
                </div>
                <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black">
                    {course.duration || 'Flexible'}
                </div>
            </div>

            <div className="space-y-3">
              {visibleLessons.map((lesson, idx) => (
                <div 
                  key={lesson.id} 
                  onClick={() => handleLessonClick(lesson)}
                  className={`flex items-center gap-5 p-5 rounded-2xl border transition-all group cursor-pointer ${
                    lesson.is_free ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/5 border-white/10 hover:border-blue-500/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-blue-400">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-200 group-hover:text-white transition">{lesson.title}</h4>
                        {lesson.is_free && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-black rounded uppercase">Preview</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12}/> {lesson.duration || '10:00'}</span>
                    </div>
                  </div>
                  
                  {isEnrolled || lesson.is_free ? (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition">
                      <PlayCircle size={20} className="fill-white/20" />
                    </div>
                  ) : (
                    <Lock size={18} className="text-gray-600 mr-2" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Enrollment Card */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl space-y-6">
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-7xl shadow-inner">
               {course.emoji || '🚀'}
            </div>

            <div className="space-y-4">
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">Free</span>
                  <span className="text-gray-500 line-through text-lg">$99.00</span>
               </div>

               {isEnrolled ? (
                  <Link 
                    href={`/courses/${params.id}/learn`}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-sm uppercase transition hover:scale-[1.02]"
                  >
                    เริ่มเรียนเลย <ChevronRight size={18} />
                  </Link>
               ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase transition hover:bg-blue-50 active:scale-95 disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'ลงทะเบียนฟรี'}
                  </button>
               )}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">คอร์สนี้รวมอะไรบ้าง:</p>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Clock size={16} className="text-blue-400"/> เรียนได้ตลอดชีพ
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <BarChart2 size={16} className="text-blue-400"/> ระดับ {course.level || 'Beginner'}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Award size={16} className="text-blue-400"/> มีประกาศนียบัตร
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}