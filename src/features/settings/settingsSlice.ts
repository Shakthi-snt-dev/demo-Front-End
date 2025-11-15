import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { settingsService } from '@/Api/services'

interface SettingsState {
  storeSettings: any | null
  posSettings: any | null
  notificationSettings: any | null
  isLoading: boolean
  error: string | null
  message: string | null
}

const initialState: SettingsState = {
  storeSettings: null,
  posSettings: null,
  notificationSettings: null,
  isLoading: false,
  error: null,
  message: null,
}

// Fetch store settings
export const fetchStoreSettings = createAsyncThunk(
  'settings/fetchStoreSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await settingsService.getStoreSettings()
      return {
        settings: response.data || response,
        message: response.message || response._message || 'Store settings fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch store settings'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update store settings
export const updateStoreSettings = createAsyncThunk(
  'settings/updateStoreSettings',
  async (data: any, { rejectWithValue }) => {
    try {
      const response: any = await settingsService.updateStoreSettings(data)
      return {
        settings: response.data || response,
        message: response.message || response._message || 'Store settings updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update store settings'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch POS settings
export const fetchPOSSettings = createAsyncThunk(
  'settings/fetchPOSSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await settingsService.getPOSSettings()
      return {
        settings: response.data || response,
        message: response.message || response._message || 'POS settings fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch POS settings'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update POS settings
export const updatePOSSettings = createAsyncThunk(
  'settings/updatePOSSettings',
  async (data: any, { rejectWithValue }) => {
    try {
      const response: any = await settingsService.updatePOSSettings(data)
      return {
        settings: response.data || response,
        message: response.message || response._message || 'POS settings updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update POS settings'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch notification settings
export const fetchNotificationSettings = createAsyncThunk(
  'settings/fetchNotificationSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await settingsService.getNotificationSettings()
      return {
        settings: response.data || response,
        message: response.message || response._message || 'Notification settings fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch notification settings'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update notification settings
export const updateNotificationSettings = createAsyncThunk(
  'settings/updateNotificationSettings',
  async (data: any, { rejectWithValue }) => {
    try {
      const response: any = await settingsService.updateNotificationSettings(data)
      return {
        settings: response.data || response,
        message: response.message || response._message || 'Notification settings updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update notification settings'
      return rejectWithValue(errorMessage)
    }
  }
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
  },
  extraReducers: (builder) => {
    // Store settings
    builder
      .addCase(fetchStoreSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStoreSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.storeSettings = action.payload.settings
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchStoreSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateStoreSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStoreSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.storeSettings = action.payload.settings
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateStoreSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // POS settings
    builder
      .addCase(fetchPOSSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPOSSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.posSettings = action.payload.settings
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchPOSSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updatePOSSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePOSSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.posSettings = action.payload.settings
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updatePOSSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Notification settings
    builder
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.notificationSettings = action.payload.settings
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.notificationSettings = action.payload.settings
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage } = settingsSlice.actions
export default settingsSlice.reducer

