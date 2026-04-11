import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
