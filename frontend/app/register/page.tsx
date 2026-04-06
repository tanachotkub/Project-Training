'use client'

import Link from 'next/link'
import { BookOpen, Eye, EyeOff, ArrowRight, CheckCircle2, User, Lock } from 'lucide-react'
import { useState } from 'react'

const passwordStrength = (password: string) => {
  if (password.length === 0) return { score: 0, label: '', color: '' }
  if (password.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' }
  if (password.length < 8) return { score: 2, label: 'Weak', color: 'bg-orange-500' }
  if (/(?=.*[A-Z])(?=.*[0-9])/.test(password)) return { score: 4, label: 'Strong', color: 'bg-green-500' }
  return { score: 3, label: 'Good', color: 'bg-blue-400' }
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })

  const strength = passwordStrength(form.password)
  const passwordsMatch = form.confirm && form.password === form.confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      alert('Passwords do not match')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/member/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        alert(data.message || 'Registration failed')
      }
    } catch {
      alert('Connection error. Please try again.')
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
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
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
          href="/login"
          className="text-sm text-gray-400 hover:text-blue-400 transition flex items-center gap-1"
        >
          Already a member? <span className="text-blue-400 font-semibold ml-1">Sign in →</span>
        </Link>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Success State */}
          {success ? (
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
                <p className="text-gray-400 mb-8">
                  Welcome to EduFlow, <span className="text-white font-semibold">{form.username}</span>!<br />
                  Your learning journey starts now.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-bold transition group"
                >
                  Sign In to EduFlow
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Card */
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30" />

              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <User size={28} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                  <p className="text-gray-400">Join 1,000+ learners on EduFlow</p>
                </div>

                {/* Perks */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: '🎓', label: '50+ Courses' },
                    { icon: '📊', label: 'Track Progress' },
                    { icon: '🏆', label: 'Certificates' },
                  ].map((perk) => (
                    <div
                      key={perk.label}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <span className="text-xl">{perk.icon}</span>
                      <span className="text-xs text-gray-400 font-medium">{perk.label}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 block">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                      <div className="relative flex items-center">
                        <User size={16} className="absolute left-4 text-gray-500 z-10" />
                        <input
                          type="text"
                          required
                          minLength={3}
                          value={form.username}
                          onChange={(e) => setForm({ ...form, username: e.target.value })}
                          placeholder="Choose a username"
                          className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3.5 pl-10 text-white placeholder-gray-500 outline-none transition"
                        />
                        {form.username.length >= 3 && (
                          <CheckCircle2 size={16} className="absolute right-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    {form.username.length > 0 && form.username.length < 3 && (
                      <p className="text-xs text-orange-400">Username must be at least 3 characters</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 block">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                      <div className="relative flex items-center">
                        <Lock size={16} className="absolute left-4 text-gray-500 z-10" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Create a password"
                          className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3.5 pl-10 pr-12 text-white placeholder-gray-500 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-gray-500 hover:text-gray-300 transition"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Password strength */}
                    {form.password && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                bar <= strength.score ? strength.color : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          strength.score <= 1 ? 'text-red-400' :
                          strength.score === 2 ? 'text-orange-400' :
                          strength.score === 3 ? 'text-blue-400' : 'text-green-400'
                        }`}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 block">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition" />
                      <div className="relative flex items-center">
                        <Lock size={16} className="absolute left-4 text-gray-500 z-10" />
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          required
                          value={form.confirm}
                          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                          placeholder="Confirm your password"
                          className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 pl-10 pr-12 text-white placeholder-gray-500 outline-none transition ${
                            form.confirm
                              ? passwordsMatch
                                ? 'border-green-500/50'
                                : 'border-red-500/50'
                              : 'border-white/10 focus:border-blue-500/50'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 text-gray-500 hover:text-gray-300 transition"
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {form.confirm && (
                          <div className="absolute right-10">
                            {passwordsMatch ? (
                              <CheckCircle2 size={16} className="text-green-400 mr-2" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                    {form.confirm && !passwordsMatch && (
                      <p className="text-xs text-red-400">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      id="terms"
                      className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full group overflow-hidden rounded-xl py-3.5 font-bold text-base transition mt-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/10 to-transparent transition" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Create My Account
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Login link */}
                <p className="text-center text-gray-500 text-sm mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}