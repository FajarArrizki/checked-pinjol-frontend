import { useState, useMemo } from 'react'
import { Button, Input, SearchBar } from '../components'
import { tokens } from '../config/tokens'

type Pinjol = {
  id: number
  nama: string
  jenis: string
  perusahaan: string
  email: string
  urlWeb: string
  urlPlayStore: string
}

const initialData: Pinjol[] = [
  {
    id: 1,
    nama: 'KreditPintar',
    jenis: 'P2P Lending',
    perusahaan: 'PT Kredit Pintar Indonesia',
    email: 'cs@kreditpintar.com',
    urlWeb: 'https://www.kreditpintar.com/',
    urlPlayStore: 'https://play.google.com/store/apps/details?id=com.kreditpintar&hl=id&gl=ID',
  },
  {
    id: 2,
    nama: 'Akulaku',
    jenis: 'P2P Lending & PayLater',
    perusahaan: 'PT Akulaku Silvrr Indonesia',
    email: 'cs.id@akulaku.com',
    urlWeb: 'https://www.akulaku.com/',
    urlPlayStore: 'https://play.google.com/store/apps/details?id=io.silvrr.installment&hl=id',
  },
  {
    id: 3,
    nama: 'AdaKami',
    jenis: 'P2P Lending',
    perusahaan: 'PT Pembiayaan Digital Indonesia',
    email: 'tanya@adakami-cs.id',
    urlWeb: 'https://www.adakami.id/',
    urlPlayStore: 'https://play.google.com/store/apps/details?id=com.adakami.dana.kredit.pinjaman&hl=en&gl=ID',
  },
]

type Mode = 'list' | 'tambah' | 'edit'
type SuccessType = 'tambah' | 'edit' | null

const emptyForm = {
  nama: '',
  jenis: '',
  perusahaan: '',
  email: '',
  urlWeb: '',
  urlPlayStore: '',
}

function SuccessOverlay({ type }: { type: SuccessType }) {
  if (!type) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="flex flex-col items-center gap-6 px-16 py-12 max-w-sm w-full mx-4"
        style={{
          borderRadius: tokens.radius.lg,
          backgroundColor: tokens.colors.brand.primary,
        }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center"
          style={{
            borderRadius: tokens.radius.full,
            backgroundColor: tokens.colors.white,
          }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: tokens.colors.brand.primary }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-xl font-bold text-center" style={{ color: tokens.colors.white }}>
          {type === 'tambah' ? 'Pinjol Berhasil Ditambahkan' : 'Data Berhasil Diperbarui'}
        </p>
      </div>
    </div>
  )
}

export function RegulatorRegisteredLoansPage() {
  const [mode, setMode] = useState<Mode>('list')
  const [pinjolList, setPinjolList] = useState<Pinjol[]>(initialData)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [successType, setSuccessType] = useState<SuccessType>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredList = useMemo(() => {
    return pinjolList.filter((p) =>
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.perusahaan.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [pinjolList, searchQuery])

  function handleEdit(pinjol: Pinjol) {
    setSelectedId(pinjol.id)
    setForm({
      nama: pinjol.nama,
      jenis: pinjol.jenis,
      perusahaan: pinjol.perusahaan,
      email: pinjol.email,
      urlWeb: pinjol.urlWeb,
      urlPlayStore: pinjol.urlPlayStore,
    })
    setMode('edit')
  }

  function handleHapus(id: number) {
    setPinjolList((curr) => curr.filter((p) => p.id !== id))
  }

  function handleTambah() {
    setForm(emptyForm)
    setMode('tambah')
  }

  function handleSimpan() {
    if (mode === 'edit') {
      setPinjolList((curr) =>
        curr.map((p) => (p.id === selectedId ? { ...p, ...form } : p))
      )
      setSuccessType('edit')
    } else {
      setPinjolList((curr) => [...curr, { id: Date.now(), ...form }])
      setSuccessType('tambah')
    }
    setTimeout(() => {
      setSuccessType(null)
      setMode('list')
    }, 2000)
  }

  // Form Tambah / Edit
  if (mode === 'tambah' || mode === 'edit') {
    return (
      <div className="w-full h-full flex flex-col gap-6 p-[15px] overflow-y-auto">
        <SuccessOverlay type={successType} />

        <button
          onClick={() => setMode('list')}
          className="inline-flex items-center gap-2 self-start text-sm font-medium"
          style={{ color: tokens.colors.brand.primary }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>

        <h1 className="text-2xl font-bold" style={{ color: tokens.colors.slate[900] }}>
          {mode === 'tambah' ? 'Form Penambahan Aplikasi Pinjaman Online' : 'Form Pengeditan Data Pinjaman Online'}
        </h1>

        <div
          className="flex flex-col gap-5 p-6 border bg-white w-full"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <Input
            label="Nama Aplikasi"
            placeholder="Contoh : PinjamanCepat"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
          <Input
            label="Jenis"
            placeholder="Contoh : P2P Lending"
            value={form.jenis}
            onChange={(e) => setForm({ ...form, jenis: e.target.value })}
          />
          <Input
            label="Perusahaan"
            placeholder="Contoh : PT PinjamanCepat"
            value={form.perusahaan}
            onChange={(e) => setForm({ ...form, perusahaan: e.target.value })}
          />
          <Input
            label="Email"
            placeholder="Contoh : cs@pinjaman.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Url Web"
            placeholder="https://www.pinjaman.com/"
            value={form.urlWeb}
            onChange={(e) => setForm({ ...form, urlWeb: e.target.value })}
          />
          <Input
            label="Url Play Store"
            placeholder="https://play.google.com/..."
            value={form.urlPlayStore}
            onChange={(e) => setForm({ ...form, urlPlayStore: e.target.value })}
          />
          <button
            onClick={handleSimpan}
            className="w-full py-4 font-semibold transition-colors mt-2"
            style={{
              borderRadius: tokens.radius.md,
              backgroundColor: tokens.colors.brand.soft,
              color: tokens.colors.brand.primary,
            }}
          >
            {mode === 'tambah' ? 'Tambah Pinjol' : 'Simpan'}
          </button>
        </div>
      </div>
    )
  }

  // List
  return (
    <div className="w-full h-full flex flex-col gap-6 p-[15px] overflow-y-auto">
      <SuccessOverlay type={successType} />

      {/* Header */}
      <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[800] }}>
        Pinjaman Online Terdaftar
      </h1>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          placeholder="Cari pinjol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleTambah} className="shrink-0 px-4 py-2 text-sm font-semibold">
          + Tambah Pinjol
        </Button>
      </div> 

      {/* List Cards */}
      <div className="flex flex-col gap-4">
        {filteredList.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: tokens.colors.slate[400] }}>
            Tidak ada pinjol yang sesuai pencarian.
          </p>
        ) : (
          filteredList.map((pinjol) => (
            <div
              key={pinjol.id}
              className="flex flex-col gap-4 p-5 border bg-white"
              style={{
                borderRadius: tokens.radius.lg,
                borderColor: tokens.colors.slate[200],
                boxShadow: tokens.shadow.sm,
              }}
            >
              <div>
                <h2 className="text-base font-semibold" style={{ color: tokens.colors.slate[900] }}>
                  {pinjol.nama}
                </h2>
                <p className="text-sm" style={{ color: tokens.colors.slate[400] }}>
                  {pinjol.jenis}
                </p>
              </div>

              <div
                className="flex flex-col gap-3 p-4"
                style={{
                  borderRadius: tokens.radius.md,
                  backgroundColor: tokens.colors.brand.softStrong,
                }}
              >
                <p className="text-sm" style={{ color: tokens.colors.slate[700] }}>
                  <span className="font-semibold">Perusahaan:</span> {pinjol.perusahaan}
                </p>
                <p className="text-sm" style={{ color: tokens.colors.slate[700] }}>
                  <span className="font-semibold">Email:</span> {pinjol.email}
                </p>
                <p className="text-sm break-all" style={{ color: tokens.colors.slate[700] }}>
                  <span className="font-semibold">Url Web:</span> {pinjol.urlWeb}
                </p>
                <p className="text-sm break-all" style={{ color: tokens.colors.slate[700] }}>
                  <span className="font-semibold">Url Play Store:</span> {pinjol.urlPlayStore}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleHapus(pinjol.id)}
                  className="px-5 py-2 text-sm font-semibold transition-colors"
                  style={{
                    borderRadius: tokens.radius.md,
                    backgroundColor: tokens.colors.danger.soft,
                    color: tokens.colors.danger.base,
                  }}
                >
                  Hapus
                </button>
                <button
                  onClick={() => handleEdit(pinjol)}
                  className="px-5 py-2 text-sm font-semibold transition-colors"
                  style={{
                    borderRadius: tokens.radius.md,
                    backgroundColor: tokens.colors.brand.soft,
                    color: tokens.colors.brand.primary,
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}