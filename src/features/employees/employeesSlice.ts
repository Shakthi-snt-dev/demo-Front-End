import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { employeesService } from '@/Api/services'

interface Employee {
  id: string
  name: string
  email?: string
  phone?: string
  role: string
  position?: string
  createdAt?: string
  updatedAt?: string
}

interface EmployeesState {
  employees: Employee[]
  selectedEmployee: Employee | null
  isLoading: boolean
  error: string | null
  message: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState: EmployeesState = {
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params?: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response: any = await employeesService.getAll(params)
      return {
        employees: response.data || response.items || response,
        message: response.message || response._message || 'Employees fetched successfully',
        pagination: response.pagination || { page: params?.page || 1, limit: params?.limit || 10, total: response.total || 0 },
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch employees'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await employeesService.getById(id)
      return {
        employee: response.data || response,
        message: response.message || response._message || 'Employee fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch employee'
      return rejectWithValue(errorMessage)
    }
  }
)

// Create employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data: Partial<Employee>, { rejectWithValue }) => {
    try {
      const response: any = await employeesService.create(data)
      return {
        employee: response.data || response,
        message: response.message || response._message || 'Employee created successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to create employee'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: string; data: Partial<Employee> }, { rejectWithValue }) => {
    try {
      const response: any = await employeesService.update(id, data)
      return {
        employee: response.data || response,
        message: response.message || response._message || 'Employee updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update employee'
      return rejectWithValue(errorMessage)
    }
  }
)

// Update employee role
export const updateEmployeeRole = createAsyncThunk(
  'employees/updateRole',
  async ({ id, role }: { id: string; role: string }, { rejectWithValue }) => {
    try {
      const response: any = await employeesService.updateRole(id, role)
      return {
        employee: response.data || response,
        message: response.message || response._message || 'Employee role updated successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to update employee role'
      return rejectWithValue(errorMessage)
    }
  }
)

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await employeesService.delete(id)
      return {
        id,
        message: response.message || response._message || 'Employee deleted successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to delete employee'
      return rejectWithValue(errorMessage)
    }
  }
)

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees = action.payload.employees
        state.pagination = action.payload.pagination
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch by ID
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedEmployee = action.payload.employee
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create
    builder
      .addCase(createEmployee.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees.push(action.payload.employee)
        state.message = action.payload.message
        state.error = null
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.employees.findIndex(e => e.id === action.payload.employee.id)
        if (index !== -1) {
          state.employees[index] = action.payload.employee
        }
        if (state.selectedEmployee?.id === action.payload.employee.id) {
          state.selectedEmployee = action.payload.employee
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update role
    builder
      .addCase(updateEmployeeRole.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateEmployeeRole.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.employees.findIndex(e => e.id === action.payload.employee.id)
        if (index !== -1) {
          state.employees[index] = action.payload.employee
        }
        if (state.selectedEmployee?.id === action.payload.employee.id) {
          state.selectedEmployee = action.payload.employee
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(updateEmployeeRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees = state.employees.filter(e => e.id !== action.payload.id)
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = null
        }
        state.message = action.payload.message
        state.error = null
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, setSelectedEmployee } = employeesSlice.actions
export default employeesSlice.reducer

