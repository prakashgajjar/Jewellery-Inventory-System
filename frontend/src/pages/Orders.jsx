import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { Eye, Download, CheckCircle, XCircle } from 'lucide-react'
import { orderService } from '../services'
import Toast from '../components/Toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getAll()
      setOrders(data)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load orders' })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteOrder = async (id) => {
    try {
      await orderService.complete(id)
      setToast({ type: 'success', message: 'Order completed' })
      fetchOrders()
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to complete order' })
    }
  }

  const handleCancelOrder = async (id) => {
    try {
      await orderService.cancel(id)
      setToast({ type: 'success', message: 'Order cancelled' })
      fetchOrders()
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to cancel order' })
    }
  }

  const filteredOrders = orders.filter(o =>
    statusFilter === 'All Status' || o.status === statusFilter.toUpperCase()
  )

  return (
    <MainLayout>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-3xl font-bold text-text-dark mb-6">Orders</h1>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Status</option>
            <option>PENDING</option>
            <option>COMPLETED</option>
            <option>CANCELLED</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-softer shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">Loading...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium">#{order.id}</td>
                    <td className="px-6 py-3 text-sm">{order.customerName || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm">₹{order.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:bg-blue-50 p-2 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleCompleteOrder(order.id)}
                            className="text-green-600 hover:bg-green-50 p-2 rounded">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-softer p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">Order Details #{selectedOrder.id}</h2>
              <div className="space-y-4">
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                <p><strong>GST:</strong> ₹{selectedOrder.gst?.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="mt-6 bg-primary text-white px-4 py-2 rounded-soft hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Orders
