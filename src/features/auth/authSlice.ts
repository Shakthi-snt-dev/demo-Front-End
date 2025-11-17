import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, SignupData } from '@/types'
import { authApi, type LoginResponse, type RegisterResponse, type VerifyEmailResponse } from '@/lib/api-client'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  message: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
}

// Load auth state from localStorage on initialization
const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const storedAuth = localStorage.getItem('auth-storage')
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth)
      if (parsed.token && parsed.user) {
        return {
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: true,
        }
      }
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error)
  }
  return {}
}

// Login async thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await authApi.login(credentials.email, credentials.password)
      // Transform API response to match expected format
      return {
        token: response.data.token,
        user: {
          id: response.data.appUserId,
          email: credentials.email,
          username: response.data.username,
          role: response.data.userType,
          isEmailVerified: response.data.isEmailVerified,
        } as User,
        message: response.message || response.data.message || response._message || 'Login successful',
      }
    } catch (error: any) {
      // Extract the actual API error message
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Login failed. Please check your credentials.'
      return rejectWithValue(errorMessage)
    }
  }
)

// Register/Signup async thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response: RegisterResponse = await authApi.signup(data)
      // Transform API response to match expected format
      // Note: Register doesn't return a token, so we set token to null
      // User will need to verify email first
      return {
        token: null,
        user: {
          id: response.userId,
          email: response.email,
          username: response.username,
          role: 'user', // Default role, adjust as needed
          isEmailVerified: response.isEmailVerified,
        } as User,
        message: response.message || response._message || 'Registration successful. Please check your email to verify your account.',
      }
    } catch (error: any) {
      // Extract the actual API error message
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Registration failed. Please try again.'
      return rejectWithValue(errorMessage)
    }
  }
)

// Verify email async thunk
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response: VerifyEmailResponse = await authApi.verifyEmail(token)
      
      // The API returns ApiResponseDto<VerifyEmailResponseDto>
      // Structure: { status, message, data: { isVerified, message, appUserId, onboardingStep } }
      console.log('VerifyEmail full response:', JSON.stringify(response, null, 2))
      
      const responseData = response.data
      
      if (!responseData) {
        console.error('VerifyEmail response missing data:', response)
        return rejectWithValue('Invalid response structure from server')
      }
      
      console.log('VerifyEmail responseData:', JSON.stringify(responseData, null, 2))
      
      // Check if verification was successful
      // The backend returns IsVerified in the data object
      if (responseData.isVerified === false) {
        return rejectWithValue(responseData.message || response.message || 'Email verification failed')
      }
      
      // Extract appUserId - it might be null, string, or Guid
      const appUserId = responseData.appUserId
      
      // Convert to string if it exists
      let appUserIdString: string | null = null
      if (appUserId) {
        if (typeof appUserId === 'string') {
          appUserIdString = appUserId
        } else if (typeof appUserId === 'object' && appUserId !== null && 'toString' in appUserId) {
          appUserIdString = (appUserId as any).toString()
        } else {
          appUserIdString = String(appUserId)
        }
      }
      
      console.log('VerifyEmail extracted appUserId:', appUserIdString)
      
      return {
        appUserId: appUserIdString,
        onboardingStep: responseData.onboardingStep || 1,
        message: response.message || response._message || responseData.message || 'Email verified successfully',
      }
    } catch (error: any) {
      console.error('VerifyEmail error:', error)
      // Extract the actual API error message
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Email verification failed. Please try again.'
      return rejectWithValue(errorMessage)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    ...loadAuthFromStorage(),
  },
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      
      // Save to localStorage
      localStorage.setItem('auth_token', action.payload.token)
      localStorage.setItem('auth-storage', JSON.stringify({
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      }))
      
      // Update httpAccessor token
      import('@/lib/http-accessor').then(({ httpAccessor }) => {
        httpAccessor.setToken(action.payload.token)
      })
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth-storage')
      
      // Clear httpAccessor token
      import('@/lib/http-accessor').then(({ httpAccessor }) => {
        httpAccessor.clearToken()
      })
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        
        // Update localStorage
        const storedAuth = localStorage.getItem('auth-storage')
        if (storedAuth) {
          try {
            const parsed = JSON.parse(storedAuth)
            localStorage.setItem('auth-storage', JSON.stringify({
              ...parsed,
              user: state.user,
            }))
          } catch (error) {
            console.error('Failed to update auth in storage:', error)
          }
        }
      }
    },
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = !!action.payload.token
        state.error = null
        state.message = action.payload.message || null
        
        // Save to localStorage only if token exists
        if (action.payload.token) {
          localStorage.setItem('auth_token', action.payload.token)
          localStorage.setItem('auth-storage', JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated: true,
          }))
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
    
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        // Registration doesn't automatically authenticate - user needs to verify email
        state.isAuthenticated = !!action.payload.token
        state.error = null
        state.message = action.payload.message || null
        
        // Save to localStorage only if token exists
        if (action.payload.token) {
          localStorage.setItem('auth_token', action.payload.token)
          localStorage.setItem('auth-storage', JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated: true,
          }))
        } else {
          // Save user info even without token (for email verification flow)
          localStorage.setItem('auth-storage', JSON.stringify({
            user: action.payload.user,
            token: null,
            isAuthenticated: false,
          }))
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
    
    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        state.message = action.payload.message || null
        // Update user email verification status
        if (state.user) {
          state.user.isEmailVerified = true
          // Update localStorage
          const storedAuth = localStorage.getItem('auth-storage')
          if (storedAuth) {
            try {
              const parsed = JSON.parse(storedAuth)
              localStorage.setItem('auth-storage', JSON.stringify({
                ...parsed,
                user: state.user,
              }))
            } catch (error) {
              console.error('Failed to update auth in storage:', error)
            }
          }
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setAuth, logout, updateUser, clearError, clearMessage } = authSlice.actions
export default authSlice.reducer

