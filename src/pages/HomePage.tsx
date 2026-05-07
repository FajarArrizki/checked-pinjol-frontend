import { useNavigate } from 'react-router-dom'
import { AppNavbar, ArticleCard, MenuCard } from '../components'
import heroImage from '../assets/hero.png'
import { paths } from '../router/paths'

const menuItems = [
  {
    title: 'Cek Legalitas Pinjol',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.75c.18 0 .35.04.52.11l5.75 2.56c.27.12.44.38.44.67v4.36c0 3.95-2.33 7.55-5.95 9.19a1.51 1.51 0 0 1-1.24 0c-3.62-1.64-5.95-5.24-5.95-9.19V6.09c0-.29.17-.55.44-.67l5.75-2.56c.17-.07.34-.11.52-.11Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 12.5 1.75 1.75 3.25-4" />
      </svg>
    ),
  },
  {
    title: 'Tulis Ulasan',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75H6.75A2.25 2.25 0 0 0 4.5 6v11.25A2.25 2.25 0 0 0 6.75 19.5H17.25A2.25 2.25 0 0 0 19.5 17.25V6.75m-9 3.75h4.5m-4.5 3h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75 18 6" />
      </svg>
    ),
  },
  {
    title: 'Pusat Edukasi & Bantuan',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v10.5m-4.5-7.5h9M5.25 19.5h13.5A1.5 1.5 0 0 0 20.25 18V6A1.5 1.5 0 0 0 18.75 4.5H5.25A1.5 1.5 0 0 0 3.75 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
      </svg>
    ),
  },
  {
    title: 'Simulasi Pinjaman',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5h9A1.5 1.5 0 0 1 18 6v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18V6a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M9 15h3" />
      </svg>
    ),
  },
  {
    title: 'Status Laporan Saya',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Laporkan Aplikasi',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4.5m0 3h.008v.008H12v-.008ZM10.29 3.86 2.82 17.36A1.5 1.5 0 0 0 4.13 19.5h14.74a1.5 1.5 0 0 0 1.31-2.14L12.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
      </svg>
    ),
  },
]

const newsItems = [
  {
    title: 'Cara Memastikan Aplikasi Pinjaman Terdaftar Resmi di OJK',
    excerpt:
      'Kenali indikator legalitas aplikasi pinjaman online sebelum mengajukan, mulai dari izin sampai transparansi biaya.',
    category: 'Edukasi',
  },
  {
    title: 'Langkah Aman Membuat Laporan Pinjol Bermasalah',
    excerpt:
      'Susun bukti, kronologi, dan lampiran pendukung agar laporan lebih mudah diverifikasi dan ditindaklanjuti.',
    category: 'Panduan',
  },
  {
    title: 'Tips Menghitung Total Biaya Pinjaman Sebelum Setuju',
    excerpt:
      'Pelajari cara membaca bunga, biaya admin, dan APR supaya tidak salah mengambil keputusan finansial.',
    category: 'Keuangan',
  },
  {
    title: 'Waspadai Ciri-Ciri Penagihan yang Tidak Sesuai Aturan',
    excerpt:
      'Pahami tanda-tanda penagihan yang melanggar etika dan langkah aman yang bisa dilakukan saat menghadapinya.',
    category: 'Keamanan',
  },
  {
    title: 'Cara Menyusun Bukti Screenshot yang Kuat untuk Laporan',
    excerpt:
      'Susun tangkapan layar, percakapan, dan kronologi secara rapi agar laporan lebih mudah diverifikasi oleh tim penanganan.',
    category: 'Bantuan',
  },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Layanan Utama</h2>
              <p className="mt-1 text-sm text-slate-500">Mulai dari layanan yang kamu butuhkan, mulai dari cek legalitas, simulasi pinjaman, hingga pelaporan aplikasi.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <MenuCard
                key={item.title}
                title={item.title}
                icon={item.icon}
                onClick={
                  item.title === 'Simulasi Pinjaman'
                    ? () => navigate(paths.simulation)
                    : item.title === 'Laporkan Aplikasi'
                      ? () => navigate(paths.reportApplication)
                      : item.title === 'Status Laporan Saya'
                        ? () => navigate(paths.reportStatus)
                      : undefined
                }
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Berita & Edukasi Terbaru</h2>
              <p className="mt-1 text-sm text-slate-500">Ikuti panduan, pembaruan, dan insight terbaru agar kamu lebih aman saat menggunakan layanan pinjaman online.</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {newsItems.map((item) => (
              <ArticleCard
                key={item.title}
                title={item.title}
                excerpt={item.excerpt}
                category={item.category}
                imageUrl={heroImage}
                className="min-w-[360px] max-w-[400px] shrink-0"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
