import { useEffect, useMemo, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import {
  TableList,
  PaginationBar,
  SearchBar,
  Button,
  Input,
  BuktiLampiran,
} from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { useAuth } from '../auth/AuthContext'
import { buildArticleImageUrl } from '../utils/article-image'

type ArticleStatus = 'draft' | 'published' | 'archived'

type Article = {
  id_artikel: number
  judul: string
  slug: string
  kategori: string
  author: string | null
  summary: string | null
  isi_artikel: string | null
  gambar: string | null
  status: ArticleStatus
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  nama_penulis?: string | null
}

type ArticleForm = {
  judul: string
  kategori: string
  author: string
  summary: string
  isi_artikel: string
  status: ArticleStatus
}

type Mode = 'list' | 'create' | 'edit'
type StatusOption = ArticleStatus

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'clean'],
    [{ color: [] }, { background: [] }],
  ],
}

const emptyForm: ArticleForm = {
  judul: '',
  kategori: 'Tips & Panduan',
  author: '',
  summary: '',
  isi_artikel: '',
  status: 'draft',
}

const STATUS_OPTIONS: Array<{ value: ArticleStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const articleEditorStyle = {
  minHeight: '260px',
}

const summaryStyle = {
  minHeight: '180px',
}

type PreviewFile = {
  file: File | null
  previewUrl: string | null
}

export function ManajemenKontenPage() {
  const { token } = useAuth()
  const [mode, setMode] = useState<Mode>('list')
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<ArticleForm>(emptyForm)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusSavingId, setStatusSavingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState<PreviewFile>({ file: null, previewUrl: null })

  useEffect(() => {
    if (!token) return

    let cancelled = false
    setLoading(true)
    setError('')

    fetch(`${apiConfig.baseUrl}/api/artikel?per_page=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json().then((json) => ({ response, json })))
      .then(({ response, json }) => {
        if (cancelled) return
        if (!response.ok || !json.success) {
          throw new Error(json?.message ?? 'Gagal memuat artikel')
        }

        setArticles(Array.isArray(json.data) ? json.data : [])
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat artikel')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, success])

  useEffect(() => {
    return () => {
      if (imageFile.previewUrl) URL.revokeObjectURL(imageFile.previewUrl)
    }
  }, [imageFile.previewUrl])

  useEffect(() => {
    if (!success && !error) return

    const timeoutId = window.setTimeout(() => {
      setSuccess('')
      setError('')
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [success, error])

  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      article.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.author ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [articles, searchQuery])

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredArticles.slice(start, start + pageSize)
  }, [filteredArticles, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize))

  const openCreate = () => {
    setMode('create')
    setSelectedId(null)
    setSelectedArticle(null)
    setForm(emptyForm)
    setImageFile({ file: null, previewUrl: null })
    setError('')
    setSuccess('')
  }

  const openEdit = (article: Article) => {
    setMode('edit')
    setSelectedId(article.id_artikel)
    setSelectedArticle(article)
    setForm({
      judul: article.judul ?? '',
      kategori: article.kategori ?? 'Tips & Panduan',
      author: article.author ?? '',
      summary: article.summary ?? '',
      isi_artikel: article.isi_artikel ?? '',
      status: article.status ?? 'draft',
    })
    setImageFile({ file: null, previewUrl: null })
    setError('')
    setSuccess('')
  }

  const closeSidebar = () => {
    setMode('list')
    setSelectedArticle(null)
    setSelectedId(null)
    setError('')
  }

  const onPickImage = (file: File | null) => {
    if (imageFile.previewUrl) URL.revokeObjectURL(imageFile.previewUrl)
    setImageFile({ file, previewUrl: file ? URL.createObjectURL(file) : null })
  }

  const buildImageUrl = (path: string | null) => {
    return buildArticleImageUrl(path) ?? null
  }

  const saveArticle = async () => {
    if (!token) return

    setSaving(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('judul', form.judul)
      formData.append('kategori', form.kategori)
      formData.append('author', form.author)
      formData.append('summary', form.summary)
      formData.append('isi_artikel', form.isi_artikel)
      formData.append('status', form.status)

      if (imageFile.file) {
        formData.append('gambar', imageFile.file)
      } else if (selectedArticle?.gambar) {
        formData.append('gambar_existing', selectedArticle.gambar)
      }

      const url = mode === 'edit' && selectedId !== null
        ? `${apiConfig.baseUrl}/api/admin/artikel/${selectedId}`
        : `${apiConfig.baseUrl}/api/admin/artikel`

      const response = await fetch(url, {
        method: mode === 'edit' ? 'POST' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menyimpan artikel')
      }

      setSuccess(mode === 'edit' ? 'Artikel berhasil diperbarui' : 'Artikel berhasil dipublikasikan')
      setMode('list')
      setSelectedArticle(null)
      setSelectedId(null)
      setForm(emptyForm)
      setImageFile({ file: null, previewUrl: null })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Gagal menyimpan artikel')
    } finally {
      setSaving(false)
    }
  }

  const updateArticleStatus = async (articleId: number, status: StatusOption) => {
    if (!token) return

    setStatusSavingId(articleId)
    setError('')

    try {
      const formData = new FormData()
      formData.append('status', status)

      const response = await fetch(`${apiConfig.baseUrl}/api/admin/artikel/${articleId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal memperbarui status artikel')
      }

      setArticles((current) => current.map((item) => (item.id_artikel === articleId ? { ...item, status } : item)))
      setSuccess('Status artikel berhasil diperbarui')
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Gagal memperbarui status artikel')
    } finally {
      setStatusSavingId(null)
    }
  }

  if (!token) return null

  if (mode === 'create' || mode === 'edit') {
    return (
      <div className="flex h-full w-full flex-col gap-6 overflow-y-auto p-[15px]">
        <button type="button" onClick={closeSidebar} className="inline-flex items-center gap-2 self-start text-sm font-medium" style={{ color: tokens.colors.brand.primary }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>

        <h1 className="text-2xl font-bold" style={{ color: tokens.colors.slate[900] }}>{mode === 'create' ? 'Tambah Artikel Edukasi' : 'Edit Artikel Edukasi'}</h1>

        <div className="flex flex-col gap-5 border bg-white p-6" style={{ borderRadius: tokens.radius.lg, borderColor: tokens.colors.slate[200], boxShadow: tokens.shadow.sm }}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Gambar Artikel</label>
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <label className="inline-flex cursor-pointer items-center rounded-xl border px-4 py-2 text-sm font-medium" style={{ borderColor: tokens.colors.slate[200], color: tokens.colors.slate[700] }}>
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] ?? null)} />
              </label>
              <span className="text-sm text-slate-500">{imageFile.file ? imageFile.file.name : 'Gunakan gambar cover untuk artikel'}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <BuktiLampiran
                title={imageFile.file?.name ?? 'Current image'}
                size={imageFile.file ? `${Math.max(1, Math.round(imageFile.file.size / 1024))} KB` : 'Preview'}
                imageUrl={imageFile.previewUrl ?? buildImageUrl(selectedArticle?.gambar ?? null) ?? undefined}
              />
            </div>
          </div>

          <Input label="Judul Artikel" placeholder="Contoh: Cara aman meminjam online..." value={form.judul} onChange={(e) => setForm((curr) => ({ ...curr, judul: e.target.value }))} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Kategori" placeholder="Tips & Panduan" value={form.kategori} onChange={(e) => setForm((curr) => ({ ...curr, kategori: e.target.value }))} />
            <Input label="Penulis" placeholder="Nama penulis" value={form.author} onChange={(e) => setForm((curr) => ({ ...curr, author: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Status</label>
            <select value={form.status} onChange={(e) => setForm((curr) => ({ ...curr, status: e.target.value as ArticleStatus }))} className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1AA86E]" style={{ borderColor: tokens.colors.slate[200] }}>
              {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Ringkasan</label>
            <textarea value={form.summary} onChange={(e) => setForm((curr) => ({ ...curr, summary: e.target.value }))} className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1AA86E]" style={{ borderColor: tokens.colors.slate[200], ...summaryStyle }} placeholder="Berikan ringkasan singkat isi artikel..." />
          </div>
          <div className="flex flex-col gap-1.5 quill-container">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Konten Artikel</label>
            <ReactQuill theme="snow" value={form.isi_artikel} onChange={(val) => setForm((curr) => ({ ...curr, isi_artikel: val }))} modules={quillModules} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50" style={articleEditorStyle} />
          </div>

          {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <Button onClick={saveArticle} disabled={saving} className="w-full py-3 font-semibold">{saving ? 'Menyimpan...' : mode === 'create' ? 'Publikasikan Artikel' : 'Simpan Perubahan'}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-row overflow-hidden relative">
      <div className={`flex-1 flex flex-col gap-6 p-[15px] overflow-y-auto custom-scrollbar ${selectedArticle ? 'mr-[400px]' : ''}`}>
        <TableList
          title=""
          headerContent={
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[700] }}>Manajemen Konten Edukasi</h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="w-full flex-1 sm:max-w-xs">
                  <SearchBar placeholder="Cari artikel..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Button onClick={openCreate}>+ Add New Article</Button>
              </div>
            </div>
          }
          columns={[
            { key: 'no', label: 'No' },
            { key: 'heading', label: 'Heading' },
            { key: 'author', label: 'Author' },
            { key: 'lastUpdate', label: 'Last Update' },
            { key: 'status', label: 'Status' },
            { key: 'action', label: 'Action' },
          ]}
          pagination={
            <PaginationBar
              showingCount={paginatedArticles.length}
              totalCount={filteredArticles.length}
              itemLabel="articles"
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 25, 50]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size: number) => { setPageSize(size); setCurrentPage(1) }}
            />
          }
        >
          {loading ? (
            <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={6}>Memuat artikel...</td></tr>
          ) : paginatedArticles.length === 0 ? (
            <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={6}>Tidak ada artikel.</td></tr>
          ) : paginatedArticles.map((article, index) => (
            <tr key={article.id_artikel} onClick={() => openEdit(article)} className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50">
              <td className="px-4 py-4 text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>{(currentPage - 1) * pageSize + index + 1}</td>
              <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[700] }}>{article.judul}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{article.author ?? '-'}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{article.updated_at ? new Date(article.updated_at).toLocaleDateString('id-ID') : '-'}</td>
              <td className="px-4 py-4 text-sm">
                <span className="inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize" style={{ borderColor: tokens.colors.slate[200], backgroundColor: tokens.colors.slate[50], color: tokens.colors.slate[700] }}>{article.status}</span>
              </td>
              <td className="px-4 py-4 text-sm font-medium">
                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={article.status}
                    disabled={statusSavingId === article.id_artikel}
                    onChange={(e) => updateArticleStatus(article.id_artikel, e.target.value as ArticleStatus)}
                    className="w-full rounded-xl border px-3 py-2 text-xs outline-none transition-colors focus:ring-2 focus:ring-[#1AA86E]"
                    style={{ borderColor: tokens.colors.slate[200], backgroundColor: tokens.colors.white, color: tokens.colors.slate[700] }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </TableList>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p> : null}
      </div>

      <div className={`absolute -top-[15px] -bottom-[15px] -right-[15px] h-[calc(100%+30px)] w-[400px] bg-white border-l border-slate-200 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] transition-transform duration-300 z-10 flex flex-col ${selectedArticle ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedArticle && (
          <>
            <div className="flex items-center justify-between border-b border-slate-50 p-6">
              <h2 className="text-lg font-bold text-slate-800">Edit Artikel</h2>
              <button onClick={() => setSelectedArticle(null)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Preview Gambar</h3>
                <BuktiLampiran title={selectedArticle.judul} size={selectedArticle.gambar ? 'Gambar artikel' : 'No image'} imageUrl={buildImageUrl(selectedArticle.gambar) ?? undefined} />
              </div>

              <Input label="Judul Artikel" value={form.judul} onChange={(e) => setForm((curr) => ({ ...curr, judul: e.target.value }))} />
              <Input label="Kategori" value={form.kategori} onChange={(e) => setForm((curr) => ({ ...curr, kategori: e.target.value }))} />
              <Input label="Penulis (Author)" value={form.author} onChange={(e) => setForm((curr) => ({ ...curr, author: e.target.value }))} />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Upload Photo</label>
                <input type="file" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-[#1AA86E] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Status</label>
                <select value={form.status} onChange={(e) => setForm((curr) => ({ ...curr, status: e.target.value as ArticleStatus }))} className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1AA86E]" style={{ borderColor: tokens.colors.slate[200] }}>
                  {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Ringkasan</label>
                <textarea value={form.summary} onChange={(e) => setForm((curr) => ({ ...curr, summary: e.target.value }))} className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1AA86E]" style={{ borderColor: tokens.colors.slate[200], ...summaryStyle }} />
              </div>

              <div className="flex flex-col gap-1.5 quill-container">
                <label className="text-sm font-medium" style={{ color: tokens.colors.slate[700] }}>Konten Artikel</label>
                <ReactQuill theme="snow" value={form.isi_artikel} onChange={(val) => setForm((curr) => ({ ...curr, isi_artikel: val }))} modules={quillModules} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50" style={articleEditorStyle} />
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-50 p-6">
              <Button className="flex-1" variant="secondary" onClick={() => setSelectedArticle(null)}>Batal</Button>
              <Button className="flex-1" onClick={saveArticle} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
