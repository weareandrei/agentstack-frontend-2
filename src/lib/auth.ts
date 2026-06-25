import { ref } from 'vue'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const isLoggedIn = ref(!!localStorage.getItem(TOKEN_KEY))

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  isLoggedIn.value = true
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  isLoggedIn.value = false
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}
