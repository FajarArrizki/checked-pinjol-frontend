import { apiConfig } from '../config/api'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data?: T
}

class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init: RequestInit, token: string): Promise<T> {
  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  })

  const raw = await response.text()
  const data = raw ? (JSON.parse(raw) as ApiEnvelope<T>) : null

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? `Request failed with status ${response.status}`)
  }

  return data?.data as T
}

export type AdminDashboardResponse = {
  overview: {
    laporan_hari_ini: number
    laporan_tertunda: number
    aplikasi_baru_hari_ini: number
    tindakan_selesai: number
    tingkat_penyelesaian: number
  }
  total_pinjol: {
    semua: number
    legal: number
    ilegal: number
    dalam_pengawasan: number
  }
  total_laporan: {
    semua: number
    menunggu: number
    diproses: number
    selesai: number
    ditolak: number
  }
  total_user: number
  total_artikel: number
  total_ulasan: number
  laporan_terbaru: Array<{
    id_laporan: number
    kode_laporan: string
    judul_laporan: string
    nama_pelapor: string
    status_laporan: string
    tanggal_lapor: string
    nama_pinjol: string | null
  }>
  status_laporan: Record<string, number>
}

export type AdminReportItem = {
  id_laporan: number
  kode_laporan: string
  judul_laporan: string
  nama_pelapor: string
  kontak_pelapor: string | null
  email_pelapor: string | null
  tautan_aplikasi: string | null
  foto_bukti: string | null
  status_laporan: string
  tanggal_lapor: string
  id_pinjol: number | null
  nama_pinjol: string | null
  status_pinjol: string | null
}

export type AdminReportDetail = AdminReportItem & {
  id_user: number | null
  isi_laporan: string | null
  tanggapan_ojk: string | null
  tanggal_tanggapan: string | null
  id_admin_penanggung_jawab: number | null
  regulasi?: Array<{
    id_regulasi: number
    nama_kriteria: string
    deskripsi?: string | null
    catatan?: string | null
  }>
  lampiran: Array<{
    id_lampiran: number
    id_laporan: number
    nama_file: string | null
    file_path: string | null
    tipe_file: string | null
    ukuran_file: number | null
    uploaded_at: string | null
  }>
}

export type PaginatedReportsResponse = {
  data: AdminReportItem[]
  meta: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export type ManagedAdminItem = {
  id_admin: number
  nama: string
  email: string
  username: string
  role: 'admin' | 'superadmin'
  no_hp: string | null
  is_active: number
  created_at: string | null
}

export type CreateManagedAdminPayload = {
  nama: string
  email: string
  username: string
  password: string
  role: 'admin' | 'superadmin'
  no_hp?: string
}

export async function getAdminDashboard(token: string): Promise<AdminDashboardResponse> {
  return request<AdminDashboardResponse>('/api/admin/dashboard', { method: 'GET' }, token)
}

export async function getAdminReports(
  token: string,
  params: { page?: number; perPage?: number; search?: string; status?: string },
): Promise<PaginatedReportsResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('per_page', String(params.perPage))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)

  return request<PaginatedReportsResponse>(`/api/admin/laporan?${searchParams.toString()}`, { method: 'GET' }, token)
}

export async function updateAdminReportStatus(token: string, id: number, status_laporan: string): Promise<unknown> {
  return request<unknown>(`/api/admin/laporan/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status_laporan }),
  }, token)
}

export async function getAdminReportDetail(token: string, id: number): Promise<AdminReportDetail> {
  return request<AdminReportDetail>(`/api/laporan/${id}`, { method: 'GET' }, token)
}

export async function replyAdminReport(
  token: string,
  id: number,
  payload: { status_laporan: string; tanggapan_ojk: string },
): Promise<AdminReportDetail> {
  return request<AdminReportDetail>(`/api/admin/laporan/${id}/reply`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token)
}

export async function getManagedAdmins(token: string): Promise<ManagedAdminItem[]> {
  return request<ManagedAdminItem[]>('/api/admin/admins', { method: 'GET' }, token)
}

export async function createManagedAdmin(token: string, payload: CreateManagedAdminPayload): Promise<ManagedAdminItem> {
  return request<ManagedAdminItem>('/api/admin/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token)
}

export async function toggleManagedAdmin(token: string, id: number): Promise<{ is_active: number }> {
  return request<{ is_active: number }>(`/api/admin/admins/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  }, token)
}

export async function deleteManagedAdmin(token: string, id: number): Promise<void> {
  await request<null>(`/api/admin/admins/${id}`, {
    method: 'DELETE',
  }, token)
}
