import { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, SearchBar } from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { useAuth } from '../auth/AuthContext'

type Pinjol = {
  id_pinjol: number
  nama_pinjol: string
  tahun_berdiri: string | null
  alamat: string | null
  website: string | null
  status_pinjol: 'legal' | 'ilegal' | 'dalam_pengawasan'
  created_at?: string | null
  updated_at?: string | null
}

type PinjolForm = {
  nama_pinjol: string
  tahun_berdiri: string
  alamat: string
  website: string
  status_pinjol: 'legal' | 'ilegal' | 'dalam_pengawasan'
}

type Mode = 'list' | 'tambah' | 'edit'

const emptyForm: PinjolForm = {
  nama_pinjol: '',
  tahun_berdiri: '',
  alamat: '',
  website: '',
  status_pinjol: 'legal',
}

const STATUS_OPTIONS: Array<{ value: PinjolForm['status_pinjol']; label: string }> = [
  { value: 'legal', label: 'Legal' },
  { value: 'ilegal', label: 'Ilegal' },
  { value: 'dalam_pengawasan', label: 'Dalam Pengawasan' },
]

export function RegulatorRegisteredLoansPage() {
  const { token } = useAuth()
  const [mode, setMode] = useState<Mode>('list')
  const [pinjolList, setPinjolList] = useState<Pinjol[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<PinjolForm>(emptyForm)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Pinjol | null>(null)

  const filteredList = useMemo(() => {
    return pinjolList.filter((item) =>
      item.nama_pinjol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alamat ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.website ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [pinjolList, searchQuery])

  useEffect(() => {
    if (!token) return

    let cancelled = false
    setLoading(true)
    setError('')

    fetch(`${apiConfig.baseUrl}/api/pinjol`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json().then((json) => ({ response, json })))
      .then(({ response, json }) => {
        if (cancelled) return
        if (!response.ok) {
          throw new Error(json?.message ?? 'Gagal memuat pinjol')
        }

        setPinjolList(Array.isArray(json.data) ? json.data : [])
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat pinjol')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, successMessage])

  function openTambah() {
    setSelectedId(null)
    setForm(emptyForm)
    setMode('tambah')
    setError('')
    setSuccessMessage('')
  }

  function openEdit(pinjol: Pinjol) {
    setSelectedId(pinjol.id_pinjol)
    setForm({
      nama_pinjol: pinjol.nama_pinjol ?? '',
      tahun_berdiri: pinjol.tahun_berdiri ?? '',
      alamat: pinjol.alamat ?? '',
      website: pinjol.website ?? '',
      status_pinjol: pinjol.status_pinjol ?? 'legal',
    })
    setMode('edit')
    setError('')
    setSuccessMessage('')
  }

  function closeForm() {
    setMode('list')
    setError('')
  }

  async function savePinjol() {
    if (!token) return

    setSaving(true)
    setError('')

    try {
      const payload = {
        nama_pinjol: form.nama_pinjol,
        tahun_berdiri: form.tahun_berdiri ? Number(form.tahun_berdiri) : null,
        alamat: form.alamat || null,
        website: form.website || null,
        status_pinjol: form.status_pinjol,
      }

      const url = mode === 'edit' && selectedId !== null
        ? `${apiConfig.baseUrl}/api/admin/pinjol/${selectedId}`
        : `${apiConfig.baseUrl}/api/admin/pinjol`

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menyimpan pinjol')
      }

      setSuccessMessage(mode === 'edit' ? 'Data berhasil diperbarui' : 'Pinjol berhasil ditambahkan')
      setMode('list')
      setForm(emptyForm)
      setSelectedId(null)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Gagal menyimpan pinjol')
    } finally {
      setSaving(false)
    }
  }

  async function deletePinjol() {
    if (!token || !deleteTarget) return

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/admin/pinjol/${deleteTarget.id_pinjol}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menghapus pinjol')
      }

      setDeleteTarget(null)
      setSuccessMessage('Pinjol berhasil dihapus')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus pinjol')
    } finally {
      setSaving(false)
    }
  }

  if (!token) return null

  if (mode === 'tambah' || mode === 'edit') {
    return (
      <div className="flex h-full w-full flex-col gap-6 overflow-y-auto p-[15px]">
        <button
          type="button"
          onClick={closeForm}
          className="inline-flex items-center gap-2 self-start text-sm font-medium"
          style={{ color: tokens.colors.brand.primary }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>

        <h1 className="text-2xl font-bold" style={{ color: tokens.colors.slate[900] }}>
          {mode === 'tambah' ? 'Tambah Pinjol' : 'Edit Pinjol'}
        </h1>

        <div
          className="flex w-full flex-col gap-5 border bg-white p-6"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <Input label="Nama Pinjol" placeholder="Contoh: PinjamCepat" value={form.nama_pinjol} onChange={(e) => setForm((curr) => ({ ...curr, nama_pinjol: e.target.value }))} />
          <Input label="Tahun Berdiri" type="number" placeholder="Contoh: 2020" value={form.tahun_berdiri} onChange={(e) => setForm((curr) => ({ ...curr, tahun_berdiri: e.target.value }))} />
          <Input label="Alamat" placeholder="Alamat kantor atau perusahaan" value={form.alamat} onChange={(e) => setForm((curr) => ({ ...curr, alamat: e.target.value }))} />
          <Input label="Website" placeholder="https://..." value={form.website} onChange={(e) => setForm((curr) => ({ ...curr, website: e.target.value }))} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Status Pinjol</label>
            <select
              value={form.status_pinjol}
              onChange={(e) => setForm((curr) => ({ ...curr, status_pinjol: e.target.value as PinjolForm['status_pinjol'] }))}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1AA86E]"
              style={{ borderColor: tokens.colors.slate[200] }}
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <Button onClick={savePinjol} disabled={saving} className="w-full py-3 font-semibold">
            {saving ? 'Menyimpan...' : mode === 'tambah' ? 'Tambah Pinjol' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-y-auto p-[15px]">
      <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[700] }}>Pinjaman Online Terdaftar</h1>

      <div className="flex items-center justify-between gap-4">
        <SearchBar placeholder="Cari pinjol..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
        <Button onClick={openTambah} className="shrink-0 px-4 py-2 text-sm font-semibold">+ Tambah Pinjol</Button>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {successMessage ? <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</p> : null}

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Memuat data pinjol...</p>
        ) : filteredList.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">Tidak ada pinjol yang sesuai pencarian.</p>
        ) : (
          filteredList.map((pinjol) => (
            <div
              key={pinjol.id_pinjol}
              className="flex flex-col gap-5 border bg-white p-5 transition-shadow hover:shadow-md"
              style={{ borderRadius: tokens.radius.lg, borderColor: tokens.colors.slate[200], boxShadow: tokens.shadow.sm }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: tokens.colors.slate[200] }}>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold" style={{ color: tokens.colors.slate[900] }}>{pinjol.nama_pinjol}</h2>
                  <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[500] }}>Data pinjol terdaftar</p>
                </div>

                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize"
                  style={{
                    borderColor: tokens.colors.slate[200],
                    backgroundColor: tokens.colors.slate[50],
                    color: tokens.colors.slate[700],
                    borderRadius: tokens.radius.full,
                  }}
                >
                  {pinjol.status_pinjol.replace('_', ' ')}
                </span>
              </div>

              <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm md:grid-cols-2" style={{ border: `1px solid ${tokens.colors.slate[200]}` }}>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tahun Berdiri</p>
                  <p className="font-medium text-slate-900">{pinjol.tahun_berdiri ?? '-'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Alamat</p>
                  <p className="font-medium text-slate-900">{pinjol.alamat ?? '-'}</p>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Website</p>
                  {pinjol.website ? (
                    <a
                      href={pinjol.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium break-all text-[#1AA86E] underline decoration-transparent transition-colors hover:decoration-current"
                    >
                      {pinjol.website}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-900">-</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="secondary" onClick={() => setDeleteTarget(pinjol)}>Hapus</Button>
                <Button onClick={() => openEdit(pinjol)}>Edit</Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Pinjol"
        description={deleteTarget ? `Hapus ${deleteTarget.nama_pinjol}?` : undefined}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">Aksi ini akan menghapus data pinjol dari daftar terdaftar.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button onClick={deletePinjol} disabled={saving}>{saving ? 'Menghapus...' : 'Hapus'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
