import { useState } from 'react'
import {
  TableList,
  PaginationBar,
  SearchBar,
  Button,
  Modal,
  Input
} from '../components'
import { tokens } from '../config/tokens'

type AdminUser = {
  id: number
  no: number
  username: string
  email: string
  passwordHash: string
  lastUpdate: string
}

export function SuperAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: 1, no: 1, username: 'admin_budi', email: 'budi@regulator.go.id', passwordHash: '********', lastUpdate: '24/2/2026' },
    { id: 2, no: 2, username: 'admin_siti', email: 'siti@regulator.go.id', passwordHash: '********', lastUpdate: '23/2/2026' },
    { id: 3, no: 3, username: 'admin_joko', email: 'joko@regulator.go.id', passwordHash: '********', lastUpdate: '20/2/2026' },
  ])

  const handleAddAdmin = () => {
    if (newUsername && newEmail && newPassword) {
      setAdmins([
        ...admins,
        {
          id: Date.now(),
          no: admins.length + 1,
          username: newUsername,
          email: newEmail,
          passwordHash: '********',
          lastUpdate: new Date().toLocaleDateString('id-ID')
        }
      ])
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      setIsModalOpen(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 p-[15px]">
      <TableList
        title=""
        headerContent={
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[800] }}>
              Manajemen Admin
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="w-full sm:w-auto sm:max-w-xs flex-1">
                <SearchBar placeholder="Cari admin..." />
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsModalOpen(true)}>+ Add New Admin</Button>
              </div>
            </div>
          </div>
        }
        columns={[
          { key: 'no', label: 'No' },
          { key: 'username', label: 'Username' },
          { key: 'email', label: 'Email' },
          { key: 'password', label: 'Password' },
          { key: 'lastUpdate', label: 'Last Update' },
          { key: 'action', label: 'Action' },
        ]}
        pagination={
          <PaginationBar
            showingCount={admins.length}
            totalCount={admins.length}
            itemLabel="admins"
            currentPage={1}
            totalPages={1}
            pageSize={10}
            pageSizeOptions={[10, 25, 50]}
          />
        }
      >
        {admins.map((admin) => (
          <tr key={admin.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.no}</td>
            <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[800] }}>{admin.username}</td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.email}</td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.passwordHash}</td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{admin.lastUpdate}</td>
            <td className="px-4 py-4 text-sm font-medium">
              <div className="flex items-center gap-3">
                <button className="text-warning-dark hover:text-warning-base transition-colors" style={{ color: tokens.colors.warning.dark }}>Pause</button>
                <button className="text-danger-base hover:text-danger-dark transition-colors" style={{ color: tokens.colors.danger.base }}>Terminate</button>
              </div>
            </td>
          </tr>
        ))}
      </TableList>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Admin"
        description="Masukkan detail akun untuk admin baru."
      >
        <div className="flex flex-col gap-5 mt-2">
          <Input 
            label="Username" 
            placeholder="admin_nama" 
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Input 
            label="Email" 
            type="email"
            placeholder="nama@regulator.go.id" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddAdmin()
            }}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddAdmin}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
