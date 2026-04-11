import { TOKEN_KEY, USER_KEY } from './constants'

// Store token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

// Get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// Remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// Store user info
export const setUserInfo = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Get user info
export const getUserInfo = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

// Remove user info
export const removeUserInfo = () => {
  localStorage.removeItem(USER_KEY)
}

// Clear all auth data
export const clearAuthData = () => {
  removeToken()
  removeUserInfo()
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken()
}

// Check if user is admin
export const isAdmin = () => {
  const user = getUserInfo()
  return user && user.role === 'ADMIN'
}
