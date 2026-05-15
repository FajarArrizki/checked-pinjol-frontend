import { apiConfig } from '../config/api'

export function buildArticleImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const normalizedPath = path.replace(/^\/+/, '')

  if (normalizedPath.startsWith('storage/uploads/')) {
    return `${apiConfig.baseUrl}/api/uploads/${normalizedPath}`
  }

  return `${apiConfig.baseUrl}/${normalizedPath}`
}
