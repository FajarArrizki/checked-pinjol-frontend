import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppNavbar, BackLink, ArticleCard, PageHeaderCard, Spinner, Button } from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { paths } from '../router/paths'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import heroImage from '../assets/hero.png'
import { buildArticleImageUrl } from '../utils/article-image'

type Article = {
  id: string
  title: string
  excerpt: string
  category: string
  imageUrl: string
  author?: string
  publishedAt?: string | null
  slug?: string
  content?: string
}

type ApiArticle = {
  id_artikel: number
  judul: string
  slug?: string
  kategori: string
  author?: string
  summary?: string
  isi_artikel?: string
  gambar?: string | null
  status?: string
  published_at?: string | null
  created_at?: string | null
}

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
    content: item.isi_artikel,
  }
}

function sortByNewest(items: Article[]): Article[] {
  return [...items].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0

    return bTime - aTime
  })
}

function stripDuplicateArticleHeading(content: string | undefined, title: string): string {
  if (!content?.trim()) return '<p>Konten artikel belum tersedia.</p>'

  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim()
  const headingPattern = new RegExp(`<h[1-6][^>]*>\\s*${escapedTitle}\\s*<\\/h[1-6]>`, 'gi')
  const wrappedHeadingPattern = new RegExp(`<([a-z0-9]+)[^>]*>\\s*<h[1-6][^>]*>\\s*${escapedTitle}\\s*<\\/h[1-6]>\\s*<\\/\\1>`, 'gi')

  return content
    .replace(wrappedHeadingPattern, '')
    .replace(headingPattern, '')
    .trim() || '<p>Konten artikel belum tersedia.</p>'
}

export function ArticleDetailPage() {
  const navigate = useNavigate()
  const { slugOrId } = useParams()
  const handleLogout = useLogoutRedirect()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadArticle() {
      try {
        setLoading(true)
        setError('')

        const listRes = await fetch(`${apiConfig.baseUrl}/api/artikel?per_page=50`, { signal: controller.signal })
        const listJson = await listRes.json()
        if (!listRes.ok || !listJson.success) {
          throw new Error(listJson.message || 'Gagal memuat artikel')
        }

        const articles: Article[] = (listJson.data ?? []).map((item: ApiArticle) => toArticle(item))
        const current = articles.find((item) => item.slug === slugOrId || item.id === slugOrId || item.title === slugOrId) ?? null

        if (!current) {
          throw new Error('Artikel tidak ditemukan')
        }

        setArticle(current)

        const detailRes = await fetch(`${apiConfig.baseUrl}/api/artikel/${current.id}`, { signal: controller.signal })
        const detailJson = await detailRes.json()
        if (detailRes.ok && detailJson.success) {
          setArticle(toArticle(detailJson.data as ApiArticle))
        }

        setRelatedArticles(sortByNewest(articles.filter((item) => item.id !== current.id)).slice(0, 3))
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message || 'Gagal memuat artikel')
        }
      } finally {
        setLoading(false)
      }
    }

    if (slugOrId) {
      loadArticle()
    }

    return () => controller.abort()
  }, [slugOrId])

  const hasRichContent = useMemo(() => Boolean(article?.content?.trim()), [article])

  const handleGoToAnotherArticle = () => {
    const nextArticle = relatedArticles[0]
    if (nextArticle) {
      navigate(`/education/article/${encodeURIComponent(nextArticle.slug ?? nextArticle.id)}`)
      return
    }

    navigate(paths.education)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AppNavbar onLogout={handleLogout} />
        <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-8">
          <Spinner />
        </main>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <AppNavbar onLogout={handleLogout} />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || 'Artikel tidak ditemukan'}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />

      {/* Menambahkan max-w-7xl mx-auto agar halaman tidak melebar tanpa batas di monitor ultra-wide */}
      <main className="mx-auto max-w-7xl w-full flex flex-col gap-8 px-8 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Education" to={paths.education} />}
          title={article.title}
          description=""
        />

        {/* 1. Menaikkan batas tinggi gambar hero sedikit agar lebih megah */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full object-cover max-h-[480px]"
          style={{ borderRadius: tokens.radius.xl }}
        />

        {/* Melebarkan jarak gap antara area baca utama dan sidebar kanan */}
        <div className="flex items-start gap-12">
          <div className="flex flex-col gap-8 flex-1 min-w-0">
            
            {/* 2. Sedikit penyesuaian gap meta-data artikel */}
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: tokens.colors.slate[500] }}>
              <span className="rounded-full px-3.5 py-1.5 font-medium" style={{ background: tokens.colors.brand.soft, color: tokens.colors.slate[900] }}>
                {article.category}
              </span>
              {article.author && <span>Oleh {article.author}</span>}
              {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString('id-ID')}</span>}
            </div>

            {/* 3. Menaikkan font ringkasan ke text-base */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold" style={{ color: tokens.colors.slate[900] }}>Ringkasan</h2>
              <p className="max-w-[100ch] break-words text-base leading-relaxed" style={{ color: tokens.colors.slate[600] }}>
                {article.excerpt}
              </p>
            </div>

            {/* 4. Menaikkan isi artikel utama ke text-base (sebelumnya text-sm terlalu kecil untuk bacaan panjang) */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold" style={{ color: tokens.colors.slate[900] }}>Isi Artikel</h2>
              <div
                className="prose max-w-[100ch] overflow-hidden break-words text-base leading-relaxed prose-headings:mb-3 prose-headings:mt-6 prose-p:mb-4 prose-li:mb-2 prose-img:max-w-full prose-img:h-auto prose-video:max-w-full prose-video:h-auto prose-iframe:max-w-full prose-a:break-all prose-pre:max-w-full prose-pre:overflow-x-auto prose-table:block prose-table:max-w-full prose-table:overflow-x-auto [&_*]:max-w-full [&>h1:first-child]:hidden [&>h2:first-child]:hidden [&>h3:first-child]:hidden"
                style={{ color: tokens.colors.slate[600] }}
                dangerouslySetInnerHTML={{
                  __html: stripDuplicateArticleHeading(hasRichContent ? (article.content as string) : undefined, article.title),
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5 mt-4" style={{ borderColor: tokens.colors.slate[200] }}>
              <Button variant="secondary" onClick={() => navigate(paths.education)}>
                Kembali ke edukasi
              </Button>
              <Button onClick={handleGoToAnotherArticle}>
                Lihat artikel lain
              </Button>
            </div>
          </div>

          {/* 5. Memperlebar pembungkus sidebar dari w-72 ke w-80 agar pas dengan porsi ArticleCard baru */}
          <div className="flex flex-col gap-5 w-80 shrink-0 sticky top-8">
            <h2 className="text-lg font-bold" style={{ color: tokens.colors.slate[900] }}>Baca juga</h2>
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.id}
                id={related.id}
                title={related.title}
                excerpt={related.excerpt}
                category={related.category}
                imageUrl={related.imageUrl}
                author={related.author}
                publishedAt={related.publishedAt ?? undefined}
                onClick={() => navigate(`/education/article/${encodeURIComponent(related.slug ?? related.id)}`)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}