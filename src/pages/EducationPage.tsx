import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppNavbar, BackLink, ArticleCard, PageHeaderCard, PaginationBar, Spinner } from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { paths } from '../router/paths'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import heroImage from '../assets/hero.png'
import { buildArticleImageUrl } from '../utils/article-image'

export type Article = {
  id: string
  title: string
  excerpt: string
  category: string
  imageUrl: string
  author?: string
  publishedAt?: string | null
  slug?: string
}

type ApiArticle = {
  id_artikel: number
  judul: string
  slug?: string
  kategori: string
  author?: string
  summary?: string
  gambar?: string | null
  status?: string
  published_at?: string | null
  created_at?: string | null
}

const filterTabs = ['Semua', 'Edukasi', 'Tips & Panduan'] as const

function toArticle(item: ApiArticle): Article {
  return {
    id: String(item.id_artikel),
    title: item.judul,
    excerpt: item.summary ?? '',
    category: item.kategori || 'Edukasi',
    imageUrl: buildArticleImageUrl(item.gambar) ?? heroImage,
    author: item.author,
    publishedAt: item.published_at ?? item.created_at ?? null,
    slug: item.slug,
  }
}

export function EducationPage() {
  const navigate = useNavigate()
  const handleLogout = useLogoutRedirect()
  const [activeFilter, setActiveFilter] = useState<(typeof filterTabs)[number]>('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadArticles() {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${apiConfig.baseUrl}/api/artikel?per_page=50`, { signal: controller.signal })
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Gagal memuat artikel')
        }
        setArticles((json.data ?? []).map(toArticle))
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message || 'Gagal memuat artikel')
        }
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
    return () => controller.abort()
  }, [])

  const filteredArticles = useMemo(() => {
    if (activeFilter === 'Semua') return articles
    return articles.filter((a) => a.category === activeFilter)
  }, [activeFilter, articles])

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredArticles.slice(start, start + pageSize)
  }, [filteredArticles, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize))

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />
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
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveFilter(tab)
                  setCurrentPage(1)
                }}
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

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category}
                    imageUrl={article.imageUrl}
                    author={article.author}
                    publishedAt={article.publishedAt ?? undefined}
                    onClick={() => navigate(`/education/article/${encodeURIComponent(article.slug ?? article.id)}`)}
                  />
                ))}
              </div>

              <PaginationBar
                showingCount={paginatedArticles.length}
                totalCount={filteredArticles.length}
                itemLabel="articles"
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[9, 18, 27]}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size: number) => {
                  setPageSize(size)
                  setCurrentPage(1)
                }}
              />
            </>
          )}
        </section>
      </main>
    </div>
  )
}
