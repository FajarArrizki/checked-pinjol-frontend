import { useState } from 'react'
import {
  Input,
  Toggle,
  SectionCard,
  Badge,
  Modal,
  Button
} from '../components'
import { tokens } from '../config/tokens'

export function RegulatorSettingsPage() {
  const [emailAlert, setEmailAlert] = useState(true)
  const [weeklyRecap, setWeeklyRecap] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRegulation, setNewRegulation] = useState('')
  const [regulations, setRegulations] = useState([
    'Bunga Tinggi',
    'Penagihan Kasar',
    'Penyebaran Data'
  ])

  // Password Flow State
  const [passwordStep, setPasswordStep] = useState<0 | 1 | 2 | 3>(0)
  const [pwEmail, setPwEmail] = useState('')
  const [pwCode, setPwCode] = useState('')
  const [pwNew, setPwNew] = useState('')

  const handleAddRegulation = () => {
    if (newRegulation.trim()) {
      setRegulations([...regulations, newRegulation.trim()])
      setNewRegulation('')
      setIsModalOpen(false)
    }
  }

  const handlePasswordNext = () => {
    if (passwordStep === 3) {
      // Done
      setPasswordStep(0)
      setPwEmail('')
      setPwCode('')
      setPwNew('')
    } else {
      setPasswordStep((prev) => (prev + 1) as 1 | 2 | 3)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 p-[15px]">
      <div>
        <h1 className="text-2xl font-semibold mb-6" style={{ color: tokens.colors.slate[800] }}>
          Pengaturan Akun & Regulasi
        </h1>
        
        <div className="flex flex-col gap-6">
          <SectionCard title="Profil Pengguna">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Lengkap"
                defaultValue="John Doe"
                readOnly
              />
              <Input
                label="Email Instansi"
                defaultValue="john.doe@regulator.go.id"
                readOnly
              />
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Notifikasi Laporan">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Email Alert Darurat</span>
                  <Toggle checked={emailAlert} onChange={setEmailAlert} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>Rekap Mingguan</span>
                  <Toggle checked={weeklyRecap} onChange={setWeeklyRecap} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Keamanan Akun">
              <div className="flex flex-col gap-4 items-start">
                <button
                  type="button"
                  onClick={() => setPasswordStep(1)}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: tokens.colors.slate[900] }}
                >
                  Ganti Kata Sandi
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium border rounded-lg transition-colors hover:bg-slate-50"
                  style={{ borderColor: tokens.colors.slate[200], color: tokens.colors.slate[700] }}
                >
                  Aktifkan 2FA
                </button>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Parameter Regulasi">
            <div className="flex flex-wrap gap-2">
              {regulations.map((reg, idx) => (
                <Badge key={idx}>{reg}</Badge>
              ))}
              <Badge variant="dashed" onClick={() => setIsModalOpen(true)}>+ Tambah Baru</Badge>
            </div>
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
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddRegulation}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Password Flow Modal */}
      <Modal
        isOpen={passwordStep !== 0}
        onClose={() => setPasswordStep(0)}
        title={
          passwordStep === 1 ? "Verifikasi Email" :
          passwordStep === 2 ? "Masukkan Kode" : "Buat Kata Sandi Baru"
        }
        description={
          passwordStep === 1 ? "Masukkan email instansi Anda untuk menerima kode verifikasi." :
          passwordStep === 2 ? "Kode verifikasi 6 digit telah dikirim ke email Anda." : "Pastikan kata sandi baru Anda kuat dan belum pernah digunakan."
        }
      >
        <div className="flex flex-col gap-5 mt-2">
          {passwordStep === 1 && (
            <Input 
              label="Email Instansi" 
              type="email"
              placeholder="nama@regulator.go.id" 
              value={pwEmail}
              onChange={(e) => setPwEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pwEmail) handlePasswordNext()
              }}
            />
          )}
          {passwordStep === 2 && (
            <Input 
              label="Kode Verifikasi" 
              placeholder="000000" 
              value={pwCode}
              onChange={(e) => setPwCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pwCode) handlePasswordNext()
              }}
            />
          )}
          {passwordStep === 3 && (
            <Input 
              label="Kata Sandi Baru" 
              type="password"
              placeholder="••••••••" 
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pwNew) handlePasswordNext()
              }}
            />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setPasswordStep(0)}>Batal</Button>
            <Button 
              onClick={handlePasswordNext} 
              disabled={
                (passwordStep === 1 && !pwEmail) ||
                (passwordStep === 2 && !pwCode) ||
                (passwordStep === 3 && !pwNew)
              }
            >
              {passwordStep === 1 ? 'Kirim Kode' : passwordStep === 2 ? 'Verifikasi' : 'Simpan Sandi'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
