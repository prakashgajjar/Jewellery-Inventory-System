import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Package, Users, ShoppingCart } from 'lucide-react'
import { rateService, productService, orderService } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const [rates, setRates] = useState(null)
  const [stats, setStats] = useState({
    lowStockCount: 0,
    totalCustomers: 0,
    totalOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Try to fetch real data
        const [rateData, lowStockData] = await Promise.all([
          rateService.getLatest().catch(() => ({ goldRate: 6500, silverRate: 75 })),
          productService.getLowStock(10).catch(() => []),
        ])

        setRates(rateData?.goldRate ? rateData : { goldRate: 6500, silverRate: 75 })
        setStats({
          lowStockCount: Array.isArray(lowStockData) ? lowStockData.length : 0,
          totalCustomers: 0, // Will be updated from API
          totalOrders: 0, // Will be updated from API
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        // Use default mock data
        setRates({ goldRate: 6500, silverRate: 75 })
        setStats({
          lowStockCount: 0,
          totalCustomers: 0,
          totalOrders: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <LoadingSpinner />

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ]

  const pieData = [
    { name: 'Rings', value: 35 },
    { name: 'Bracelets', value: 25 },
    { name: 'Necklaces', value: 20 },
    { name: 'Others', value: 20 },
  ]

  const COLORS = ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB']

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white rounded-softer shadow-soft p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-text-dark mt-2">₹24,580</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
            <p className="text-xs text-green-600 mt-4">+12% from last month</p>
          </div>

          {/* Total Stock */}
          <div className="bg-white rounded-softer shadow-soft p-6 border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Stock</p>
                <p className="text-2xl font-bold text-text-dark mt-2">856</p>
              </div>
              <Package className="w-8 h-8 text-green-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-4">{stats.lowStockCount} items low on stock</p>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-softer shadow-soft p-6 border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <p className="text-2xl font-bold text-text-dark mt-2">{stats.totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-4">+8 new this month</p>
          </div>

          {/* Current Rate */}
          <div className="bg-white rounded-softer shadow-soft p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Gold Rate</p>
                <p className="text-2xl font-bold text-text-dark mt-2">
                  ₹{rates?.goldRate || 0}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-4">Updated today</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-white rounded-softer shadow-soft p-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#6B7280"
                  strokeWidth={2}
                  dot={{ fill: '#6B7280' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  dot={{ fill: '#9CA3AF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution */}
          <div className="bg-white rounded-softer shadow-soft p-6">
            <h2 className="text-lg font-bold text-text-dark mb-4">Product Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-softer shadow-soft p-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-soft hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-text-dark">Order #{1001 + i}</p>
                  <p className="text-xs text-gray-500">Customer Name</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text-dark">₹5,280</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
