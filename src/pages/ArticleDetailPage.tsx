import { useLocation, useNavigate } from 'react-router-dom'
import { AppNavbar, BackLink, ArticleCard, PageHeaderCard } from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'
import { type Article } from './EducationPage'
import heroImage from '../assets/hero.png'

const relatedArticles: Article[] = [
  {
    id: 'r1',
    title: 'Tren Pinjol Meningkat, Warganet Ingatkan Bahaya',
    excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.',
    category: 'Edukasi',
    imageUrl: heroImage,
  },
  {
    id: 'r2',
    title: 'Ada Peningkatan, Utang Pinjol di Indonesia Capai Rp 80 Triliun',
    excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.',
    category: 'Edukasi',
    imageUrl: heroImage,
  },
  {
    id: 'r3',
    title: '5 Cara Agar Tidak Terjerat Pinjol (Pinjaman Online)',
    excerpt: 'Kenali ciri-ciri pinjol palsu agar tidak terjebak dalam masalah finansial yang merugikan.',
    category: 'Edukasi',
    imageUrl: heroImage,
  },
]

const articleBody = {
  summary: [
    'Penggunaan pinjaman online (pinjol) terus menunjukkan tren peningkatan, terutama di kalangan masyarakat yang membutuhkan akses dana cepat tanpa proses rumit',
    'Kemudahan pendaftaran, pencairan instan, serta minimnya persyaratan menjadi alasan utama pinjol semakin diminati',
    'Di sisi lain, warganet mulai ramai mengingatkan berbagai risiko yang mengintai, seperti bunga tinggi, denda keterlambatan, dan potensi terjebak dalam lingkaran utang',
    'Maraknya pinjol ilegal turut memperparah situasi, dengan kasus penyalahgunaan data pribadi, intimidasi penagihan, hingga ancaman terhadap pengguna',
    'Pemerintah bersama OJK diharapkan dapat memperketat pengawasan terhadap layanan pinjol serta meningkatkan literasi keuangan masyarakat',
    'Edukasi mengenai perbedaan pinjol legal dan ilegal dinilai penting agar masyarakat dapat lebih bijak dalam mengambil keputusan finansial',
  ],
  sections: [
    {
      title: 'What Happened',
      content: 'Penggunaan pinjaman online (pinjol) di Indonesia terus mengalami peningkatan dalam beberapa tahun terakhir. Fenomena ini didorong oleh kemajuan teknologi finansial (fintech) yang memungkinkan masyarakat mengakses layanan keuangan hanya melalui smartphone.',
    },
    {
      title: 'Why It Matters',
      content: 'Meskipun menawarkan kemudahan, tren ini menimbulkan kekhawatiran di tengah masyarakat. Warganet di berbagai platform media sosial mulai ramai mengingatkan potensi bahaya di balik penggunaan pinjol.',
    },
    {
      title: 'The Risk',
      content: 'Ancaman semakin besar dengan maraknya pinjol ilegal yang beroperasi tanpa izin resmi. Beberapa kasus menunjukkan adanya praktik penyalahgunaan data pribadi, seperti akses ke kontak, galeri, hingga informasi sensitif lainnya di perangkat pengguna.',
    },
    {
      title: "What They're Saying",
      content: 'Sejumlah pengguna mengaku kurang memahami syarat dan ketentuan sebelum mengajukan pinjaman. Banyak yang hanya fokus pada kemudahan pencairan dana tanpa membaca detail terkait bunga, tenor, dan konsekuensi keterlambatan pembayaran.',
    },
    {
      title: "What's Next",
      content: 'Pemerintah bersama Otoritas Jasa Keuangan (OJK) didorong untuk memperketat pengawasan terhadap layanan pinjol, khususnya yang tidak memiliki izin resmi.',
    },
    {
      title: 'The Bottom Line',
      content: 'Dengan meningkatnya tren penggunaan pinjol, masyarakat perlu lebih waspada dan tidak hanya tergilur oleh kemudahan yang ditawarkan.',
    },
  ],
}

export function ArticleDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const article = (location.state as { article?: Article } | null)?.article

  if (!article) {
    navigate(paths.education)
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />

      <main className="mx-auto w-full max-w-6xl flex flex-col gap-6 px-6 py-8">

        {/* Header */}
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title={article.title}
          description={article.excerpt}
        />

        {/* Gambar hero */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full object-cover max-h-[420px]"
          style={{ borderRadius: tokens.radius.lg }}
        />

        {/* Konten + Sidebar */}
        <div className="flex items-start gap-10">

          {/* Konten utama */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">

            {/* Summary */}
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-bold" style={{ color: tokens.colors.slate[900] }}>
                Summary
              </h2>
              <ul className="flex flex-col gap-2">
                {articleBody.summary.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: tokens.colors.slate[600] }}>
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: tokens.colors.brand.primary }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {articleBody.sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <h2 className="text-base font-bold" style={{ color: tokens.colors.slate[900] }}>
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: tokens.colors.slate[600] }}>
                  {section.content}
                </p>
              </div>
            ))}

            {/* Navigation */}
            <div
              className="flex justify-between border-t pt-4 mt-2"
              style={{ borderColor: tokens.colors.slate[200] }}
            >
              <button
                className="text-sm transition-colors"
                style={{ color: tokens.colors.slate[400] }}
              >
                Previous article
              </button>
              <button
                className="text-sm font-medium transition-colors"
                style={{ color: tokens.colors.brand.primary }}
              >
                Next Article
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 w-72 shrink-0 sticky top-8">
            <h2 className="text-base font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Baca juga
            </h2>
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.id}
                title={related.title}
                excerpt={related.excerpt}
                category={related.category}
                imageUrl={related.imageUrl}
                onClick={() => navigate(paths.articleDetail, { state: { article: related } })}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}