import React, { useState, useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { Plus, Trash2, Download } from 'lucide-react'
import { productService, orderService, customerService } from '../services'
import Toast from '../components/Toast'

const Billing = () => {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [invoiceItems, setInvoiceItems] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, customersData] = await Promise.all([
          productService.getAll(),
          customerService.getAll()
        ])
        setProducts(productsData)
        setCustomers(customersData)
      } catch (error) {
        setToast({ type: 'error', message: 'Failed to load data' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const addToInvoice = (product) => {
    const qty = quantities[product.id] || 1
    const existingItem = invoiceItems.find(item => item.product_id === product.id)
    
    if (existingItem) {
      setInvoiceItems(invoiceItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + qty, total_price: (item.quantity + qty) * product.purity }
          : item
      ))
    } else {
      setInvoiceItems([...invoiceItems, {
        product_id: product.id,
        name: product.name,
        price: product.purity,
        quantity: qty,
        total_price: qty * product.purity
      }])
    }
    setToast({ type: 'success', message: 'Item added to invoice' })
  }

  const removeFromInvoice = (productId) => {
    setInvoiceItems(invoiceItems.filter(item => item.product_id !== productId))
  }

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total_price, 0)
  const gst = subtotal * 0.18
  const total = subtotal + gst

  const handleCompleteOrder = async () => {
    if (!selectedCustomer) {
      setToast({ type: 'error', message: 'Please select a customer' })
      return
    }
    if (invoiceItems.length === 0) {
      setToast({ type: 'error', message: 'Please add items to invoice' })
      return
    }

    try {
      const orderData = {
        customer_id: selectedCustomer,
        subtotal: subtotal,
        gst: gst,
        total_amount: total,
        items: invoiceItems
      }
      await orderService.create(orderData)
      setToast({ type: 'success', message: 'Order created successfully' })
      setInvoiceItems([])
      setSelectedCustomer(null)
      setQuantities({})
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to create order' })
    }
  }

  return (
    <MainLayout>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="grid grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="col-span-2 bg-white rounded-softer shadow-soft p-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">Select Products</h2>
          
          {/* Customer Selection */}
          <div className="mb-6 p-4 bg-blue-50 rounded-soft">
            <label className="block text-sm font-medium mb-2">Select Customer</label>
            <select 
              value={selectedCustomer || ''}
              onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-soft"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
          </div>

          {/* Products List */}
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-500">No products available</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-soft hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-text-dark">{product.name}</p>
                    <p className="text-xs text-gray-500">₹{product.purity} • Stock: {product.stock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => setQuantities({...quantities, [product.id]: parseInt(e.target.value)})}
                      className="w-12 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button 
                      onClick={() => addToInvoice(product)}
                      disabled={product.stock === 0}
                      className="px-3 py-1 bg-primary text-white rounded text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white rounded-softer shadow-soft p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">Invoice</h2>

          {/* Invoice Items */}
          <div className="space-y-2 mb-4 pb-4 border-b max-h-48 overflow-y-auto">
            {invoiceItems.length === 0 ? (
              <p className="text-sm text-gray-500">No items added</p>
            ) : (
              invoiceItems.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <div>
                    <span className="block font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₹{item.total_price.toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromInvoice(item.product_id)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button 
              onClick={handleCompleteOrder}
              disabled={invoiceItems.length === 0 || !selectedCustomer}
              className="w-full bg-primary text-white py-2 rounded-soft font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Complete Order
            </button>
            <button 
              onClick={() => {
                setInvoiceItems([])
                setSelectedCustomer(null)
                setQuantities({})
              }}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-soft font-medium hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Billing
