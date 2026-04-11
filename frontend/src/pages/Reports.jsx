import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download } from 'lucide-react'

const Reports = () => {
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 24 },
    { month: 'Feb', sales: 3000, orders: 18 },
    { month: 'Mar', sales: 2000, orders: 15 },
    { month: 'Apr', sales: 2780, orders: 20 },
    { month: 'May', sales: 1890, orders: 14 },
  ]

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark">Reports</h1>
          <button className="bg-primary text-white px-4 py-2 rounded-soft flex items-center gap-2 hover:opacity-90">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '₹1,24,560' },
            { label: 'Total Orders', value: '156' },
            { label: 'Avg Order Value', value: '₹798' },
            { label: 'Low Stock Items', value: '12' },
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
              <BarChart data={salesData}>
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
              <LineChart data={salesData}>
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
