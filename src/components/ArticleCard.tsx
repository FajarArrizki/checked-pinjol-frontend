type ArticleCardProps = {
  title: string
  excerpt: string
  category: string
  imageUrl: string
  onClick?: () => void
  className?: string
}

export function ArticleCard({
  title,
  excerpt,
  category,
  imageUrl,
  onClick,
  className = '',
}: ArticleCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col ${className}`}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-44 object-cover"
      />
      <div className="flex flex-col gap-2 p-4 flex-1">
        <span className="inline-flex self-start rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#0F6E56]">
          {category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {excerpt}
        </p>
        <button
          onClick={onClick}
          className="mt-auto self-start text-xs font-medium text-[#1D9E75] hover:underline flex items-center gap-1"
        >
          Baca selengkapnya →
        </button>
      </div>
    </div>
  )
}