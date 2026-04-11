import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download } from 'lucide-react'
import { reportService } from '../services'
import Toast from '../components/Toast'

const Reports = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    lowStockItems: 0,
    chartData: []
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const data = await reportService.getDashboard()
      setStats(data)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load report data' })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setToast({ type: 'success', message: 'Exporting report...' })
      const data = await reportService.exportReport()
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'inventory_report.xlsx')
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to export report' })
    }
  }

  return (
    <MainLayout>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark">Reports</h1>
          <button onClick={handleExport} className="bg-primary text-white px-4 py-2 rounded-soft flex items-center gap-2 hover:opacity-90">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}` },
            { label: 'Total Orders', value: stats.totalOrders },
            { label: 'Avg Order Value', value: `₹${stats.avgOrderValue.toLocaleString()}` },
            { label: 'Low Stock Items', value: stats.lowStockItems },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-softer shadow-soft p-6">
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-text-dark mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-softer shadow-soft p-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">Monthly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#6B7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-softer shadow-soft p-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">Monthly Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#6B7280" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Reports
