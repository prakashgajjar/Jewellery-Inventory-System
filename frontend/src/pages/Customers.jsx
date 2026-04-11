import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { customerService } from '../services'
import Toast from '../components/Toast'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [searching, setSearching] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load customers' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await customerService.delete(id)
        setCustomers(customers.filter(c => c.id !== id))
        setToast({ type: 'success', message: 'Customer deleted' })
      } catch (error) {
        setToast({ type: 'error', message: 'Failed to delete customer' })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await customerService.update(editingId, formData)
        setToast({ type: 'success', message: 'Customer updated' })
      } else {
        await customerService.create(formData)
        setToast({ type: 'success', message: 'Customer added' })
      }
      setFormData({ name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' })
      setShowForm(false)
      setEditingId(null)
      fetchCustomers()
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to save customer' })
    }
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searching.toLowerCase()) ||
    c.phone.includes(searching)
  )

  return (
    <MainLayout>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark">Customers</h1>
          <button 
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({ name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' })
            }}
            className="bg-primary text-white px-4 py-2 rounded-soft flex items-center gap-2 hover:opacity-90">
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Customer'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-softer shadow-soft mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-soft"
              ></textarea>
              <button
                type="submit"
                className="col-span-2 bg-primary text-white py-2 rounded-soft hover:opacity-90"
              >
                {editingId ? 'Update' : 'Add'} Customer
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-softer shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">Loading...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{customer.name}</td>
                    <td className="px-6 py-3 text-sm">{customer.phone}</td>
                    <td className="px-6 py-3 text-sm">{customer.email}</td>
                    <td className="px-6 py-3 text-sm">{customer.city}</td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingId(customer.id)
                          setFormData(customer)
                          setShowForm(true)
                        }}
                        className="text-primary hover:bg-blue-50 p-2 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}

export default Customers
