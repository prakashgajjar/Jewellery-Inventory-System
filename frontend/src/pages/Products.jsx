import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { productService } from '../services'
import Toast from '../components/Toast'

const Products = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'RING',
    weight: '',
    purity: '',
    makingCharges: '',
    stock: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productService.delete(id)
        setProducts(products.filter(p => p.id !== id))
        setToast({ type: 'success', message: 'Product deleted' })
      } catch (error) {
        setToast({ type: 'error', message: 'Failed to delete product' })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await productService.update(editingId, formData)
        setToast({ type: 'success', message: 'Product updated' })
      } else {
        await productService.create(formData)
        setToast({ type: 'success', message: 'Product added' })
      }
      setFormData({ name: '', type: 'RING', weight: '', purity: '', makingCharges: '', stock: '' })
      setShowForm(false)
      setEditingId(null)
      fetchProducts()
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to save product' })
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All Types' || p.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <MainLayout>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark">Products</h1>
          <button 
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({ name: '', type: 'RING', weight: '', purity: '', makingCharges: '', stock: '' })
            }}
            className="bg-primary text-white px-4 py-2 rounded-soft flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-softer shadow-soft mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-soft"
              >
                <option>RING</option>
                <option>BRACELET</option>
                <option>NECKLACE</option>
                <option>EARRING</option>
                <option>ANKLET</option>
                <option>PENDANT</option>
                <option>CHAIN</option>
                <option>OTHER</option>
              </select>
              <input
                type="number"
                placeholder="Weight (g)"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="number"
                placeholder="Purity (e.g., 22)"
                value={formData.purity}
                onChange={(e) => setFormData({...formData, purity: parseInt(e.target.value)})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="number"
                placeholder="Making Charges"
                step="0.01"
                value={formData.makingCharges}
                onChange={(e) => setFormData({...formData, makingCharges: parseFloat(e.target.value)})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                required
                className="px-4 py-2 border border-gray-300 rounded-soft"
              />
              <button
                type="submit"
                className="col-span-2 bg-primary text-white py-2 rounded-soft hover:opacity-90"
              >
                {editingId ? 'Update' : 'Add'} Product
              </button>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-soft focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Types</option>
            <option>RING</option>
            <option>BRACELET</option>
            <option>NECKLACE</option>
            <option>EARRING</option>
            <option>ANKLET</option>
            <option>PENDANT</option>
            <option>CHAIN</option>
            <option>OTHER</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-softer shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Weight</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Purity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">Loading...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{product.name}</td>
                    <td className="px-6 py-3 text-sm">{product.type}</td>
                    <td className="px-6 py-3 text-sm">{product.weight}g</td>
                    <td className="px-6 py-3 text-sm">{product.purity}K</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingId(product.id)
                          setFormData(product)
                          setShowForm(true)
                        }}
                        className="text-primary hover:bg-blue-50 p-2 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
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

export default Products
