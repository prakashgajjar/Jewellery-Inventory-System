import api from './api'

export const authService = {
  signup: (userData) =>
    api.post('/auth/signup', userData),

  login: (credentials) =>
    api.post('/auth/login', credentials),

  getHealth: () =>
    api.get('/auth/health'),
}

export const productService = {
  getAll: () =>
    api.get('/products'),

  getById: (id) =>
    api.get(`/products/${id}`),

  search: (name) =>
    api.get(`/products/search/${name}`),

  getByType: (type) =>
    api.get(`/products/type/${type}`),

  getLowStock: (threshold) =>
    api.get(`/products/low-stock/${threshold}`),

  create: (data) =>
    api.post('/products', data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`),
}

export const customerService = {
  getAll: () =>
    api.get('/customers'),

  getById: (id) =>
    api.get(`/customers/${id}`),

  search: (name) =>
    api.get(`/customers/search/${name}`),

  create: (data) =>
    api.post('/customers', data),

  update: (id, data) =>
    api.put(`/customers/${id}`, data),

  delete: (id) =>
    api.delete(`/customers/${id}`),
}

export const orderService = {
  getAll: () =>
    api.get('/orders'),

  getById: (id) =>
    api.get(`/orders/${id}`),

  getByCustomer: (customerId) =>
    api.get(`/orders/customer/${customerId}`),

  create: (data) =>
    api.post('/orders', data),

  complete: (id) =>
    api.put(`/orders/${id}/complete`),

  cancel: (id) =>
    api.put(`/orders/${id}/cancel`),

  downloadInvoice: (id) =>
    api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
}

export const rateService = {
  getAll: () =>
    api.get('/rates'),

  getById: (id) =>
    api.get(`/rates/${id}`),

  getLatest: () =>
    api.get('/rates/latest'),

  getByDate: (date) =>
    api.get(`/rates/by-date/${date}`),

  create: (data) =>
    api.post('/rates', data),

  update: (id, data) =>
    api.put(`/rates/${id}`, data),
}

export const reportService = {
  getDashboard: () =>
    api.get('/reports/dashboard'),

  exportReport: () =>
    api.get('/reports/export', { responseType: 'blob' }),
}
