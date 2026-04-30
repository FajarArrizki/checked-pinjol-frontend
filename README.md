# checked-pinjol-frontend

Initial frontend project menggunakan Vite + React + TypeScript.

Project ini dibuat sebagai pondasi awal yang rapi, mudah dikembangkan, dan mendukung pola komponen reusable untuk kebutuhan dashboard, landing page, atau aplikasi internal selanjutnya.

## Stack

- Vite
- React 19
- TypeScript
- ESLint

## Cara Menjalankan

Pastikan Node.js versi 18+ sudah terpasang.

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint project:

```bash
npm run lint
```

## Struktur Folder

```text
src/
  assets/        static asset seperti image dan icon
  components/    reusable UI component
  config/        konfigurasi aplikasi
  hooks/         custom hooks
  layouts/       layout wrapper halaman
  pages/         page-level component
  services/      integrasi API atau service layer
  types/         shared TypeScript types
  utils/         helper function murni
```

## Workflow Development

Gunakan alur kerja ini agar codebase tetap konsisten.

1. Mulai dari `pages` untuk kebutuhan halaman.
2. Pindahkan UI yang dipakai lebih dari satu tempat ke `components`.
3. Simpan wrapper atau struktur umum halaman di `layouts`.
4. Simpan logic yang bisa dipakai ulang ke `hooks`.
5. Simpan helper murni tanpa ketergantungan React ke `utils`.
6. Simpan request API, adapter data, atau pemanggilan backend di `services`.
7. Simpan type global atau shared interface di `types`.

## Aturan Reusable Component

Supaya komponen tetap reusable dan tidak cepat berantakan:

1. Buat komponen fokus pada satu tanggung jawab.
2. Gunakan props yang jelas dan typed.
3. Hindari hardcode data di dalam komponen reusable.
4. Pisahkan presentational component dari data fetching.
5. Jika komponen hanya dipakai satu halaman, taruh dulu dekat halaman itu. Pindahkan ke `components` saat mulai dipakai ulang.

Contoh pola sederhana:

```tsx
type CardProps = {
  title: string
  description: string
}

export function Card({ title, description }: CardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
```

## Workflow Integrasi Backend PHP

Kalau nanti frontend ini dihubungkan ke backend PHP, pola yang disarankan:

1. Endpoint backend tetap jadi source of truth.
2. Semua request HTTP ditaruh di `services`.
3. Mapping response API ke type TypeScript supaya frontend lebih aman.
4. Jangan campur fetch API langsung di banyak komponen.

Contoh arah struktur:

```text
src/
  services/
    auth.service.ts
    user.service.ts
    loan.service.ts
  types/
    api.ts
    user.ts
    loan.ts
```

## Naming Convention

1. Component gunakan `PascalCase`, contoh `FeatureCard.tsx`.
2. Hook gunakan `camelCase` dengan prefix `use`, contoh `useAuth.ts`.
3. Utility gunakan nama deskriptif, contoh `formatCurrency.ts`.
4. Service gunakan suffix `.service.ts`, contoh `auth.service.ts`.

## Initial Scope Saat Ini

Saat ini project sudah berisi:

1. Scaffold Vite React TypeScript.
2. Struktur folder awal untuk scale up.
3. Layout dasar dan contoh reusable component.
4. README workflow untuk pengembangan berikutnya.

## Next Step yang Cocok

Langkah lanjutan yang biasanya dilakukan setelah init project:

1. Tambah React Router jika project sudah punya beberapa halaman.
2. Tambah layer API client untuk backend PHP.
3. Tambah design system dasar seperti button, input, card, modal.
4. Tambah state management jika kebutuhan data mulai kompleks.
