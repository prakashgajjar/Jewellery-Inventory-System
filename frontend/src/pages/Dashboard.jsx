import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Package, Users, ShoppingCart } from 'lucide-react'
import { rateService, productService, orderService, customerService, reportService } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const [rates, setRates] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [pieData, setPieData] = useState([])
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState({
    lowStockCount: 0,
    totalStock: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rateData, reportData, customersData, productsData, ordersData] = await Promise.all([
          rateService.getLatest().catch(() => ({ goldRate: 6500, silverRate: 75 })),
          reportService.getDashboard().catch(() => null),
          customerService.getAll().catch(() => []),
          productService.getAll().catch(() => []),
          orderService.getAll().catch(() => [])
        ])

        setRates(rateData?.goldRate ? rateData : { goldRate: 6500, silverRate: 75 })
        
        const totalStock = productsData.reduce((sum, p) => sum + p.stock, 0)

        if (reportData) {
          setChartData(reportData.chartData || [])
          setStats({
            lowStockCount: reportData.lowStockItems || 0,
            totalStock: totalStock,
            totalCustomers: Array.isArray(customersData) ? customersData.length : 0,
            totalOrders: reportData.totalOrders || 0,
            totalRevenue: reportData.totalRevenue || 0,
          })
        }

        // Calculate pieData
        const distribution = {}
        productsData.forEach(p => {
          distribution[p.type] = (distribution[p.type] || 0) + 1
        })
        const calculatedPieData = Object.keys(distribution).map(type => ({
          name: type,
          value: distribution[type]
        }))
        setPieData(calculatedPieData)

        // Calculate recent orders
        const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        setRecentOrders(sortedOrders)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <LoadingSpinner />

  const COLORS = ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#4B5563', '#374151', '#1f2937', '#111827']

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
                <p className="text-2xl font-bold text-text-dark mt-2">₹{stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
            <p className="text-xs text-green-600 mt-4">{stats.totalOrders} total completed orders</p>
          </div>

          {/* Total Stock */}
          <div className="bg-white rounded-softer shadow-soft p-6 border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Stock</p>
                <p className="text-2xl font-bold text-text-dark mt-2">{stats.totalStock}</p>
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
              <LineChart data={chartData}>
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
                  name="Sales Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  dot={{ fill: '#9CA3AF' }}
                  name="Orders Count"
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
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders found.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-soft hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-text-dark">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text-dark">₹{order.totalAmount?.toFixed(2)}</p>
                    <p className={`text-xs ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
