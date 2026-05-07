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
      className={`flex flex-col gap-4 p-4 bg-white border ${className}`.trim()}
      style={{
        borderRadius: '1.25rem', // rounded-2xl
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full aspect-[16/9] object-cover"
        style={{ borderRadius: '0.75rem' }} // rounded-xl
      />
      <div className="flex flex-col gap-3">
        <span
          className="inline-flex self-start px-3 py-1 text-xs font-bold border"
          style={{
            borderRadius: tokens.radius.full,
            backgroundColor: tokens.colors.brand.soft,
            borderColor: '#A7F3D0',
            color: tokens.colors.slate[900],
          }}
        >
          {category}
        </span>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: tokens.colors.slate[900] }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: tokens.colors.slate[500] }}>
          {excerpt}
        </p>
        <button
          onClick={onClick}
          className="mt-1 self-start text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: articleCardConfig.readMore.color }}
        >
          Baca selengkapnya
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
