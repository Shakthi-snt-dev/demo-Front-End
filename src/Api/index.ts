/**
 * Centralized API exports
 * Import all API functions from this file for easy access
 * 
 * Usage Examples:
 * 
 * // Import specific service
 * import { authService, customersService } from '@/api'
 * 
 * // Import all services
 * import API from '@/api'
 * 
 * // Import base utilities
 * import { api, ApiError } from '@/api'
 */

// Base API client and utilities
export { api, ApiError } from '@/lib/api-client'
export type { User, SignupData } from '@/lib/api-client'

// Legacy authApi (for backward compatibility)
export { authApi } from '@/lib/api-client'

// All API services organized by feature
export {
  authService,
  userService,
  customersService,
  inventoryService,
  repairsService,
  posService,
  employeesService,
  reportsService,
  settingsService,
  chatService,
} from './services'

// API Namespace - All APIs organized by feature
// Use this for better organization and autocomplete
import {
  authService,
  userService,
  customersService,
  inventoryService,
  repairsService,
  posService,
  employeesService,
  reportsService,
  settingsService,
  chatService,
} from './services'
import { api } from '@/lib/api-client'

export const API = {
  // Auth endpoints
  auth: authService,
  
  // User/Profile endpoints
  user: userService,
  
  // Customers endpoints
  customers: customersService,
  
  // Inventory endpoints
  inventory: inventoryService,
  
  // Repairs endpoints
  repairs: repairsService,
  
  // POS endpoints
  pos: posService,
  
  // Employees endpoints
  employees: employeesService,
  
  // Reports endpoints
  reports: reportsService,
  
  // Settings endpoints
  settings: settingsService,
  
  // Chat/Messages endpoints
  chat: chatService,
  
  // Base HTTP methods
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,
} as const

// Default export for convenience
export default API

