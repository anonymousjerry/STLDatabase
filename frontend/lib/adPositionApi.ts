import { axiosInstance } from './axiosInstance'

// Normalize helpers
const normalizePosition = (pos?: string): string => (pos || '').toString().trim().toLowerCase()

// Fetch all ads from backend and filter on client to ensure compatibility
export const getAllActiveAdPositions = async (): Promise<AdPosition[]> => {
  try {
    const response = await axiosInstance.get('/categories/advertisements')
    console.log("all", response.data)
    const all: AdPosition[] = response.data || []
    const now = new Date()
    const active = all
      .filter(a => a && a.enabled === true)
      .filter(a => {
        if (!a.startDate && !a.endDate) return true
        const startOk = a.startDate ? new Date(a.startDate) <= now : true
        const endOk = a.endDate ? new Date(a.endDate) >= now : true
        return startOk && endOk
      })
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
      .map(a => ({ ...a, id: a.id }))

    if (typeof window !== 'undefined') {
      console.debug('[Ads] Active ads:', active.map(a => ({ id: a.id, page: a.page, position: a.position })))
    }

    return active
  } catch (error) {
    console.error('Failed to fetch advertisements:', error)
    return []
  }
}

export const getActiveAdPositions = async (page: string): Promise<AdPosition[]> => {
  const all = await getAllActiveAdPositions()
  return all.filter(a => a.page === (page as any))
}

export const getAdPositionsByPositions = async (positions: string[]): Promise<AdPosition[]> => {
  if (!positions || positions.length === 0) return []
  const all = await getAllActiveAdPositions()
  const normalizedTargets = new Set(positions.map(normalizePosition))
  const matched = all.filter(a => normalizedTargets.has(normalizePosition(a.position)))

  if (matched.length === 0 && typeof window !== 'undefined') {
    console.warn('[Ads] No matches for', positions, 'available:', all.map(a => a.position))
  }
  return matched
}