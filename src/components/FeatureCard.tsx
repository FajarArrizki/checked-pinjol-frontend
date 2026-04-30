type FeatureCardProps = {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="rounded-[20px] border border-slate-700/40 bg-slate-950/60 p-6 shadow-[0_24px_80px_rgba(2,8,23,0.38)] backdrop-blur-xl">
      <h2 className="mb-3 text-[1.2rem] font-semibold text-slate-50">{title}</h2>
      <p className="m-0 text-slate-300">{description}</p>
    </article>
  )
}
