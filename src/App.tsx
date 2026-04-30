import { AppLayout } from './layouts/AppLayout'
import { FeatureCard } from './components/FeatureCard'
import { appConfig } from './config/app'

const featureItems = [
  {
    title: 'Reusable structure',
    description:
      'Folder awal dipisah agar komponen, layout, hooks, service, dan utility bisa berkembang tanpa saling campur.',
  },
  {
    title: 'Ready for API integration',
    description:
      'Struktur service dan types sudah disiapkan supaya integrasi frontend ke backend PHP bisa tetap rapi.',
  },
  {
    title: 'Workflow friendly',
    description:
      'README menjelaskan cara kerja development, naming, dan cara membuat komponen yang reusable.',
  },
]

function App() {
  return (
    <AppLayout>
      <section className="rounded-[28px] border border-slate-700/40 bg-[linear-gradient(180deg,rgba(14,165,233,0.08),rgba(10,20,37,0.88))] bg-slate-900/95 p-12 shadow-[0_24px_80px_rgba(2,8,23,0.38)] max-[900px]:px-6 max-[900px]:py-8 max-sm:rounded-3xl max-sm:px-5 max-sm:py-7">
        <span className="inline-flex rounded-full bg-sky-400/15 px-3 py-2 text-[0.9rem] font-semibold text-sky-300">
          Vite + React + TypeScript + Tailwind CSS
        </span>
        <h1 className="my-[18px] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-bold text-slate-50">
          {appConfig.name}
        </h1>
        <p className="m-0 max-w-[720px] text-[1.05rem] text-slate-300 max-sm:text-base">
          {appConfig.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-3 max-sm:flex-col">
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-400 px-[18px] font-semibold text-sky-950 transition-colors hover:bg-sky-500"
            href={appConfig.repositoryGuide}
          >
            Buka README Workflow
          </a>
          <span className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700/40 bg-slate-900/70 px-[18px] font-semibold text-slate-200">
            Initial project ready
          </span>
        </div>
      </section>

      <section
        className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1"
        aria-label="Initial highlights"
      >
        {featureItems.map((item) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </section>
    </AppLayout>
  )
}

export default App
