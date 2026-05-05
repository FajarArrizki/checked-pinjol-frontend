import {
  ArticleCard,
  BackLink,
  Button,
  BuktiLampiran,
  CategoryPill,
  DeleteConfirmModal,
  FormModal,
  Input,
  OjkResponseHeader,
  PaginationBar,
  ReportCard,
  SearchBar,
  Spinner,
  StatCard,
  StatusPill,
  TableList,
} from '../components'
import heroImage from '../assets/hero.png'

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'action', label: 'Action' },
]

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <BackLink toLabel="Dashboard" href="#" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
        <p className="mt-3 text-slate-600">
          Initial reusable components for users table and modal layout.
        </p>
      </section>

      <TableList
        title="Users Table"
        description="Table shell untuk list data users tanpa dummy content."
        columns={userColumns}
      >
        <tr>
          <td className="px-4 py-10 text-sm text-slate-400" colSpan={userColumns.length}>
            Data rows will be rendered here.
          </td>
        </tr>
      </TableList>

      <PaginationBar
        showingCount={9}
        totalCount={20}
        itemLabel="articles"
        currentPage={2}
        totalPages={3}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Button>Create User</Button>
          <Button variant="secondary">Edit User</Button>
          <Button variant="danger">Delete User</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Category Pill</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <CategoryPill active>Pinjaman Aktif</CategoryPill>
              <CategoryPill>Pinjaman Non Active</CategoryPill>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Status Pill</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <StatusPill status="process" />
              <StatusPill status="selesai" />
              <StatusPill status="terminate" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Bukti Lampiran</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <BuktiLampiran title="ktp-user.jpg" size="2.4 MB" />
              <BuktiLampiran title="selfie-verifikasi.png" size="1.1 MB" imageUrl={heroImage} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Header Tanggapan OJK</h2>
            <div className="mt-3 space-y-4">
              <OjkResponseHeader name="OJK Pusat" respondedAt="22 Februari 2026, 14:30 WIB" />
              <OjkResponseHeader
                name="OJK Regional"
                respondedAt="22 Februari 2026, 14:30 WIB"
                imageUrl={heroImage}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">Data & Content Components</h2>

            <div className="mt-3 space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <SearchBar placeholder="Cari artikel atau laporan" />
                <Input label="Nama Pengguna" placeholder="Masukkan nama pengguna" />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <StatCard
                  label="Total Pengaduan"
                  value="128"
                  description="dibanding minggu lalu"
                  descriptionHighlight="+12%"
                  icon={<span className="text-lg">!</span>}
                />
                <StatCard
                  label="Diproses"
                  value="42"
                  description="masih menunggu tindak lanjut"
                  descriptionHighlight="Aktif"
                  icon={<span className="text-lg">~</span>}
                />
                <StatCard
                  label="Selesai"
                  value="86"
                  description="laporan sudah ditutup"
                  descriptionHighlight="Stabil"
                  icon={<span className="text-lg">*</span>}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ReportCard
                  appName="Pinjol Cepat Dana"
                  description="Pengguna melaporkan kendala pada penagihan dan bunga yang tidak sesuai."
                  status="process"
                  date="22 Februari 2026"
                />
                <ReportCard
                  appName="Pinjaman Aman"
                  description="Laporan telah diverifikasi dan tanggapan awal sudah diberikan."
                  status="selesai"
                  date="20 Februari 2026"
                />
                <ReportCard
                  appName="Dana Instan Plus"
                  description="Laporan dihentikan karena data pendukung tidak mencukupi untuk dilanjutkan."
                  status="terminate"
                  date="18 Februari 2026"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ArticleCard
                  title="Cara Mengenali Pinjol Legal dan Ilegal dengan Cepat"
                  excerpt="Panduan singkat untuk memeriksa izin, identitas aplikasi, dan pola penagihan sebelum mengajukan pinjaman online."
                  category="Edukasi"
                  imageUrl={heroImage}
                />
                <ArticleCard
                  title="Langkah Membuat Pengaduan yang Lengkap dan Mudah Diproses"
                  excerpt="Susun kronologi, lampiran, dan bukti komunikasi agar laporan lebih mudah diverifikasi oleh tim penanganan."
                  category="Panduan"
                  imageUrl={heroImage}
                />
                <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-500">Memuat data komponen...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FormModal title="Create or Update User" description="Modal shell untuk form create dan update user." />

      <DeleteConfirmModal
        title="Delete User"
        description="Modal shell untuk konfirmasi delete data user sebelum request dijalankan."
      />
    </div>
  )
}
