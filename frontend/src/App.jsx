import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Billing from './pages/Billing'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route
            path="/products"
            element={<ProtectedRoute component={Products} />}
          />
          <Route
            path="/customers"
            element={<ProtectedRoute component={Customers} />}
          />
          <Route
            path="/billing"
            element={<ProtectedRoute component={Billing} />}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute component={Orders} />}
          />
          <Route
            path="/reports"
            element={<ProtectedRoute component={Reports} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute component={Settings} adminOnly />}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
