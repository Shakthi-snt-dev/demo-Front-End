// API Client structure for FlowTap
// Uses HttpAccessor for token management and request handling

import type { User, SignupData } from '@/types'
import { httpAccessor } from './http-accessor'
export type { User, SignupData }

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

// Use httpAccessor for all API requests
// This ensures tokens are automatically attached and requests are logged
export const api = {
  get: <T>(endpoint: string) => httpAccessor.get<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) =>
    httpAccessor.post<T>(endpoint, data),
  put: <T>(endpoint: string, data?: unknown) =>
    httpAccessor.put<T>(endpoint, data),
  patch: <T>(endpoint: string, data?: unknown) =>
    httpAccessor.patch<T>(endpoint, data),
  delete: <T>(endpoint: string) => httpAccessor.delete<T>(endpoint),
}

// Export httpAccessor for direct use if needed
export { httpAccessor }

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
    isVerified?: boolean
    message?: string
    appUserId?: string | null
    onboardingStep?: number
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

