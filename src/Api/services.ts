/**
 * API Services - Organized by feature/module
 * Add new API endpoints here as your application grows
 */

import { api } from '@/lib/api-client'
import type { 
  User, 
  RegisterResponse, 
  VerifyEmailResponse, 
  LoginResponse 
} from '@/lib/api-client'

// Helper function to build query string from params
const buildQueryString = (params?: Record<string, string | number | undefined>): string => {
  if (!params) return ''
  
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  })
  
  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}

// ============================================
// AUTH API
// ============================================
export const authService = {
  // Register new user
  register: (data: { email: string; username: string; password: string; confirmPassword: string }) =>
    api.post<RegisterResponse>('/Auth/register', data),
  
  // Verify email with token (GET request with query parameter)
  verifyEmail: (token: string) =>
    api.get<VerifyEmailResponse>(`/Auth/verify-email?token=${encodeURIComponent(token)}`),
  
  // Login user
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/Auth/login', { email, password }),
  
  // Legacy methods for backward compatibility
  signup: (data: { email: string; password: string; username: string }) =>
    api.post<RegisterResponse>('/Auth/register', { 
      email: data.email, 
      username: data.username, 
      password: data.password, 
      confirmPassword: data.password 
    }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  refreshToken: (token: string) =>
    api.post<{ token: string }>('/auth/refresh', { token }),
}

// ============================================
// USER PROFILE API
// ============================================
export const userService = {
  getProfile: () =>
    api.get<User>('/user/profile'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<User>('/user/profile', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<{ avatar: string }>('/user/avatar', formData)
  },
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/user/change-password', { currentPassword, newPassword }),
}

// ============================================
// CUSTOMERS API
// ============================================
export const customersService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get(`/customers${buildQueryString(params)}`),
  
  getById: (id: string) =>
    api.get(`/customers/${id}`),
  
  create: (data: any) =>
    api.post('/customers', data),
  
  update: (id: string, data: any) =>
    api.put(`/customers/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/customers/${id}`),
  
  search: (query: string) =>
    api.get(`/customers/search?q=${query}`),
}

// ============================================
// INVENTORY API
// ============================================
export const inventoryService = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get(`/inventory${buildQueryString(params)}`),
  
  getById: (id: string) =>
    api.get(`/inventory/${id}`),
  
  create: (data: any) =>
    api.post('/inventory', data),
  
  update: (id: string, data: any) =>
    api.put(`/inventory/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/inventory/${id}`),
  
  updateStock: (id: string, quantity: number) =>
    api.patch(`/inventory/${id}/stock`, { quantity }),
}

// ============================================
// REPAIRS API
// ============================================
export const repairsService = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get(`/repairs${buildQueryString(params)}`),
  
  getById: (id: string) =>
    api.get(`/repairs/${id}`),
  
  create: (data: any) =>
    api.post('/repairs', data),
  
  update: (id: string, data: any) =>
    api.put(`/repairs/${id}`, data),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/repairs/${id}/status`, { status }),
  
  delete: (id: string) =>
    api.delete(`/repairs/${id}`),
}

// ============================================
// POS (Point of Sale) API
// ============================================
export const posService = {
  createSale: (data: any) =>
    api.post('/pos/sales', data),
  
  getSales: (params?: { page?: number; limit?: number; date?: string }) =>
    api.get(`/pos/sales${buildQueryString(params)}`),
  
  getSaleById: (id: string) =>
    api.get(`/pos/sales/${id}`),
  
  processPayment: (saleId: string, paymentData: any) =>
    api.post(`/pos/sales/${saleId}/payment`, paymentData),
  
  getReceipt: (saleId: string) =>
    api.get(`/pos/sales/${saleId}/receipt`),
}

// ============================================
// EMPLOYEES API
// ============================================
export const employeesService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get(`/employees${buildQueryString(params)}`),
  
  getById: (id: string) =>
    api.get(`/employees/${id}`),
  
  create: (data: any) =>
    api.post('/employees', data),
  
  update: (id: string, data: any) =>
    api.put(`/employees/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/employees/${id}`),
  
  updateRole: (id: string, role: string) =>
    api.patch(`/employees/${id}/role`, { role }),
}

// ============================================
// REPORTS API
// ============================================
export const reportsService = {
  getSalesReport: (params: { startDate: string; endDate: string }) =>
    api.get(`/reports/sales${buildQueryString(params)}`),
  
  getInventoryReport: () =>
    api.get('/reports/inventory'),
  
  getRepairsReport: (params: { startDate: string; endDate: string }) =>
    api.get(`/reports/repairs${buildQueryString(params)}`),
  
  getCustomerReport: () =>
    api.get('/reports/customers'),
  
  getDashboardStats: () =>
    api.get('/reports/dashboard'),
}

// ============================================
// SETTINGS API
// ============================================
export const settingsService = {
  getStoreSettings: () =>
    api.get('/settings/store'),
  
  updateStoreSettings: (data: any) =>
    api.put('/settings/store', data),
  
  getPOSSettings: () =>
    api.get('/settings/pos'),
  
  updatePOSSettings: (data: any) =>
    api.put('/settings/pos', data),
  
  getNotificationSettings: () =>
    api.get('/settings/notifications'),
  
  updateNotificationSettings: (data: any) =>
    api.put('/settings/notifications', data),
}

// ============================================
// CHAT/MESSAGES API
// ============================================
export const chatService = {
  getConversations: () =>
    api.get('/chat/conversations'),
  
  getMessages: (conversationId: string) =>
    api.get(`/chat/conversations/${conversationId}/messages`),
  
  sendMessage: (conversationId: string, message: string) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { message }),
  
  createConversation: (data: any) =>
    api.post('/chat/conversations', data),
}

