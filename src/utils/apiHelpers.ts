/**
 * API Helper Utilities
 * 
 * This file contains helper functions for working with API responses
 * and extracting messages for display in the UI
 */

/**
 * Extract message from API response
 * Handles various response formats from the backend
 */
export function extractApiMessage(response: any): string {
  if (!response) return 'Success'
  
  // Try different message fields
  if (response.message) return response.message
  if (response._message) return response._message
  if (response.data?.message) return response.data.message
  if (response.detail) return response.detail
  if (response.title) return response.title
  
  // Handle array of errors
  if (Array.isArray(response.errors) && response.errors.length > 0) {
    return response.errors.map((err: any) => 
      err.message || err.error || String(err)
    ).join(', ')
  }
  
  return 'Success'
}

/**
 * Extract error message from API error
 * Handles various error formats from the backend
 */
export function extractApiError(error: any): string {
  if (!error) return 'An error occurred'
  
  // If it's already a string
  if (typeof error === 'string') return error
  
  // Try different error fields
  if (error.message) return error.message
  if (error.data?.detail) return error.data.detail
  if (error.data?.title) return error.data.title
  if (error.data?.message) return error.data.message
  
  // Handle array of errors
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err: any) => 
      err.message || err.error || String(err)
    ).join(', ')
  }
  
  return 'An error occurred'
}

/**
 * Check if API response is successful
 */
export function isApiSuccess(response: any): boolean {
  if (!response) return false
  return response.status === true || response.status === 200 || response._status === 200
}

/**
 * Get pagination info from API response
 */
export function extractPagination(response: any): {
  page: number
  limit: number
  total: number
} {
  if (response.pagination) {
    return response.pagination
  }
  
  return {
    page: response.page || 1,
    limit: response.limit || 10,
    total: response.total || 0,
  }
}

/**
 * Extract data from API response
 * Handles various response formats
 */
export function extractApiData<T>(response: any): T {
  if (response.data) return response.data
  if (response.items) return response.items
  if (Array.isArray(response)) return response as T
  return response as T
}

