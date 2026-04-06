'use client'

import Link from 'next/link'
import { BookOpen, Eye, EyeOff, ArrowRight, CheckCircle2, User, Lock } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2' // นำเข้า SweetAlert2

const passwordStrength = (password: string) => {
  if (password.length === 0) return { score: 0, label: '', color: '' }
  if (password.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' }
  if (password.length < 8) return { score: 2, label: 'Weak', color: 'bg-orange-500' }
  if (/(?=.*[A-Z])(?=.*[0-9])/.test(password)) return { score: 4, label: 'Strong', color: 'bg-green-500' }
  return { score: 3, label: 'Good', color: 'bg-blue-400' }
}

export default function Register() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })

  const strength = passwordStrength(form.password)
  const passwordsMatch = form.confirm && form.password === form.confirm
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Client-side Validation
    if (form.password !== form.confirm) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      })
      return
    }

    setIsLoading(true)

    try {
      // 2. Call API (ปรับ endpoint เป็น /api/register ตามสเปก)
      const res = await fetch(`${API_URL}/api/member/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: form.username, 
            password: form.password 
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        Swal.fire({
          icon: 'success',
          title: 'Registered!',
          text: 'Your account has been created successfully.',
          background: '#1e293b',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        // จัดการกรณี Error จาก API (เช่น Username ซ้ำ)
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.message || 'Something went wrong',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Please check your internet connection.',
        background: '#1e293b',
        color: '#fff'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
            <BookOpen size={22} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">EduFlow</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-blue-400 transition">
          Already a member? <span className="text-blue-400 font-semibold ml-1">Sign in →</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {success ? (
            /* Success State View */
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur opacity-30" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CheckCircle2 size={40} className="text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Account Created! 🎉</h2>
                <p className="text-gray-400 mb-8">Welcome, <span className="text-white font-semibold">{form.username}</span>!</p>
                <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-bold transition group">
                  Sign In Now <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Form View */
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                  <p className="text-gray-400 text-sm">Start your journey with EduFlow today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Username</label>
                    <div className="relative flex items-center">
                      <User size={16} className="absolute left-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3.5 pl-10 text-white outline-none transition"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3.5 pl-10 pr-12 text-white outline-none transition"
                        placeholder="At least 6 characters"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Strength Indicator */}
                    {form.password && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map((bar) => (
                          <div key={bar} className={`h-1 flex-1 rounded-full ${bar <= strength.score ? strength.color : 'bg-white/10'}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-4 text-gray-500" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 pl-10 pr-12 text-white outline-none transition ${
                          form.confirm ? (passwordsMatch ? 'border-green-500/50' : 'border-red-500/50') : 'border-white/10'
                        }`}
                        placeholder="Re-type password"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 text-gray-500">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group overflow-hidden rounded-xl py-3.5 font-bold text-white transition-all disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:scale-105 transition-transform" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Create Account <ArrowRight size={18} /></>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}