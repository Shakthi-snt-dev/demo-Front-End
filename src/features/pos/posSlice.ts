import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { posService } from '@/Api/services'

interface Sale {
  id: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  total: number
  paymentMethod?: string
  customerId?: string
  createdAt?: string
}

interface POSState {
  sales: Sale[]
  selectedSale: Sale | null
  isLoading: boolean
  error: string | null
  message: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState: POSState = {
  sales: [],
  selectedSale: null,
  isLoading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

// Create sale
export const createSale = createAsyncThunk(
  'pos/createSale',
  async (data: Partial<Sale>, { rejectWithValue }) => {
    try {
      const response: any = await posService.createSale(data)
      return {
        sale: response.data || response,
        message: response.message || response._message || 'Sale created successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to create sale'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch all sales
export const fetchSales = createAsyncThunk(
  'pos/fetchSales',
  async (params?: { page?: number; limit?: number; date?: string }, { rejectWithValue }) => {
    try {
      const response: any = await posService.getSales(params)
      return {
        sales: response.data || response.items || response,
        message: response.message || response._message || 'Sales fetched successfully',
        pagination: response.pagination || { page: params?.page || 1, limit: params?.limit || 10, total: response.total || 0 },
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch sales'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch sale by ID
export const fetchSaleById = createAsyncThunk(
  'pos/fetchSaleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await posService.getSaleById(id)
      return {
        sale: response.data || response,
        message: response.message || response._message || 'Sale fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch sale'
      return rejectWithValue(errorMessage)
    }
  }
)

// Process payment
export const processPayment = createAsyncThunk(
  'pos/processPayment',
  async ({ saleId, paymentData }: { saleId: string; paymentData: any }, { rejectWithValue }) => {
    try {
      const response: any = await posService.processPayment(saleId, paymentData)
      return {
        sale: response.data || response,
        message: response.message || response._message || 'Payment processed successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to process payment'
      return rejectWithValue(errorMessage)
    }
  }
)

// Get receipt
export const getReceipt = createAsyncThunk(
  'pos/getReceipt',
  async (saleId: string, { rejectWithValue }) => {
    try {
      const response: any = await posService.getReceipt(saleId)
      return {
        receipt: response.data || response,
        message: response.message || response._message || 'Receipt fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch receipt'
      return rejectWithValue(errorMessage)
    }
  }
)

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setSelectedSale: (state, action) => {
      state.selectedSale = action.payload
    },
  },
  extraReducers: (builder) => {
    // Create sale
    builder
      .addCase(createSale.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false
        state.sales.push(action.payload.sale)
        state.message = action.payload.message
        state.error = null
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch sales
    builder
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false
        state.sales = action.payload.sales
        state.pagination = action.payload.pagination
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch sale by ID
    builder
      .addCase(fetchSaleById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedSale = action.payload.sale
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.sales.findIndex(s => s.id === action.payload.sale.id)
        if (index !== -1) {
          state.sales[index] = action.payload.sale
        }
        if (state.selectedSale?.id === action.payload.sale.id) {
          state.selectedSale = action.payload.sale
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, setSelectedSale } = posSlice.actions
export default posSlice.reducer

