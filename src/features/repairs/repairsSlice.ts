import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { repairsService } from '@/Api/services'

interface Repair {
  id: string
  customerId?: string
  deviceName?: string
  description?: string
  status: string
  estimatedCost?: number
  actualCost?: number
  createdAt?: string
  updatedAt?: string
}

interface RepairsState {
  repairs: Repair[]
  selectedRepair: Repair | null
  isLoading: boolean
  error: string | null
  message: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState: RepairsState = {
  repairs: [],
  selectedRepair: null,
  isLoading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

// Fetch all repairs
export const fetchRepairs = createAsyncThunk(
  'repairs/fetchAll',
  async (params?: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response: any = await repairsService.getAll(params)
      return {
        repairs: response.data || response.items || response,
        message: response.message || response._message || 'Repairs fetched successfully',
        pagination: response.pagination || { page: params?.page || 1, limit: params?.limit || 10, total: response.total || 0 },
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch repairs'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch repair by ID
export const fetchRepairById = createAsyncThunk(
  'repairs/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await repairsService.getById(id)
      return {
        repair: response.data || response,
        message: response.message || response._message || 'Repair fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch repair'
      return rejectWithValue(errorMessage)
    }
  }
)

// Create repair
export const createRepair = createAsyncThunk(
  'repairs/create',
  async (data: Partial<Repair>, { rejectWithValue }) => {
    try {
      const response: any = await repairsService.create(data)
      return {
        repair: response.data || response,
        message: response.message || response._message || 'Repair created successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to create repair'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update repair
export const updateRepair = createAsyncThunk(
  'repairs/update',
  async ({ id, data }: { id: string; data: Partial<Repair> }, { rejectWithValue }) => {
    try {
      const response: any = await repairsService.update(id, data)
      return {
        repair: response.data || response,
        message: response.message || response._message || 'Repair updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update repair'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update repair status
export const updateRepairStatus = createAsyncThunk(
  'repairs/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response: any = await repairsService.updateStatus(id, status)
      return {
        repair: response.data || response,
        message: response.message || response._message || 'Repair status updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update repair status'
      return rejectWithValue(errorMessage)
    }
  }
)

// Delete repair
export const deleteRepair = createAsyncThunk(
  'repairs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await repairsService.delete(id)
      return {
        id,
        message: response.message || response._message || 'Repair deleted successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to delete repair'
      return rejectWithValue(errorMessage)
    }
  }
)

const repairsSlice = createSlice({
  name: 'repairs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setSelectedRepair: (state, action) => {
      state.selectedRepair = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchRepairs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRepairs.fulfilled, (state, action) => {
        state.isLoading = false
        state.repairs = action.payload.repairs
        state.pagination = action.payload.pagination
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchRepairs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch by ID
    builder
      .addCase(fetchRepairById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRepairById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedRepair = action.payload.repair
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchRepairById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create
    builder
      .addCase(createRepair.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createRepair.fulfilled, (state, action) => {
        state.isLoading = false
        state.repairs.push(action.payload.repair)
        state.message = action.payload.message
        state.error = null
      })
      .addCase(createRepair.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update
    builder
      .addCase(updateRepair.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateRepair.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.repairs.findIndex(r => r.id === action.payload.repair.id)
        if (index !== -1) {
          state.repairs[index] = action.payload.repair
        }
        if (state.selectedRepair?.id === action.payload.repair.id) {
          state.selectedRepair = action.payload.repair
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateRepair.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update status
    builder
      .addCase(updateRepairStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateRepairStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.repairs.findIndex(r => r.id === action.payload.repair.id)
        if (index !== -1) {
          state.repairs[index] = action.payload.repair
        }
        if (state.selectedRepair?.id === action.payload.repair.id) {
          state.selectedRepair = action.payload.repair
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateRepairStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteRepair.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteRepair.fulfilled, (state, action) => {
        state.isLoading = false
        state.repairs = state.repairs.filter(r => r.id !== action.payload.id)
        if (state.selectedRepair?.id === action.payload.id) {
          state.selectedRepair = null
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(deleteRepair.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, setSelectedRepair } = repairsSlice.actions
export default repairsSlice.reducer

