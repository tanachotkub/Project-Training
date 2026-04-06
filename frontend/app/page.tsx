'use client'

import Link from 'next/link'
import { BookOpen, TrendingUp, Zap, ArrowRight, Star, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // นำเข้า useRouter

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter() // สร้าง instance ของ router

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1]
          const decodedJson = atob(payloadBase64)
          const payload = JSON.parse(decodedJson)
          
          // ตรวจสอบ Claim Name (รองรับทั้งมาตรฐาน SOAP และแบบทั่วไป)
          const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || payload.name
          
          if (nameClaim) {
            setUsername(nameClaim)
          }
        } catch (error) {
          console.error('Invalid token format')
          localStorage.removeItem('token')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUsername(null)
    router.refresh() // รีเฟรชหน้าเพื่อให้ UI อัปเดต
  }

  // ฟังก์ชันช่วยตัดสินใจว่าจะส่ง User ไปหน้าไหน
  const getStartLink = () => (username ? '/courses' : '/register')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
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
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EduFlow
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/courses" className="hover:text-blue-400 transition">All Courses</Link>
              <a href="#features" className="hover:text-blue-400 transition">Features</a>
              <a href="#stats" className="hover:text-blue-400 transition">Stats</a>
            </div>

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
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-sm font-semibold text-blue-300">
                  {username ? `Welcome back, ${username}! 👋` : '✨ Learn Better. Grow Faster.'}
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Master New Skills with{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    EduFlow
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {username 
                    ? "Ready to continue your journey? Pick up where you left off or explore new skills from our expert-led courses."
                    : "Join thousands of learners discovering their potential. Access high-quality courses from expert instructors and track your progress in real-time."
                  }
                </p>
              </div>

              {/* CTA Buttons - แก้ไขจุดที่ให้ไปหน้าคอร์สถ้า Login แล้ว */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={getStartLink()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                >
                  {username ? 'Go to My Courses' : 'Start Learning'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="/courses"
                  className="px-8 py-4 rounded-lg font-bold text-lg border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition flex items-center justify-center gap-2"
                >
                  Browse All
                  <BookOpen size={20} />
                </Link>
              </div>

              <div className="flex gap-8 pt-8 grayscale opacity-70">
                 {/* Stats icons or numbers... */}
                 <div><div className="text-3xl font-bold">1,000+</div><div className="text-gray-400 text-sm">Learners</div></div>
                 <div><div className="text-3xl font-bold">50+</div><div className="text-gray-400 text-sm">Courses</div></div>
                 <div><div className="text-3xl font-bold">95%</div><div className="text-gray-400 text-sm">Success</div></div>
              </div>
            </div>

            {/* Right - Illustration Card */}
            <div className="relative h-96 lg:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-blue-500/10 to-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full flex flex-col items-center justify-center group overflow-hidden">
                <div className="text-8xl mb-6 transition transform group-hover:scale-110 group-hover:rotate-12 duration-500">
                    {username ? '📚' : '🚀'}
                </div>
                <h3 className="text-3xl font-bold text-center mb-4">
                    {username ? 'Keep Going!' : 'Ready to Level Up?'}
                </h3>
                <p className="text-gray-400 text-center max-w-xs">
                    {username 
                        ? 'You are doing great. Check out your enrolled courses and finish your goals.' 
                        : 'Begin your learning journey today and unlock your potential with our platform.'}
                </p>
                {username && (
                    <Link href="/courses" className="mt-8 text-blue-400 font-semibold hover:underline">View my enrollments →</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features... (ส่วนนี้คงเดิม) */}

      {/* CTA Section ด้านล่าง */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-4xl font-bold mb-6">
                {username ? 'Continue Your Success' : 'Ready to Transform Your Career?'}
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of successful learners who have already started their journey with EduFlow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={getStartLink()}
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-lg transition transform hover:scale-105 shadow-xl"
                >
                  {username ? 'Go to Courses' : 'Start Learning Today'}
                </Link>
                {!username && (
                    <Link href="/login" className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg transition">
                        Login
                    </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer... (ส่วนนี้คงเดิม) */}
    </div>
  )
}