import { useEffect, useMemo, useState } from 'react'

import {
  TableList,
  PaginationBar,
  SearchBar,
  Button,
  Modal,
  Input,
} from '../components'
import { tokens } from '../config/tokens'
import { useAuth } from '../auth/AuthContext'
import { emailRequirementText, isStrongPassword, isValidEmail, passwordRequirementText } from '../utils/validation'
import {
  createManagedAdmin,
  deleteManagedAdmin,
  getManagedAdmins,
  toggleManagedAdmin,
  type ManagedAdminItem,
} from '../auth/adminApi'

type AdminRow = {
  id: number
  no: number
  nama: string
  username: string
  email: string
  role: string
  statusLabel: string
  isActive: boolean
  lastUpdate: string
}

type AdminActionTarget = {
  id: number
  name: string
  isActive: boolean
}

export function SuperAdminPage() {
  const { token } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [toggleTarget, setToggleTarget] = useState<AdminActionTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminActionTarget | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [admins, setAdmins] = useState<ManagedAdminItem[]>([])

  useEffect(() => {
    if (!token) return

    let cancelled = false
    setLoading(true)
    setError(null)

    getManagedAdmins(token)
      .then((data) => {
        if (!cancelled) setAdmins(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat data admin')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (!message) return

    const timeout = window.setTimeout(() => setMessage(null), 2400)
    return () => window.clearTimeout(timeout)
  }, [message])

  const filteredAdmins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return admins

    return admins.filter((admin) => (
      admin.nama.toLowerCase().includes(query)
      || admin.username.toLowerCase().includes(query)
      || admin.email.toLowerCase().includes(query)
      || admin.role.toLowerCase().includes(query)
    ))
  }, [admins, searchQuery])

  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAdmins.slice(startIndex, startIndex + pageSize)
  }, [filteredAdmins, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / pageSize))

  const rows: AdminRow[] = paginatedAdmins.map((admin, index) => ({
    id: admin.id_admin,
    no: (currentPage - 1) * pageSize + index + 1,
    nama: admin.nama,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    statusLabel: admin.is_active ? 'Aktif' : 'Nonaktif',
    isActive: Boolean(admin.is_active),
    lastUpdate: admin.created_at ? new Date(admin.created_at).toLocaleDateString('id-ID') : '-',
  }))

  async function handleAddAdmin() {
    if (!token) return
    if (!newName.trim() || !newUsername.trim() || !newEmail.trim() || !newPassword.trim()) {
      setError('Nama, username, email, dan password wajib diisi')
      return
    }

    if (!isValidEmail(newEmail.trim())) {
      setError(emailRequirementText)
      return
    }

    if (!isStrongPassword(newPassword)) {
      setError(passwordRequirementText)
      return
    }

    setSaving(true)
    setError(null)

    try {
      const created = await createManagedAdmin(token, {
        nama: newName.trim(),
        username: newUsername.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: 'admin',
      })

      setAdmins((current) => [created, ...current])
      setMessage('Admin baru berhasil ditambahkan')
      setNewName('')
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      setIsModalOpen(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menambahkan admin')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleAdmin(id: number) {
    if (!token) return

    setTogglingId(id)
    setError(null)

    try {
      const updated = await toggleManagedAdmin(token, id)
      setAdmins((current) => current.map((admin) => (
        admin.id_admin === id ? { ...admin, is_active: updated.is_active } : admin
      )))
      setMessage(updated.is_active ? 'Admin berhasil diaktifkan' : 'Admin berhasil dinonaktifkan')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah status admin')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDeleteAdmin(id: number) {
    if (!token) return

    setDeletingId(id)
    setError(null)

    try {
      await deleteManagedAdmin(token, id)
      setAdmins((current) => current.filter((admin) => admin.id_admin !== id))
      setMessage('Admin berhasil dihapus')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus admin')
    } finally {
      setDeletingId(null)
    }
  }

  if (!token) return null

  return (
    <div className="w-full h-full flex flex-col gap-8 p-[15px] overflow-y-auto custom-scrollbar">
      <TableList
        title=""
        headerContent={
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[700] }}>
              Manajemen Admin
            </h1>

            {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="w-full sm:w-auto sm:max-w-xs flex-1">
                <SearchBar
                  placeholder="Cari admin..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => setIsModalOpen(true)}>+ Add New Admin</Button>
              </div>
            </div>
          </div>
        }
        columns={[
          { key: 'no', label: 'No' },
          { key: 'nama', label: 'Nama' },
          { key: 'username', label: 'Username' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'lastUpdate', label: 'Last Update' },
          { key: 'action', label: 'Action' },
        ]}
        pagination={
          <PaginationBar
            showingCount={rows.length}
            totalCount={filteredAdmins.length}
            itemLabel="admins"
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50]}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size: number) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
          />
        }
      >
        {loading ? (
          <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={8}>Memuat data admin...</td></tr>
        ) : rows.length === 0 ? (
          <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={8}>Tidak ada admin yang cocok.</td></tr>
        ) : rows.map((admin) => (
          <tr key={admin.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.no}</td>
            <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[700] }}>{admin.nama}</td>
            <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[700] }}>{admin.username}</td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.email}</td>
            <td className="px-4 py-4 text-sm uppercase" style={{ color: tokens.colors.slate[600] }}>{admin.role}</td>
            <td className="px-4 py-4 text-sm">
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: admin.isActive ? '#ECFDF3' : '#FEF2F2',
                  color: admin.isActive ? '#027A48' : '#B42318',
                }}
              >
                {admin.statusLabel}
              </span>
            </td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.lastUpdate}</td>
            <td className="px-4 py-4 text-sm font-medium">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={togglingId === admin.id || deletingId === admin.id}
                  className="transition-colors disabled:opacity-50"
                  style={{ color: admin.isActive ? tokens.colors.warning.base : '#027A48' }}
                  onClick={() => setToggleTarget({ id: admin.id, name: admin.nama, isActive: admin.isActive })}
                >
                  {togglingId === admin.id ? 'Memproses...' : admin.isActive ? 'Pause' : 'Activate'}
                </button>
                <button
                  type="button"
                  disabled={deletingId === admin.id || togglingId === admin.id}
                  className="transition-colors disabled:opacity-50"
                  style={{ color: tokens.colors.danger.base }}
                  onClick={() => setDeleteTarget({ id: admin.id, name: admin.nama, isActive: admin.isActive })}
                >
                  {deletingId === admin.id ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </TableList>

      <Modal
        isOpen={toggleTarget !== null}
        onClose={() => setToggleTarget(null)}
        title={toggleTarget?.isActive ? 'Pause Admin' : 'Activate Admin'}
        description={toggleTarget ? `Konfirmasi perubahan status untuk ${toggleTarget.name}.` : ''}
      >
        <div className="flex flex-col gap-5 mt-2">
          <p className="text-sm text-slate-600">
            {toggleTarget?.isActive
              ? 'Admin ini akan dinonaktifkan sementara dan tidak bisa login sampai diaktifkan kembali.'
              : 'Admin ini akan diaktifkan kembali dan bisa login seperti biasa.'}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setToggleTarget(null)}>Batal</Button>
            <Button
              onClick={async () => {
                if (!toggleTarget) return
                await handleToggleAdmin(toggleTarget.id)
                setToggleTarget(null)
              }}
              disabled={toggleTarget ? togglingId === toggleTarget.id : false}
            >
              {toggleTarget && togglingId === toggleTarget.id ? 'Memproses...' : toggleTarget?.isActive ? 'Pause' : 'Activate'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Admin"
        description={deleteTarget ? `Konfirmasi penghapusan permanen untuk ${deleteTarget.name}.` : ''}
      >
        <div className="flex flex-col gap-5 mt-2">
          <p className="text-sm text-slate-600">
            Admin yang dihapus tidak bisa dipulihkan dari dashboard. Pastikan akun ini memang sudah tidak diperlukan.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button
              onClick={async () => {
                if (!deleteTarget) return
                await handleDeleteAdmin(deleteTarget.id)
                setDeleteTarget(null)
              }}
              disabled={deleteTarget ? deletingId === deleteTarget.id : false}
            >
              {deleteTarget && deletingId === deleteTarget.id ? 'Menghapus...' : 'Hapus'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Admin"
        description="Masukkan detail akun untuk admin baru."
      >
        <div className="flex flex-col gap-5 mt-2">
          <Input
            label="Nama Lengkap"
            placeholder="Nama admin"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Username"
            placeholder="admin_nama"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoComplete="off"
          />
          <Input
            label="Email"
            type="email"
            placeholder="nama@regulator.go.id"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-slate-400">{emailRequirementText}</p>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddAdmin()
            }}
            autoComplete="new-password"
          />
          <p className="text-xs text-slate-400">{passwordRequirementText}</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddAdmin} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
