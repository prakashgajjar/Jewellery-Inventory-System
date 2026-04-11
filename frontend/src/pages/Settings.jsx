import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { Save } from 'lucide-react'

const Settings = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-text-dark mb-6">Settings</h1>

        {/* Admin Settings */}
        <div className="bg-white rounded-softer shadow-soft p-6 mb-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">Gold & Silver Rates</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Gold Rate (per gram)</label>
              <input
                type="number"
                placeholder="₹6,500"
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Silver Rate (per gram)</label>
              <input
                type="number"
                placeholder="₹75"
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="w-full bg-primary text-white py-2 rounded-soft font-medium hover:opacity-90 flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Update Rates
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-softer shadow-soft p-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">System Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">GST Rate</label>
              <input
                type="number"
                placeholder="18"
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Low Stock Threshold</label>
              <input
                type="number"
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="w-full bg-primary text-white py-2 rounded-soft font-medium hover:opacity-90 flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
