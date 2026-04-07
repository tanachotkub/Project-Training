'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, Save, Plus, Video, FileText, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

type Tab = 'details' | 'preview'

export default function CreateLessonPage() {
  const router = useRouter()
  const params = useParams()
  const [token, setToken] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('details')
  const [form, setForm] = useState({ title: '', content: '', videoUrl: '' })
  const [isFree, setIsFree] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // --- Auth Check ---
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) router.push('/login')
    else setToken(t)
  }, [router])

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const isValidUrl = (url: string) => {
    if (!url) return true
    try { new URL(url); return true } catch { return false }
  }

  const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  const isValid = form.title.trim().length >= 3 && form.content.trim().length >= 10 && isValidUrl(form.videoUrl)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/courses/${params.id}/lessons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...form, isFree }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'เพิ่มบทเรียนสำเร็จ! ✨',
          text: `บทเรียน "${form.title}" ถูกเพิ่มเข้าสู่คอร์สแล้ว`,
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'ตกลง'
        })
        // ล้างฟอร์มเพื่อให้เพิ่มบทเรียนต่อไปได้ทันที
        setForm({ title: '', content: '', videoUrl: '' })
        setIsFree(false)
        setTab('details')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: data.message || 'ไม่สามารถเพิ่มบทเรียนได้',
          background: '#1e293b',
          color: '#fff',
        })
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'การเชื่อมต่อขัดข้อง', background: '#1e293b', color: '#fff' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition">
              <BookOpen size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">EduFlow</span>
          </Link>
          <Link href={`/courses/${params.id}/edit`} className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Editor
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 py-10 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Plus size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Add New Lesson</h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                Course ID: <span className="text-blue-400 font-mono">#{params.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition" />
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-white/10 bg-white/5">
              {[
                { key: 'details' as Tab, label: 'Lesson Details', icon: <FileText size={16} /> },
                { key: 'preview' as Tab, label: 'Live Preview', icon: <Eye size={16} /> },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${
                    tab === t.key ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {t.icon} {t.label}
                  {tab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-4px_12px_rgba(59,130,246,0.5)]" />}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {tab === 'details' ? (
                <div className="p-8 space-y-7">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Lesson Title <span className="text-red-400">*</span></label>
                    <input
                      type="text" required value={form.title}
                      onChange={(e) => update('title', e.target.value)}
                      placeholder="เช่น ตอนที่ 1: พื้นฐาน Next.js"
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 outline-none transition text-base shadow-inner"
                    />
                  </div>

                  {/* Video URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                      <Video size={16} className="text-blue-400" /> Video URL (YouTube)
                    </label>
                    <input
                      type="url" value={form.videoUrl}
                      onChange={(e) => update('videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 outline-none transition ${
                        form.videoUrl && !isValidUrl(form.videoUrl) ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-300">Content / Description</label>
                      <span className="text-xs text-gray-500 font-mono">{form.content.length} characters</span>
                    </div>
                    <textarea
                      required rows={8} value={form.content}
                      onChange={(e) => update('content', e.target.value)}
                      placeholder="เนื้อหาบทเรียน... สามารถใส่ Code หรือคำอธิบายเพิ่มเติมได้"
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 outline-none transition resize-none leading-relaxed font-mono text-sm"
                    />
                  </div>

                  {/* Free Preview Toggle */}
                  <div className="flex items-center justify-between p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isFree ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {isFree ? <Eye size={20} /> : <EyeOff size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">Free Preview</p>
                        <p className="text-xs text-gray-400">อนุญาตให้ผู้ที่ยังไม่ได้ซื้อคอร์สเข้าชมบทเรียนนี้ได้</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFree(!isFree)}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isFree ? 'bg-green-500' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${isFree ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Preview Tab */
                <div className="p-8 space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold tracking-tight">{form.title || "Lesson Title Preview"}</h2>
                  
                  {form.videoUrl && isValidUrl(form.videoUrl) ? (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl">
                      <iframe
                        src={getYouTubeEmbed(form.videoUrl) || ''}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-white/10 p-12 text-center text-gray-500">
                      <Video size={48} className="mx-auto mb-3 opacity-20" />
                      <p>ไม่มีวิดีโอให้แสดงตัวอย่าง</p>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-black mb-4">Content Preview</p>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                      {form.content || "ไม่มีเนื้อหาบทเรียน..."}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="px-8 py-6 border-t border-white/10 bg-white/3 flex items-center gap-4">
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
                      <Save size={20} /> Save & Add Lesson
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}