/**
 * HTTP Accessor Service
 * Handles token management and automatically attaches tokens to requests
 * Provides methods to get/set tokens and log request/response data
 */

// Token storage keys
const TOKEN_STORAGE_KEY = 'auth_token'
const AUTH_STORAGE_KEY = 'auth-storage'

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5113/api'

export interface RequestConfig extends RequestInit {
  skipAuth?: boolean // Skip adding auth token
  skipLogging?: boolean // Skip request/response logging
}

export interface RequestData {
  url: string
  method: string
  headers: Record<string, string>
  body?: any
  token?: string | null
  timestamp: string
}

export interface ResponseData {
  url: string
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  token?: string | null
  timestamp: string
}

export class HttpAccessor {
  private static instance: HttpAccessor
  private token: string | null = null

  private constructor() {
    // Load token from localStorage on initialization
    this.loadToken()
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): HttpAccessor {
    if (!HttpAccessor.instance) {
      HttpAccessor.instance = new HttpAccessor()
    }
    return HttpAccessor.instance
  }

  /**
   * Load token from localStorage
   */
  public loadToken(): string | null {
    try {
      // Try to get token from localStorage
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (token) {
        this.token = token
        return token
      }

      // Try to get token from auth-storage
      const authStorage = localStorage.getItem(AUTH_STORAGE_KEY)
      if (authStorage) {
        const parsed = JSON.parse(authStorage)
        if (parsed.token) {
          this.token = parsed.token
          localStorage.setItem(TOKEN_STORAGE_KEY, parsed.token)
          return parsed.token
        }
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error)
    }
    return null
  }

  /**
   * Get current token
   */
  public getToken(): string | null {
    if (!this.token) {
      this.loadToken()
    }
    return this.token
  }

  /**
   * Set token and save to localStorage
   */
  public setToken(token: string | null): void {
    this.token = token
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      
      // Also update auth-storage if it exists
      try {
        const authStorage = localStorage.getItem(AUTH_STORAGE_KEY)
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          parsed.token = token
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed))
        }
      } catch (error) {
        console.error('Failed to update auth-storage:', error)
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  /**
   * Clear token
   */
  public clearToken(): void {
    this.token = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  /**
   * Get request data with token for logging
   */
  private getRequestData(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: any
  ): RequestData {
    return {
      url,
      method,
      headers: { ...headers }, // Clone to avoid mutating original
      body: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
      token: this.getToken(),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get response data with token for logging
   */
  private getResponseData(
    url: string,
    response: Response,
    data: any
  ): ResponseData {
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      url,
      status: response.status,
      statusText: response.statusText,
      headers,
      data,
      token: this.getToken(),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Log request data (for debugging)
   */
  private logRequest(requestData: RequestData): void {
    if (import.meta.env.DEV) {
      console.group(`🔵 HTTP Request: ${requestData.method} ${requestData.url}`)
      console.log('Headers:', requestData.headers)
      console.log('Body:', requestData.body)
      console.log('Token:', requestData.token ? `${requestData.token.substring(0, 20)}...` : 'No token')
      console.log('Timestamp:', requestData.timestamp)
      console.groupEnd()
    }
  }

  /**
   * Log response data (for debugging)
   */
  private logResponse(responseData: ResponseData): void {
    if (import.meta.env.DEV) {
      console.group(
        responseData.status >= 200 && responseData.status < 300
          ? `🟢 HTTP Response: ${responseData.status} ${responseData.url}`
          : `🔴 HTTP Response: ${responseData.status} ${responseData.url}`
      )
      console.log('Status:', responseData.status, responseData.statusText)
      console.log('Headers:', responseData.headers)
      console.log('Data:', responseData.data)
      console.log('Token:', responseData.token ? `${responseData.token.substring(0, 20)}...` : 'No token')
      console.log('Timestamp:', responseData.timestamp)
      console.groupEnd()
    }
  }

  /**
   * Make HTTP request with automatic token attachment
   */
  public async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = this.getToken()

    // Check if body is FormData - don't set Content-Type for FormData
    const isFormData = options.body instanceof FormData

    // Build headers
    const headers: Record<string, string> = {
      // Only set Content-Type if not FormData (browser will set it automatically for FormData)
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>),
    }

    // Add auth token if available and not skipped
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Build request config
    const config: RequestInit = {
      ...options,
      headers,
    }

    // Log request data
    if (!options.skipLogging) {
      const requestData = this.getRequestData(
        url,
        options.method || 'GET',
        headers,
        options.body
      )
      this.logRequest(requestData)
    }

    try {
      const response = await fetch(url, config)
      const responseData = await response.json().catch(() => ({}))

      // Log response data
      if (!options.skipLogging) {
        const responseLogData = this.getResponseData(url, response, responseData)
        this.logResponse(responseLogData)
      }

      if (!response.ok) {
        // Extract error message from various possible API response formats
        let errorMessage = 'Request failed'

        if (responseData.detail) {
          errorMessage = responseData.detail
        } else if (responseData.title) {
          errorMessage = responseData.title
        } else if (responseData.message) {
          errorMessage = responseData.message
        } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          // Handle validation errors array
          errorMessage = responseData.errors
            .map((err: any) => err.message || err.error || String(err))
            .join(', ')
        } else if (typeof responseData === 'string') {
          errorMessage = responseData
        }

        throw new Error(errorMessage)
      }

      // Return response with message extraction helper
      return {
        ...responseData,
        _message: responseData.message || responseData.detail || 'Success',
        _status: response.status,
      } as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error')
    }
  }

  /**
   * GET request
   */
  public get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  public post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  public put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  public patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  public delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Get request data along with token (for debugging/logging)
   */
  public getRequestDataWithToken(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): RequestData {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return this.getRequestData(url, method, headers, body)
  }

  /**
   * Get current token info (for debugging)
   */
  public getTokenInfo(): {
    hasToken: boolean
    tokenPreview: string | null
    tokenLength: number
  } {
    const token = this.getToken()
    return {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      tokenLength: token?.length || 0,
    }
  }
}

// Export singleton instance
export const httpAccessor = HttpAccessor.getInstance()

// Export default instance for convenience
export default httpAccessor

