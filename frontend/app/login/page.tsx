'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, Lock, User, ArrowRight, LogIn, Sparkles } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // ฟังก์ชันช่วยตั้งค่าธีม SweetAlert ให้เหมือนกัน
  const toast = (icon: 'success' | 'error', title: string, text?: string) => {
    return Swal.fire({
      icon,
      title,
      text,
      background: '#1e293b', // slate-800
      color: '#fff',
      confirmButtonColor: '#3b82f6', // blue-500
      timer: icon === 'success' ? 2000 : undefined,
      showConfirmButton: icon !== 'success',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch(`${API_URL}/api/member/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      const responseData = await res.json()

      if (res.ok) {
        // เก็บ Token
        localStorage.setItem('token', responseData.data.token)
        
        await toast('success', 'Welcome Back!', 'เข้าสู่ระบบสำเร็จ กำลังพาคุณไปหน้าคอร์สเรียน...')
        
        // ใช้ router.push เพื่อความรวดเร็ว
        router.push('/courses')
      } else {
        toast('error', 'Login Failed', responseData.message || 'Username หรือ Password ไม่ถูกต้อง')
      }
    } catch (error) {
      toast('error', 'Connection Error', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่ภายหลัง')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
            <BookOpen size={22} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            EduFlow
          </span>
        </Link>
        <Link
          href="/register"
          className="text-sm text-gray-400 hover:text-blue-400 transition flex items-center gap-1"
        >
          No account? <span className="text-blue-400 font-semibold ml-1">Sign up →</span>
        </Link>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="relative">
            {/* Glow border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30" />

            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles size={28} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-gray-400">Sign in to continue your learning journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                    <input
                      type="text"
                      required
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Enter your username"
                      className="relative w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition focus:bg-white/8"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter your password"
                      className="relative w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-500 outline-none transition focus:bg-white/8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full group overflow-hidden rounded-xl py-3.5 font-bold text-base transition"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-400/20 to-transparent transition" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social placeholders */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Register link */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Dont have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Stats below card */}
          <div className="flex justify-center gap-8 mt-8 text-center">
            <div>
              <div className="text-lg font-bold text-white">1,000+</div>
              <div className="text-xs text-gray-500">Learners</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-lg font-bold text-white">50+</div>
              <div className="text-xs text-gray-500">Courses</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-lg font-bold text-white">95%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}