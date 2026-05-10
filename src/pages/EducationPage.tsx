import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppNavbar, BackLink, ArticleCard, PageHeaderCard, PaginationBar } from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'
import heroImage from '../assets/hero.png'

type ArticleCategory = 'Semua' | 'Tips' | 'Hukum' | 'Cara Lapor'

export type Article = {
  id: string
  title: string
  excerpt: string
  category: string
  imageUrl: string
}

const articles: Article[] = [
  { id: '1', title: '5 Cara Agar Tidak Terjerat Pinjol (Pinjaman Online)', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Tips', imageUrl: heroImage },
  { id: '2', title: 'Tren Pinjol Meningkat, Warganet Ingatkan Bahaya', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Edukasi', imageUrl: heroImage },
  { id: '3', title: 'Ada Peningkatan, Utang Pinjol di Indonesia Capai Rp 80 Triliun', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Hukum', imageUrl: heroImage },
  { id: '4', title: 'Tren Pinjol Meningkat, Warganet Ingatkan Bahaya', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Cara Lapor', imageUrl: heroImage },
  { id: '5', title: 'Ada Peningkatan, Utang Pinjol di Indonesia Capai Rp 80 Triliun', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Edukasi', imageUrl: heroImage },
  { id: '6', title: '5 Cara Agar Tidak Terjerat Pinjol (Pinjaman Online)', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Tips', imageUrl: heroImage },
  { id: '7', title: 'Ada Peningkatan, Utang Pinjol di Indonesia Capai Rp 80 Triliun', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Hukum', imageUrl: heroImage },
  { id: '8', title: '5 Cara Agar Tidak Terjerat Pinjol (Pinjaman Online)', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Tips', imageUrl: heroImage },
  { id: '9', title: 'Tren Pinjol Meningkat, Warganet Ingatkan Bahaya', excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.', category: 'Cara Lapor', imageUrl: heroImage },
]

const filterTabs: ArticleCategory[] = ['Semua', 'Tips', 'Hukum', 'Cara Lapor']

export function EducationPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<ArticleCategory>('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)

  const filteredArticles = useMemo(() => {
    if (activeFilter === 'Semua') return articles
    return articles.filter((a) => a.category === activeFilter)
  }, [activeFilter])

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredArticles.slice(start, start + pageSize)
  }, [filteredArticles, currentPage, pageSize])

  const totalPages = Math.ceil(filteredArticles.length / pageSize)

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title="Pusat Edukasi & Bantuan"
          description="Pelajari hak-hak Anda, cara menghadapi pinjol ilegal, dan langkah pelaporan yang tepat"
        />

        <section
          className="flex flex-col gap-6 p-6 border bg-white shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveFilter(tab); setCurrentPage(1) }}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderRadius: tokens.radius.full,
                  backgroundColor: activeFilter === tab ? tokens.colors.brand.primary : tokens.colors.white,
                  color: activeFilter === tab ? tokens.colors.white : tokens.colors.slate[600],
                  border: `1px solid ${activeFilter === tab ? tokens.colors.brand.primary : tokens.colors.slate[200]}`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Article Grid */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                imageUrl={article.imageUrl}
                onClick={() => navigate(paths.articleDetail, { state: { article } })}
              />
            ))}
          </div>

          {/* Pagination */}
          <PaginationBar
            showingCount={paginatedArticles.length}
            totalCount={filteredArticles.length}
            itemLabel="articles"
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[9, 18, 27]}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1) }}
          />
        </section>
      </main>
    </div>
  )
}