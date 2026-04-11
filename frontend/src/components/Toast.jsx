import React from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

const Toast = ({ type = 'info', message, onClose }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[type]

  const borderColor = {
    success: 'border-l-4 border-l-green-500',
    error: 'border-l-4 border-l-red-500',
    warning: 'border-l-4 border-l-yellow-500',
    info: 'border-l-4 border-l-blue-500',
  }[type]

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }[type]

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }[type]

  return (
    <div className={`${bgColor} ${borderColor} rounded-md p-4 flex items-start gap-3 shadow-soft max-w-md`}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${textColor}`} />
      <p className={`text-sm font-medium ${textColor} flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
