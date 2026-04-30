import { Button, DeleteConfirmModal, FormModal, TableList } from '../components'

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'action', label: 'Action' },
]

export function UsersPage() {
  return (
    <div className="space-y-6">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Button>Create User</Button>
          <Button variant="secondary">Edit User</Button>
          <Button variant="danger">Delete User</Button>
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
