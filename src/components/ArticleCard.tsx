import { articleCardConfig } from './config/article-card'
import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

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
      className={`overflow-hidden flex flex-col ${className}`}
      style={{
        ...surfaceConfig.card,
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-44 object-cover"
      />
      <div className="flex flex-col gap-2 p-4 flex-1">
        <span
          className="inline-flex self-start rounded-full px-3 py-1 text-xs font-medium"
          style={{
            borderRadius: tokens.radius.full,
            backgroundColor: articleCardConfig.category.backgroundColor,
            color: articleCardConfig.category.color,
          }}
        >
          {category}
        </span>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: tokens.colors.slate[900] }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: tokens.colors.slate[400] }}>
          {excerpt}
        </p>
        <button
          onClick={onClick}
          className="mt-auto self-start text-xs font-medium hover:underline flex items-center gap-1"
          style={{ color: articleCardConfig.readMore.color }}
        >
          Baca selengkapnya →
        </button>
      </div>
    </div>
  )
}
