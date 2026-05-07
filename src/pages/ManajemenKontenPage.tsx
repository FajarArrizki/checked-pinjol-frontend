import { useState, useMemo } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import {
  TableList,
  PaginationBar,
  SearchBar,
  Button,
  Modal,
  Input
} from '../components'
import { tokens } from '../config/tokens'

// Quill configuration for CMS-like experience
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'clean'],
    [{ 'color': [] }, { 'background': [] }],
  ],
}




type Article = {
  id: number
  no: number
  heading: string
  shortDescription: string
  author: string
  lastUpdate: string
  summary?: string
  content?: string
}

export function ManajemenKontenPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    heading: '',
    shortDescription: '',
    author: '',
    summary: '',
    content: ''
  })

  const [articles, setArticles] = useState<Article[]>([
    { 
      id: 1, 
      no: 1, 
      heading: 'Cara Memastikan Aplikasi Pinjaman Terdaftar Resmi di OJK', 
      shortDescription: 'Panduan verifikasi legalitas pinjol.',
      author: 'Budi Santoso', 
      lastUpdate: '24/2/2026',
      summary: 'Panduan lengkap cara memverifikasi legalitas platform pinjol melalui kanal resmi OJK.',
      content: 'Pastikan Anda selalu memeriksa daftar penyelenggara fintech lending yang berizin melalui website resmi OJK di ojk.go.id atau melalui kontak WhatsApp OJK. Banyak aplikasi mencatut logo OJK padahal tidak terdaftar.'
    },
    { 
      id: 2, 
      no: 2, 
      heading: 'Langkah Aman Membuat Laporan Pinjol Bermasalah', 
      shortDescription: 'Cara lapor pinjol ilegal ke Satgas Pasti.',
      author: 'Siti Aminah', 
      lastUpdate: '23/2/2026',
      summary: 'Tahapan menyusun bukti dan kronologi untuk pelaporan ke Satgas Pasti.',
      content: 'Simpan semua bukti percakapan, tangkapan layar tagihan, dan rekaman telepon jika ada intimidasi. Susun kronologi secara runut sebelum mengirimkan laporan ke email waspadainvestasi@ojk.go.id.'
    },
  ])

  const filteredArticles = useMemo(() => {
    return articles.filter(article => 
      article.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [articles, searchQuery])

  const handleAddArticle = () => {
    if (formData.heading && formData.author) {
      setArticles([
        ...articles,
        {
          id: Date.now(),
          no: articles.length + 1,
          heading: formData.heading,
          shortDescription: formData.shortDescription,
          author: formData.author,
          summary: formData.summary,
          content: formData.content,
          lastUpdate: new Date().toLocaleDateString('id-ID')
        }
      ])
      setFormData({ heading: '', shortDescription: '', author: '', summary: '', content: '' })
      setIsModalOpen(false)
    }
  }


  const handleUpdateArticle = () => {
    if (selectedArticle) {
      setArticles(articles.map(article => 
        article.id === selectedArticle.id ? selectedArticle : article
      ))
    }
  }

  const handleDeleteArticle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setArticles(articles.filter(article => article.id !== id))
    if (selectedArticle?.id === id) setSelectedArticle(null)
  }

  return (
    <div className="relative w-full h-full flex flex-row overflow-hidden">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col gap-6 transition-all duration-300 p-[15px] overflow-y-auto custom-scrollbar ${selectedArticle ? 'mr-[400px]' : ''}`}>
        <TableList
          title=""
          headerContent={
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[800] }}>
                Manajemen Konten Edukasi
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="w-full sm:w-auto sm:max-w-xs flex-1">
                  <SearchBar 
                    placeholder="Cari artikel..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button onClick={() => setIsModalOpen(true)}>+ Add New Article</Button>
                </div>
              </div>
            </div>
          }
          columns={[
            { key: 'no', label: 'No' },
            { key: 'heading', label: 'Heading' },
            { key: 'author', label: 'Author' },
            { key: 'lastUpdate', label: 'Last Update' },
            { key: 'action', label: 'Action' },
          ]}
          pagination={
            <PaginationBar
              showingCount={filteredArticles.length}
              totalCount={articles.length}
              itemLabel="articles"
              currentPage={1}
              totalPages={1}
              pageSize={10}
              pageSizeOptions={[10, 25, 50]}
            />
          }
        >
          {filteredArticles.map((article) => (
            <tr 
              key={article.id} 
              onClick={() => setSelectedArticle({ ...article })}
              className={`border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${selectedArticle?.id === article.id ? 'bg-brand-softStrong' : ''}`}
            >
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{article.no}</td>
              <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[800] }}>
                {article.heading}
              </td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{article.author}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{article.lastUpdate}</td>
              <td className="px-4 py-4 text-sm font-medium">
                <button 
                  onClick={(e) => handleDeleteArticle(e, article.id)}
                  className="text-danger-base hover:text-danger-dark transition-colors" 
                  style={{ color: tokens.colors.danger.base }}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </TableList>
      </div>

      {/* Detail Sidebar (Right Side) - Editable */}
      <div 
        className={`absolute -top-[15px] -bottom-[15px] -right-[15px] h-[calc(100%+30px)] w-[400px] bg-white border-l border-slate-200 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] transition-transform duration-300 z-10 flex flex-col ${selectedArticle ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedArticle && (
          <>
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Edit Artikel</h2>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attachment Image</label>
                <div className="group relative aspect-video w-full rounded-xl bg-slate-50 flex flex-col items-center justify-center overflow-hidden border border-slate-200 border-dashed hover:bg-slate-100 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[10px] text-slate-400 font-medium">Click to change attachment</p>
                </div>
              </div>

              <Input 
                label="Judul Artikel"
                value={selectedArticle.heading}
                onChange={(e) => setSelectedArticle({ ...selectedArticle, heading: e.target.value })}
              />

              <Input 
                label="Short Description"
                placeholder="Deskripsi singkat untuk preview..."
                value={selectedArticle.shortDescription}
                onChange={(e) => setSelectedArticle({ ...selectedArticle, shortDescription: e.target.value })}
              />

              <Input 
                label="Penulis (Author)"
                value={selectedArticle.author}
                onChange={(e) => setSelectedArticle({ ...selectedArticle, author: e.target.value })}
              />

              <div className="flex flex-col gap-1.5 quill-container">
                <label className="text-sm font-medium text-slate-700">Ringkasan (Summary)</label>
                <ReactQuill 
                  theme="snow"
                  value={selectedArticle.summary}
                  onChange={(val) => setSelectedArticle({ ...selectedArticle, summary: val })}
                  modules={quillModules}
                  className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
                  placeholder="Ringkasan singkat artikel..."
                />
              </div>

              <div className="flex flex-col gap-1.5 quill-container">
                <label className="text-sm font-medium text-slate-700">Konten Artikel</label>
                <ReactQuill 
                  theme="snow"
                  value={selectedArticle.content}
                  onChange={(val) => setSelectedArticle({ ...selectedArticle, content: val })}
                  modules={quillModules}
                  className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-50 flex gap-3">
              <Button className="flex-1" variant="secondary" onClick={() => setSelectedArticle(null)}>Batal</Button>
              <Button className="flex-1" onClick={handleUpdateArticle}>Simpan Perubahan</Button>
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Article"
        description="Lengkapi formulir di bawah untuk mempublikasikan artikel edukasi baru."
        maxWidth="max-w-2xl"
      >
        <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar mt-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Attachment Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            <Input 
              label="Judul Artikel" 
              placeholder="Contoh: Cara aman meminjam online..." 
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Short Description" 
                placeholder="Deskripsi singkat..." 
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
              <Input 
                label="Penulis (Author)" 
                placeholder="Nama penulis..." 
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5 quill-container">
              <label className="text-sm font-medium text-slate-700">Ringkasan (Summary)</label>
              <ReactQuill 
                theme="snow"
                placeholder="Berikan ringkasan singkat isi artikel..."
                value={formData.summary}
                onChange={(val) => setFormData({ ...formData, summary: val })}
                modules={quillModules}
                className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
              />
            </div>

            <div className="flex flex-col gap-1.5 quill-container">
              <label className="text-sm font-medium text-slate-700">Konten Artikel</label>
              <ReactQuill 
                theme="snow"
                placeholder="Tuliskan isi lengkap artikel di sini..."
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
                modules={quillModules}
                className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
          <Button onClick={handleAddArticle}>Publikasikan Artikel</Button>
        </div>
      </Modal>
    </div>
  )
}

