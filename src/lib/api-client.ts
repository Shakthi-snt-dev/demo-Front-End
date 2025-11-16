// API Client structure for FlowTap
// Replace with actual API endpoints when backend is ready

import type { User, SignupData } from '@/types'
export type { User, SignupData }

// API Base URL - can be set via VITE_API_BASE_URL in .env file
// Default: http://localhost:5113 (local development)
const API_BASE_URL =  'http://localhost:5113/api'

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Check if body is FormData - don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData
  
  const config: RequestInit = {
    headers: {
      // Only set Content-Type if not FormData (browser will set it automatically for FormData)
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available (from Redux store via localStorage sync)
  // The token is synced to localStorage by the auth slice
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as HeadersInit
  }

  try {
    const response = await fetch(url, config)
    
    const responseData = await response.json().catch(() => ({}))
    
    if (!response.ok) {
      // Extract error message from various possible API response formats
      // API may return: detail, title, message, or errors array
      let errorMessage = 'Request failed'
      
      if (responseData.detail) {
        errorMessage = responseData.detail
      } else if (responseData.title) {
        errorMessage = responseData.title
      } else if (responseData.message) {
        errorMessage = responseData.message
      } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        // Handle validation errors array
        errorMessage = responseData.errors.map((err: any) => 
          err.message || err.error || String(err)
        ).join(', ')
      } else if (typeof responseData === 'string') {
        errorMessage = responseData
      }
      
      throw new ApiError(
        errorMessage,
        response.status,
        responseData
      )
    }

    // Return response with message extraction helper
    return {
      ...responseData,
      _message: responseData.message || responseData.detail || 'Success',
      _status: response.status,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0, error)
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}

// Auth API Response Types
export interface RegisterResponse {
  status: boolean
  message: string
  userId: string
  email: string
  username: string
  isEmailVerified: boolean
  onboardingStep: number
  _message?: string
  _status?: number
}

export interface VerifyEmailResponse {
  status: boolean
  message: string
  data: {
    appUserId: string
    onboardingStep: number
  }
  _message?: string
  _status?: number
}

export interface LoginResponse {
  status: boolean
  message: string
  data: {
    token: string
    message: string
    appUserId: string
    isEmailVerified: boolean
    username: string
    userType: string
    lastLoginAt: string
  }
  _message?: string
  _status?: number
}

// Auth endpoints - matching the actual API
export const authApi = {
  register: (data: { email: string; username: string; password: string; confirmPassword: string }) =>
    api.post<RegisterResponse>('/auth/register', data),
  
  verifyEmail: (token: string) =>
    api.get<VerifyEmailResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`),
  
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  
  // Legacy methods for backward compatibility
  signup: (data: SignupData) =>
    api.post<RegisterResponse>('/auth/register', { 
      email: data.email, 
      username: data.username, 
      password: data.password, 
      confirmPassword: data.password 
    }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
}

