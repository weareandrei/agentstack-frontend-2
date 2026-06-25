import { clearToken, getRefreshToken, getToken, setTokens } from '@/lib/auth'

const apiBase = import.meta.env.VITE_API_BASE
if (!apiBase) {
  throw new Error('VITE_API_BASE is not set.')
}

export const API_BASE = apiBase.replace(/\/$/, '')

const docsApiBase = import.meta.env.VITE_DOCS_API_BASE
if (!docsApiBase) {
  throw new Error(
    'VITE_DOCS_API_BASE is not set.',
  )
}

export const DOCS_API_BASE = docsApiBase.replace(/\/$/, '')

const NO_REFRESH_PATHS = ['/account/login', '/account/create', '/account/refresh']

let refreshPromise: Promise<boolean> | null = null

const shouldAttemptRefresh = (address: string): boolean => {
  return !NO_REFRESH_PATHS.some((path) => address.startsWith(path))
}

const refreshAccessToken = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise

  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE}/account/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) return false

      const data = (await response.json()) as {
        access_token: string
        refresh_token: string
      }
      setTokens(data.access_token, data.refresh_token)
      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

const request = async (address: string, options: RequestInit = {}, retried = false) => {
  const token = getToken()
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(API_BASE + address, { ...options, headers }).catch((cause) => {
    throw new Error(`Request to ${address} failed: network error`, { cause })
  })

  if (response.status === 401 && !retried && shouldAttemptRefresh(address)) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return request(address, options, true)

    clearToken()
    window.location.assign('/sign-in')
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(
      `Request to ${address} failed: ${response.status} ${response.statusText} ${body}`.trim(),
    )
  }

  if (response.status === 204) return null

  return await response.json()
}

const buildQuery = (params?: Record<string, string | undefined>): string => {
  if (!params) return ''

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}

const api = {
  get: (address: string, params?: Record<string, string | undefined>) =>
    request(address + buildQuery(params)),
  post: (address: string, body?: unknown) =>
    request(address, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: (address: string, body?: unknown) =>
    request(address, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: (address: string) =>
    request(address, {
      method: 'DELETE',
    }),
}

export default api
