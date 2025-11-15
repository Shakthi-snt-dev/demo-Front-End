import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { inventoryService } from '@/Api/services'

interface InventoryItem {
  id: string
  name: string
  description?: string
  category?: string
  quantity: number
  price?: number
  sku?: string
  createdAt?: string
  updatedAt?: string
}

interface InventoryState {
  items: InventoryItem[]
  selectedItem: InventoryItem | null
  isLoading: boolean
  error: string | null
  message: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState: InventoryState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

// Fetch all inventory items
export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (params?: { page?: number; limit?: number; category?: string }, { rejectWithValue }) => {
    try {
      const response: any = await inventoryService.getAll(params)
      return {
        items: response.data || response.items || response,
        message: response.message || response._message || 'Inventory fetched successfully',
        pagination: response.pagination || { page: params?.page || 1, limit: params?.limit || 10, total: response.total || 0 },
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch inventory'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch item by ID
export const fetchInventoryItem = createAsyncThunk(
  'inventory/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await inventoryService.getById(id)
      return {
        item: response.data || response,
        message: response.message || response._message || 'Item fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch item'
      return rejectWithValue(errorMessage)
    }
  }
)

// Create item
export const createInventoryItem = createAsyncThunk(
  'inventory/create',
  async (data: Partial<InventoryItem>, { rejectWithValue }) => {
    try {
      const response: any = await inventoryService.create(data)
      return {
        item: response.data || response,
        message: response.message || response._message || 'Item created successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to create item'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update item
export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async ({ id, data }: { id: string; data: Partial<InventoryItem> }, { rejectWithValue }) => {
    try {
      const response: any = await inventoryService.update(id, data)
      return {
        item: response.data || response,
        message: response.message || response._message || 'Item updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update item'
      return rejectWithValue(errorMessage)
    }
  }
)

// Delete item
export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await inventoryService.delete(id)
      return {
        id,
        message: response.message || response._message || 'Item deleted successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to delete item'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update stock
export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response: any = await inventoryService.updateStock(id, quantity)
      return {
        item: response.data || response,
        message: response.message || response._message || 'Stock updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update stock'
      return rejectWithValue(errorMessage)
    }
  }
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items
        state.pagination = action.payload.pagination
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch by ID
    builder
      .addCase(fetchInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedItem = action.payload.item
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create
    builder
      .addCase(createInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.push(action.payload.item)
        state.message = action.payload.message
        state.error = null
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update
    builder
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(i => i.id === action.payload.item.id)
        if (index !== -1) {
          state.items[index] = action.payload.item
        }
        if (state.selectedItem?.id === action.payload.item.id) {
          state.selectedItem = action.payload.item
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(i => i.id !== action.payload.id)
        if (state.selectedItem?.id === action.payload.id) {
          state.selectedItem = null
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update stock
    builder
      .addCase(updateStock.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(i => i.id === action.payload.item.id)
        if (index !== -1) {
          state.items[index] = action.payload.item
        }
        if (state.selectedItem?.id === action.payload.item.id) {
          state.selectedItem = action.payload.item
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, setSelectedItem } = inventorySlice.actions
export default inventorySlice.reducer

