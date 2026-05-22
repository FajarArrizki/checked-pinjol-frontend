import { useEffect, useState } from 'react'
import {
  Input,
  Toggle,
  SectionCard,
  Badge,
  Modal,
  Button
} from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { useAuth } from '../auth/AuthContext'
import { isStrongPassword, passwordRequirementText } from '../utils/validation'

type RegulationItem = {
  id_regulasi: number
  nama_kriteria: string
  deskripsi: string
}

type SettingsResponse = {
  email_alert_darurat: number
  ringkasan_laporan: number
  two_factor_enabled: number
}

type WeeklyRecapPreview = {
  overview: {
    laporan_masuk_7_hari: number
    laporan_diproses_7_hari: number
    laporan_selesai_7_hari: number
    laporan_ditolak_7_hari: number
  }
  checked_reports: Array<{
    id_laporan: number
    kode_laporan: string
    judul_laporan: string
    status_laporan: string
    updated_at: string
  }>
}

type TwoFactorStep = 'qr' | 'otp' | 'success'

export function RegulatorSettingsPage() {
  const { token } = useAuth()
  const [fullName, setFullName] = useState('')
  const [initialFullName, setInitialFullName] = useState('')
  const [institutionEmail, setInstitutionEmail] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [emailAlert, setEmailAlert] = useState(true)
  const [weeklyRecap, setWeeklyRecap] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [weeklyRecapPreview, setWeeklyRecapPreview] = useState<WeeklyRecapPreview | null>(null)
  const [weeklyRecapLoading, setWeeklyRecapLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRegulation, setNewRegulation] = useState('')
  const [regulations, setRegulations] = useState<RegulationItem[]>([])
  const [regulationSaving, setRegulationSaving] = useState(false)
  const [regulationMessage, setRegulationMessage] = useState('')
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false)
  const [twoFactorStep, setTwoFactorStep] = useState<TwoFactorStep>('qr')
  const [twoFactorOtp, setTwoFactorOtp] = useState('')
  const [twoFactorMessage, setTwoFactorMessage] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorQrUrl, setTwoFactorQrUrl] = useState('')

  // Password Flow State
  const [passwordStep, setPasswordStep] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwOtp, setPwOtp] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    if (!token) return

    fetch(`${apiConfig.baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json?.data
        const loadedName = typeof data?.nama === 'string' ? data.nama : ''
        setFullName(loadedName)
        setInitialFullName(loadedName)
        setInstitutionEmail(typeof data?.email === 'string' ? data.email : '')
      })
      .catch(() => {
        setFullName('')
        setInitialFullName('')
        setInstitutionEmail('')
      })

    fetch(`${apiConfig.baseUrl}/api/regulasi`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => {
        setRegulations(Array.isArray(json?.data) ? json.data : [])
      })
      .catch(() => setRegulations([]))

    fetch(`${apiConfig.baseUrl}/api/admin/pengaturan`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json?.data as SettingsResponse | undefined
        setEmailAlert(Boolean(data?.email_alert_darurat))
        setWeeklyRecap(Boolean(data?.ringkasan_laporan))
        setTwoFactorEnabled(Boolean(data?.two_factor_enabled))
      })
      .catch(() => {
        setEmailAlert(true)
        setWeeklyRecap(false)
      })

    setWeeklyRecapLoading(true)
    fetch(`${apiConfig.baseUrl}/api/admin/pengaturan/weekly-recap-preview`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => {
        setWeeklyRecapPreview(json?.data ?? null)
      })
      .catch(() => setWeeklyRecapPreview(null))
      .finally(() => setWeeklyRecapLoading(false))
  }, [token])

  const saveNotificationSettings = async (next: Partial<SettingsResponse>) => {
    if (!token) return

    setSettingsSaving(true)

    try {
      await fetch(`${apiConfig.baseUrl}/api/admin/pengaturan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(next),
      })
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleToggleEmailAlert = (value: boolean) => {
    setEmailAlert(value)
    void saveNotificationSettings({ email_alert_darurat: value ? 1 : 0 })
  }

  const handleToggleWeeklyRecap = (value: boolean) => {
    setWeeklyRecap(value)
    void saveNotificationSettings({ ringkasan_laporan: value ? 1 : 0 })
  }

  const openTwoFactorModal = () => {
    setTwoFactorStep('qr')
    setTwoFactorOtp('')
    setTwoFactorMessage('')
    setIsTwoFactorModalOpen(true)

    if (!token) return

    fetch(`${apiConfig.baseUrl}/api/auth/2fa/setup`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => {
        setTwoFactorQrUrl(typeof json?.data?.qr_url === 'string' ? json.data.qr_url : '')
      })
      .catch(() => setTwoFactorQrUrl(''))
  }

  const handleTwoFactorContinue = () => {
    setTwoFactorStep('otp')
    setTwoFactorMessage('')
  }

  const handleConfirmTwoFactor = async () => {
    if (!token || !twoFactorOtp.trim()) return

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/auth/2fa/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: twoFactorOtp.trim() }),
      })

      const json = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(json?.message ?? 'OTP tidak valid')
      }

      setTwoFactorEnabled(true)
      setTwoFactorMessage('2FA berhasil diaktifkan')
      setTwoFactorStep('success')
    } catch (error) {
      setTwoFactorMessage(error instanceof Error ? error.message : 'OTP tidak valid')
    }
  }

  const handleDisableTwoFactor = async () => {
    if (!token) return

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/auth/2fa`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const json = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menonaktifkan 2FA')
      }

      setTwoFactorEnabled(false)
      setTwoFactorMessage('2FA berhasil dinonaktifkan')
    } catch (error) {
      setTwoFactorMessage(error instanceof Error ? error.message : 'Gagal menonaktifkan 2FA')
    }
  }

  const handleSaveProfile = async () => {
    if (!token || !fullName.trim()) return

    setProfileSaving(true)
    setProfileMessage('')

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama: fullName.trim() }),
      })

      const json = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menyimpan profil')
      }

      setFullName(typeof json?.data?.nama === 'string' ? json.data.nama : fullName.trim())
      setInitialFullName(typeof json?.data?.nama === 'string' ? json.data.nama : fullName.trim())
      setProfileMessage('Nama lengkap berhasil diperbarui')
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'Gagal menyimpan profil')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleAddRegulation = async () => {
    if (!newRegulation.trim() || !token) return

    setRegulationSaving(true)
    setRegulationMessage('')

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/admin/regulasi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_kriteria: newRegulation.trim(),
          deskripsi: `Parameter otomatis untuk ${newRegulation.trim()}`,
        }),
      })

      const json = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menambahkan regulasi')
      }

      if (json?.data) {
        setRegulations((current) => [...current, json.data])
      }
      setRegulationMessage('Parameter regulasi berhasil ditambahkan')
      setNewRegulation('')
      setIsModalOpen(false)
    } catch (error) {
      setRegulationMessage(error instanceof Error ? error.message : 'Gagal menambahkan regulasi')
    } finally {
      setRegulationSaving(false)
    }
  }

  const handleDeleteRegulation = async (id: number) => {
    if (!token) return

    setRegulationMessage('')

    const response = await fetch(`${apiConfig.baseUrl}/api/admin/regulasi/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return
    }

    setRegulations((current) => current.filter((item) => item.id_regulasi !== id))
    setRegulationMessage('Parameter regulasi berhasil dihapus')
  }

  const handlePasswordNext = async () => {
    if (passwordStep === 3) {
      setPasswordStep(0)
      setPwCurrent('')
      setPwNew('')
      setPwOtp('')
      setPasswordMessage('')
      return
    }

    if (passwordStep === 1) {
      setPasswordStep(2)
      setPasswordMessage('')
      return
    }

    if (passwordStep === 2 && twoFactorEnabled) {
      if (!isStrongPassword(pwNew)) {
        setPasswordMessage(passwordRequirementText)
        return
      }

      setPasswordStep(4)
      setPasswordMessage('')
      return
    }

    if (passwordStep === 2 || passwordStep === 4) {
      if (!token || !pwCurrent || !pwNew) return

      if (!isStrongPassword(pwNew)) {
        setPasswordMessage(passwordRequirementText)
        return
      }

      setPasswordSaving(true)
      setPasswordMessage('')

      try {
        const response = await fetch(`${apiConfig.baseUrl}/api/auth/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password_lama: pwCurrent,
            password_baru: pwNew,
            ...(twoFactorEnabled ? { otp: pwOtp.trim() } : {}),
          }),
        })

        const json = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(json?.message ?? 'Gagal mengganti kata sandi')
        }

        setPasswordMessage('Kata sandi berhasil diubah')
        setPasswordStep(3)
      } catch (error) {
        setPasswordMessage(error instanceof Error ? error.message : 'Gagal mengganti kata sandi')
      } finally {
        setPasswordSaving(false)
      }
    }
  }

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar p-[15px]">
      <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-6" style={{ color: tokens.colors.slate[700] }}>
          Pengaturan Akun & Regulasi
        </h1>
        
        <div className="flex flex-col gap-6">
          <SectionCard title="Profil Pengguna">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email Instansi"
                value={institutionEmail}
                readOnly
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              {profileMessage ? (
                <p className="text-sm" style={{ color: profileMessage.toLowerCase().includes('berhasil') ? '#15803d' : '#dc2626' }}>
                  {profileMessage}
                </p>
              ) : <span />}

              {fullName.trim() !== initialFullName.trim() ? (
                <Button onClick={handleSaveProfile} disabled={profileSaving || !fullName.trim()}>
                  {profileSaving ? 'Menyimpan...' : 'Simpan Nama'}
                </Button>
              ) : <span />}
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Notifikasi Laporan">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Email Alert Darurat</span>
                  <Toggle checked={emailAlert} onChange={handleToggleEmailAlert} />
                </div>
                <p className="text-xs text-slate-500">Alert ini dipakai untuk peringatan login admin dari IP/lokasi yang berbeda dari login sebelumnya.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Rekap Mingguan</span>
                  <Toggle checked={weeklyRecap} onChange={handleToggleWeeklyRecap} />
                </div>
                <p className="text-xs text-slate-500">Rekap memuat overview 7 hari terakhir dan laporan yang sudah pernah ditindak/di-check.</p>
                {settingsSaving ? <p className="text-xs text-slate-500">Menyimpan pengaturan...</p> : null}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <h3 className="mb-3 font-semibold text-slate-800">Preview Rekap Mingguan</h3>
                  {weeklyRecapLoading ? (
                    <p className="text-slate-500">Memuat preview rekap...</p>
                  ) : weeklyRecapPreview ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><span className="block text-slate-500">Laporan Masuk</span><span className="font-medium text-slate-900">{weeklyRecapPreview.overview.laporan_masuk_7_hari}</span></div>
                        <div><span className="block text-slate-500">Diproses</span><span className="font-medium text-slate-900">{weeklyRecapPreview.overview.laporan_diproses_7_hari}</span></div>
                        <div><span className="block text-slate-500">Selesai</span><span className="font-medium text-slate-900">{weeklyRecapPreview.overview.laporan_selesai_7_hari}</span></div>
                        <div><span className="block text-slate-500">Ditolak</span><span className="font-medium text-slate-900">{weeklyRecapPreview.overview.laporan_ditolak_7_hari}</span></div>
                      </div>
                      <div>
                        <p className="mb-2 text-slate-500">Laporan yang sudah di-check</p>
                        <div className="space-y-2">
                          {weeklyRecapPreview.checked_reports.length ? weeklyRecapPreview.checked_reports.map((item) => (
                            <div key={item.id_laporan} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                              <p className="font-medium text-slate-900">{item.judul_laporan}</p>
                              <p className="text-xs text-slate-500">{item.kode_laporan} • {item.status_laporan} • {new Date(item.updated_at).toLocaleDateString('id-ID')}</p>
                            </div>
                          )) : <p className="text-slate-500">Belum ada laporan yang ditindak minggu ini.</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500">Preview rekap belum tersedia.</p>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Keamanan Akun">
              <div className="flex flex-col gap-4 items-start">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordStep(1)
                    setPwCurrent('')
                    setPwNew('')
                    setPwOtp('')
                    setPasswordMessage('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: tokens.colors.slate[900] }}
                >
                  Ganti Kata Sandi
                </button>
                <button
                  type="button"
                  onClick={twoFactorEnabled ? () => void handleDisableTwoFactor() : openTwoFactorModal}
                  className="px-4 py-2 text-sm font-medium border rounded-lg transition-colors hover:bg-slate-50"
                  style={{ borderColor: tokens.colors.slate[200], color: tokens.colors.slate[700] }}
                >
                  {twoFactorEnabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA'}
                </button>
                {twoFactorEnabled ? <p className="text-xs text-green-700">2FA aktif untuk akun ini.</p> : null}
                {twoFactorMessage && !isTwoFactorModalOpen ? (
                  <p className="text-xs" style={{ color: twoFactorMessage.toLowerCase().includes('berhasil') ? '#15803d' : '#dc2626' }}>{twoFactorMessage}</p>
                ) : null}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Parameter Regulasi">
            <div className="flex flex-wrap gap-2">
              {regulations.map((reg) => (
                <Badge key={reg.id_regulasi} onClick={() => handleDeleteRegulation(reg.id_regulasi)}>{reg.nama_kriteria}</Badge>
              ))}
              <Badge variant="dashed" onClick={() => setIsModalOpen(true)}>+ Tambah Baru</Badge>
            </div>
            {regulationMessage ? (
              <p className="mt-3 text-sm" style={{ color: regulationMessage.toLowerCase().includes('berhasil') ? '#15803d' : '#dc2626' }}>
                {regulationMessage}
              </p>
            ) : null}
          </SectionCard>
        </div>
      </div>

      {/* Regulation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tambah Parameter Regulasi"
        description="Masukkan aturan atau parameter baru untuk deteksi pelanggaran otomatis."
      >
        <div className="flex flex-col gap-5 mt-2">
          <Input 
            label="Nama Parameter" 
            placeholder="Contoh: Bunga di atas 0.4%" 
            value={newRegulation}
            onChange={(e) => setNewRegulation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddRegulation()
            }}
          />
          {regulationMessage ? (
            <p className="text-sm" style={{ color: regulationMessage.toLowerCase().includes('berhasil') ? '#15803d' : '#dc2626' }}>
              {regulationMessage}
            </p>
          ) : null}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddRegulation} disabled={regulationSaving || !newRegulation.trim()}>{regulationSaving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        title={twoFactorStep === 'qr' ? 'Aktifkan 2FA' : twoFactorStep === 'otp' ? 'Konfirmasi OTP' : '2FA Berhasil'}
        description={twoFactorStep === 'qr' ? 'Scan QR ini dengan Google Authenticator.' : twoFactorStep === 'otp' ? 'Masukkan kode OTP 6 digit dari aplikasi authenticator.' : '2FA sudah aktif untuk akun ini.'}
      >
        <div className="flex flex-col gap-5">
          {twoFactorStep === 'qr' && (
            <>
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {twoFactorQrUrl ? (
                  <img src={twoFactorQrUrl} alt="QR code 2FA" className="h-[220px] w-[220px] rounded-xl border border-slate-200 bg-white p-2" />
                ) : (
                  <p className="text-sm text-slate-500">Menyiapkan QR...</p>
                )}
                <p className="text-center text-sm text-slate-500">Scan QR ini, lalu klik Continue untuk masuk ke verifikasi OTP.</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsTwoFactorModalOpen(false)}>Batal</Button>
                <Button onClick={handleTwoFactorContinue} disabled={!twoFactorQrUrl}>Continue</Button>
              </div>
            </>
          )}

          {twoFactorStep === 'otp' && (
            <>
              <Input
                label="OTP 6 Digit"
                placeholder="000000"
                value={twoFactorOtp}
                onChange={(e) => setTwoFactorOtp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && twoFactorOtp) void handleConfirmTwoFactor()
                }}
              />
              {twoFactorMessage ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{twoFactorMessage}</p>
              ) : null}
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setTwoFactorStep('qr')}>Kembali</Button>
                <Button onClick={() => void handleConfirmTwoFactor()} disabled={!twoFactorOtp.trim()}>Konfirmasi</Button>
              </div>
            </>
          )}

          {twoFactorStep === 'success' && (
            <>
              <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{twoFactorMessage}</p>
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsTwoFactorModalOpen(false)}>Selesai</Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Password Flow Modal */}
      <Modal
        isOpen={passwordStep !== 0}
        onClose={() => setPasswordStep(0)}
        title={
          passwordStep === 1 ? 'Masukkan Kata Sandi Saat Ini' :
          passwordStep === 2 ? 'Buat Kata Sandi Baru' :
          passwordStep === 4 ? 'Verifikasi OTP' : 'Kata Sandi Berhasil Diubah'
        }
        description={
          passwordStep === 1 ? 'Verifikasi akun dengan kata sandi yang sedang dipakai.' :
          passwordStep === 2 ? 'Pastikan kata sandi baru Anda kuat dan belum pernah digunakan.' :
          passwordStep === 4 ? 'Karena 2FA aktif, masukkan OTP dari Google Authenticator.' : 'Perubahan kata sandi sudah berhasil disimpan.'
        }
      >
        <div className="flex flex-col gap-5 mt-2">
          {passwordStep === 1 && (
            <Input 
              label="Kata Sandi Saat Ini" 
              type="password"
              placeholder="••••••••" 
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pwCurrent) void handlePasswordNext()
              }}
            />
          )}
          {passwordStep === 2 && (
            <div className="flex flex-col gap-1">
              <Input 
                label="Kata Sandi Baru" 
                type="password"
                placeholder="••••••••" 
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pwNew) void handlePasswordNext()
                }}
              />
              <span className="text-xs text-slate-400">
                {passwordRequirementText}
              </span>
            </div>
          )}
          {passwordStep === 4 && (
            <Input
              label="OTP Google Authenticator"
              type="text"
              placeholder="000000"
              value={pwOtp}
              onChange={(e) => setPwOtp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pwOtp) void handlePasswordNext()
              }}
            />
          )}
          {passwordStep === 3 && (
            <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {passwordMessage || 'Kata sandi berhasil diubah'}
            </p>
          )}

          {passwordStep !== 3 && passwordMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {passwordMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setPasswordStep(0)}>Batal</Button>
            <Button 
              onClick={() => void handlePasswordNext()} 
              disabled={
                passwordSaving ||
                (passwordStep === 1 && !pwCurrent) ||
                (passwordStep === 2 && !pwNew) ||
                (passwordStep === 4 && !pwOtp)
              }
            >
              {passwordSaving ? 'Menyimpan...' : passwordStep === 1 ? 'Lanjut' : passwordStep === 2 ? (twoFactorEnabled ? 'Lanjut OTP' : 'Simpan Sandi') : passwordStep === 4 ? 'Simpan Sandi' : 'Selesai'}
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  )
}
