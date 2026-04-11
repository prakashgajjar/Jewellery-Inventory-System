import React, { createContext, useState, useContext, useEffect } from 'react'
import { getUserInfo, getToken, clearAuthData } from '../utils/authUtils'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = getToken()
    const storedUser = getUserInfo()

    if (token && storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_info', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    clearAuthData()
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'ADMIN',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
