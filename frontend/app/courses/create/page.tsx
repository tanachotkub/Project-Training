'use client'

import Link from 'next/link'
import { BookOpen, ArrowLeft, Save, Plus, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function CreateCoursePage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: 'Development', 
    level: 'Beginner' 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const CATEGORIES = ['Development', 'Design', 'Data', 'Marketing', 'DevOps', 'Business', 'Other']
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // --- Auth Check ---
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      router.push('/login')
    } else {
      setToken(t)
    }
  }, [router])

  // --- Helper สำหรับ SweetAlert ---
  const toast = (icon: 'success' | 'error', title: string, text?: string) => {
    return Swal.fire({
      icon,
      title,
      text,
      background: '#1e293b',
      color: '#fff',
      confirmButtonColor: '#3b82f6',
    })
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const isValid = form.title.trim().length >= 2 && form.description.trim().length >= 5

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form), // ส่งครบทั้ง title, description, category, level
      })
      
      const data = await res.json()
      
      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'สร้างคอร์สสำเร็จ! 🎉',
          text: 'คอร์สของคุณถูกสร้างเรียบร้อยแล้ว เริ่มเพิ่มบทเรียนกันเลย',
          background: '#1e293b',
          color: '#fff',
          confirmButtonText: 'ไปที่หน้าจัดการบทเรียน',
          confirmButtonColor: '#3b82f6',
        })
        router.push(`/courses/${data.data.id}/edit`) // หรือไปหน้าเพิ่มบทเรียนโดยตรง
      } else {
        toast('error', 'ล้มเหลว', data.message || 'ไม่สามารถสร้างคอร์สได้')
      }
    } catch {
      toast('error', 'Error', 'การเชื่อมต่อขัดข้อง กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navbar เหมือนหน้า Login/Register */}
      <nav className="relative z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
              <BookOpen size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">EduFlow</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto w-full px-4 py-12 flex-1">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 mb-6 transition group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition" /> Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Plus size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Create New Course</h1>
              <p className="text-gray-400 mt-1">แบ่งปันความรู้ของคุณสู่ผู้เรียนทั่วโลก</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition" />
          <form onSubmit={handleSubmit} className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Simple Progress Bar */}
            <div className="h-1 bg-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500" 
                style={{ width: isValid ? '100%' : form.title ? '50%' : '0%' }}
              />
            </div>

            <div className="p-8 space-y-7">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Course Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="เช่น พัฒนา Web App ด้วย Next.js"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 outline-none transition text-base"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Description <span className="text-red-400">*</span></label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="อธิบายเนื้อหาคร่าวๆ ของคอร์สนี้..."
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => update('category', cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                          form.category === cat ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/10 text-gray-500 hover:border-white/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Level</label>
                  <div className="flex flex-col gap-2">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => update('level', lvl)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition flex items-center justify-between ${
                          form.level === lvl ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10 text-gray-500 hover:border-white/30'
                        }`}
                      >
                        {lvl}
                        {form.level === lvl && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3.5 border border-white/10 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white font-bold transition flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`flex-[2] relative overflow-hidden rounded-xl py-3.5 font-bold transition-all shadow-lg ${
                    !isValid ? 'bg-slate-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] shadow-blue-500/20 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save size={20} /> Create Course
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}