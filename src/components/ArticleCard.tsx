import { articleCardConfig } from './config/article-card'
import { tokens } from '../config/tokens'

function normalizeExcerpt(text: string): string {
  if (!text) return ''
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .trim()
}

type ArticleCardProps = {
  id?: string
  title: string
  excerpt: string
  category: string
  imageUrl?: string
  author?: string
  publishedAt?: string
  onClick?: () => void
  className?: string
}

export function ArticleCard({
  title,
  excerpt,
  category,
  imageUrl,
  author,
  publishedAt,
  onClick,
  className = '',
}: ArticleCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 p-5 bg-white border cursor-pointer hover:shadow-md transition-shadow ${className}`.trim()}
      style={{
        borderRadius: '1.25rem',
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
      onClick={onClick}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full aspect-[16/9] object-cover"
          style={{ borderRadius: '0.875rem' }}
        />
      ) : (
        <div
          className="flex aspect-[16/9] w-full items-center justify-center"
          style={{ borderRadius: '0.875rem', backgroundColor: tokens.colors.slate[100], color: tokens.colors.slate[400] }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h12A2.25 2.25 0 0 1 20.25 7.5v9A2.25 2.25 0 0 1 18 18.75H6a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 15 2.25-2.25 2.25 2.25 3-3 3 3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h.008v.008H9V9.75Z" />
          </svg>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold leading-snug line-clamp-2" style={{ color: tokens.colors.slate[900] }}>
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: tokens.colors.slate[500] }}>
          <span
            className="inline-flex self-start px-3 py-1 text-[13px] font-bold border"
            style={{
              borderRadius: tokens.radius.full,
              backgroundColor: tokens.colors.brand.soft,
              borderColor: '#A7F3D0',
              color: tokens.colors.slate[900],
            }}
          >
            {category}
          </span>
          {(author || publishedAt) && (
            <span>
              {author ? `Oleh ${author}` : ''}{author && publishedAt ? ' • ' : ''}{publishedAt ? new Date(publishedAt).toLocaleDateString('id-ID') : ''}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: tokens.colors.slate[500] }}>
          {normalizeExcerpt(excerpt)}
        </p>
        <button
          onClick={onClick}
          className="mt-1 self-start text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: articleCardConfig.readMore.color }}
        >
          Baca selengkapnya
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}