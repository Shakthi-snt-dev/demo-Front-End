import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User, SignupData } from '@/types'
import { authApi } from '@/lib/api-client'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
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
      const response = await authApi.login(credentials.email, credentials.password)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Login failed. Please check your credentials.'
      )
    }
  }
)

// Register/Signup async thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(data)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Registration failed. Please try again.'
      )
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
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth-storage')
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
        state.isAuthenticated = true
        state.error = null
        
        // Save to localStorage
        localStorage.setItem('auth_token', action.payload.token)
        localStorage.setItem('auth-storage', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
        }))
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
        state.isAuthenticated = true
        state.error = null
        
        // Save to localStorage
        localStorage.setItem('auth_token', action.payload.token)
        localStorage.setItem('auth-storage', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
        }))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { setAuth, logout, updateUser, clearError } = authSlice.actions
export default authSlice.reducer

