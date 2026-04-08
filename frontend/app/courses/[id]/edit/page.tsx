'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, Save, Trash2, Plus, BookOpenCheck, Users, AlertCircle, CheckCircle2, AlertTriangle, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

// --- Helper สำหรับ SweetAlert ธีม EduFlow ---
const toast = (icon: 'success' | 'error' | 'warning', title: string, text?: string) => {
  return Swal.fire({
    icon,
    title,
    text,
    background: '#1e293b',
    color: '#fff',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#ef4444',
    showConfirmButton: icon !== 'success',
    timer: icon === 'success' ? 2000 : undefined,
  })
}

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  
  const [form, setForm] = useState({ title: '', description: '', category: 'Development', level: 'Beginner' })
  const [lessons, setLessons] = useState<any[]>([])
  const [studentCount, setStudentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // 1. ตรวจสอบ Auth
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      router.push('/login')
    } else {
      setToken(t)
    }
  }, [])

  // 2. ดึงข้อมูล Course
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!token || !params.id) return
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/api/courses/${params.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (!response.ok) throw new Error()
        const data = await response.json()
        
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Development',
          level: data.level || 'Beginner'
        })
        setLessons(data.lessons || [])
        setStudentCount(data.student_count || 0)
      } catch (error) {
        toast('error', 'Error', 'ไม่สามารถโหลดข้อมูลคอร์สได้')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourseData()
  }, [params.id, token])

  // 3. จัดการการเปลี่ยนแปลง (Check Valid ภายในตัว)
  const update = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setIsDirty(true)
  }

  // ปรับเงื่อนไขให้ยืดหยุ่นขึ้น (หรือเช็คตามความเหมาะสม)
  const isValid = form.title.trim().length >= 2 && form.description.trim().length >= 5

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    
    setIsSaving(true)
    try {
      const res = await fetch(`${API_URL}/api/courses/${params.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        await toast('success', 'Saved!', 'อัปเดตข้อมูลคอร์สเรียบร้อยแล้ว')
        setIsDirty(false)
      } else {
        toast('error', 'Failed', 'ไม่สามารถบันทึกข้อมูลได้')
      }
    } catch {
      toast('error', 'Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDeleteCourse = async () => {
    const result = await Swal.fire({
      title: 'ลบคอร์สเรียน?',
      text: `คุณแน่ใจหรือไม่ที่จะลบ "${form.title}"? ข้อมูลทั้งหมดจะหายไปถาวร`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      background: '#1e293b',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#475569',
    })

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/courses/${params.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (res.ok) {
          await toast('success', 'Deleted', 'ลบคอร์สเรียนสำเร็จ')
          router.push('/dashboard')
        }
      } catch {
        toast('error', 'Error', 'ลบไม่สำเร็จ กรุณาลองใหม่')
      }
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
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
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <Users size={14} className="text-blue-400" />
                <span className="text-xs font-medium">{studentCount} Students</span>
             </div>
             <button onClick={() => router.push('/dashboard')} className="text-sm font-medium hover:text-blue-400 transition">Dashboard</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-4xl font-extrabold tracking-tight">Edit Course</h1>
            <p className="text-blue-400 font-medium mt-1">ตั้งค่าและจัดการเนื้อหาบทเรียนของคุณ</p>
          </div>
          <button
            onClick={confirmDeleteCourse}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
          >
            <Trash2 size={18} /> Delete Course
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition" />
              <form onSubmit={handleSave} className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-2">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Save size={20}/></div>
                   <h2 className="text-xl font-bold">General Information</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Course Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3.5 outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Description</label>
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 outline-none transition resize-none"
                  />
                </div>

                {/* Categories & Levels (เหมือนเดิมแต่ปรับ UI เล็กน้อย) */}
                {/* ... ส่วนเลือก Category และ Level ... */}

                <button
                  type="submit"
                  disabled={!isDirty || !isValid || isSaving}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    !isDirty || !isValid 
                      ? 'bg-slate-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] shadow-lg shadow-blue-500/25'
                  }`}
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Save Changes</>}
                </button>
                
                {!isDirty && <p className="text-center text-xs text-gray-500">ยังไม่มีการเปลี่ยนแปลงข้อมูล</p>}
              </form>
            </div>
          </div>

          {/* Right Column: Lessons */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="font-bold flex items-center gap-2">
                  <BookOpenCheck className="text-blue-400" size={20} />
                  Lessons ({lessons.length})
                </h3>
                <Link href={`/courses/${params.id}/lessons/create`} className="p-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition text-white">
                  <Plus size={18} />
                </Link>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition group">
                    <span className="text-xs font-bold text-gray-600 group-hover:text-blue-500 transition">{String(idx+1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration || '00:00'}</p>
                    </div>
                    <div className="flex gap-1">
                       <button className="p-2 text-gray-500 hover:text-blue-400 transition"><Save size={14}/></button>
                       <button className="p-2 text-gray-500 hover:text-red-400 transition"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}