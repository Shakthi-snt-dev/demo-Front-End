import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { customersService } from '@/Api/services'

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

interface CustomersState {
  customers: Customer[]
  selectedCustomer: Customer | null
  isLoading: boolean
  error: string | null
  message: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response: any = await customersService.getAll(params)
      return {
        customers: response.data || response.items || response,
        message: response.message || response._message || 'Customers fetched successfully',
        pagination: response.pagination || { page: params?.page || 1, limit: params?.limit || 10, total: response.total || 0 },
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch customers'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await customersService.getById(id)
      return {
        customer: response.data || response,
        message: response.message || response._message || 'Customer fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch customer'
      return rejectWithValue(errorMessage)
    }
  }
)

// Create customer
export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response: any = await customersService.create(data)
      return {
        customer: response.data || response,
        message: response.message || response._message || 'Customer created successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to create customer'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update customer
export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: string; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const response: any = await customersService.update(id, data)
      return {
        customer: response.data || response,
        message: response.message || response._message || 'Customer updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update customer'
      return rejectWithValue(errorMessage)
    }
  }
)

// Delete customer
export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await customersService.delete(id)
      return {
        id,
        message: response.message || response._message || 'Customer deleted successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to delete customer'
      return rejectWithValue(errorMessage)
    }
  }
)

// Search customers
export const searchCustomers = createAsyncThunk(
  'customers/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const response: any = await customersService.search(query)
      return {
        customers: response.data || response.items || response,
        message: response.message || response._message || 'Search completed successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to search customers'
      return rejectWithValue(errorMessage)
    }
  }
)

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = action.payload.customers
        state.pagination = action.payload.pagination
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch by ID
    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedCustomer = action.payload.customer
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create
    builder
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers.push(action.payload.customer)
        state.message = action.payload.message
        state.error = null
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.customers.findIndex(c => c.id === action.payload.customer.id)
        if (index !== -1) {
          state.customers[index] = action.payload.customer
        }
        if (state.selectedCustomer?.id === action.payload.customer.id) {
          state.selectedCustomer = action.payload.customer
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = state.customers.filter(c => c.id !== action.payload.id)
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = null
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Search
    builder
      .addCase(searchCustomers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = action.payload.customers
        state.message = action.payload.message
        state.error = null
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, setSelectedCustomer } = customersSlice.actions
export default customersSlice.reducer

