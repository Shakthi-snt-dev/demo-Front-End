import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reportsService } from '@/Api/services'

interface ReportsState {
  salesReport: any | null
  inventoryReport: any | null
  repairsReport: any | null
  customerReport: any | null
  dashboardStats: any | null
  isLoading: boolean
  error: string | null
  message: string | null
}

const initialState: ReportsState = {
  salesReport: null,
  inventoryReport: null,
  repairsReport: null,
  customerReport: null,
  dashboardStats: null,
  isLoading: false,
  error: null,
  message: null,
}

// Fetch sales report
export const fetchSalesReport = createAsyncThunk(
  'reports/fetchSalesReport',
  async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response: any = await reportsService.getSalesReport(params)
      return {
        report: response.data || response,
        message: response.message || response._message || 'Sales report fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch sales report'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch inventory report
export const fetchInventoryReport = createAsyncThunk(
  'reports/fetchInventoryReport',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await reportsService.getInventoryReport()
      return {
        report: response.data || response,
        message: response.message || response._message || 'Inventory report fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch inventory report'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch repairs report
export const fetchRepairsReport = createAsyncThunk(
  'reports/fetchRepairsReport',
  async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response: any = await reportsService.getRepairsReport(params)
      return {
        report: response.data || response,
        message: response.message || response._message || 'Repairs report fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch repairs report'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch customer report
export const fetchCustomerReport = createAsyncThunk(
  'reports/fetchCustomerReport',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await reportsService.getCustomerReport()
      return {
        report: response.data || response,
        message: response.message || response._message || 'Customer report fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch customer report'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'reports/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await reportsService.getDashboardStats()
      return {
        stats: response.data || response,
        message: response.message || response._message || 'Dashboard stats fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch dashboard stats'
      return rejectWithValue(errorMessage)
    }
  }
)

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    clearReports: (state) => {
      state.salesReport = null
      state.inventoryReport = null
      state.repairsReport = null
      state.customerReport = null
    },
  },
  extraReducers: (builder) => {
    // Sales report
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.isLoading = false
        state.salesReport = action.payload.report
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Inventory report
    builder
      .addCase(fetchInventoryReport.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.isLoading = false
        state.inventoryReport = action.payload.report
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Repairs report
    builder
      .addCase(fetchRepairsReport.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRepairsReport.fulfilled, (state, action) => {
        state.isLoading = false
        state.repairsReport = action.payload.report
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchRepairsReport.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Customer report
    builder
      .addCase(fetchCustomerReport.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomerReport.fulfilled, (state, action) => {
        state.isLoading = false
        state.customerReport = action.payload.report
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchCustomerReport.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.dashboardStats = action.payload.stats
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, clearReports } = reportsSlice.actions
export default reportsSlice.reducer

