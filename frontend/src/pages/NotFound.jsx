import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <FileQuestion className="w-24 h-24 text-primary mx-auto mb-6 opacity-50" />
        <h1 className="text-4xl font-bold text-text-dark mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-soft font-medium hover:opacity-90 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
