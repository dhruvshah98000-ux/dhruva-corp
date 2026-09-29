/**
 * Add days to a date and return a new Date.
 * Server-side only — never trust date calculations from the client.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false // permanent
  return new Date(expiresAt) < new Date()
}
