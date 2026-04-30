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
      <section className="hero-section">
        <span className="eyebrow">Vite + React + TypeScript</span>
        <h1>{appConfig.name}</h1>
        <p className="hero-copy">{appConfig.description}</p>

        <div className="hero-actions">
          <a className="button button-primary" href={appConfig.repositoryGuide}>
            Buka README Workflow
          </a>
          <span className="button button-secondary">Initial project ready</span>
        </div>
      </section>

      <section className="section-grid" aria-label="Initial highlights">
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
