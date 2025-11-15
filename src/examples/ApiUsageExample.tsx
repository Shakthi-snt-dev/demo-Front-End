/**
 * Example Component: How to use APIs with Redux Toolkit and Toast Notifications
 * 
 * This file demonstrates the proper way to:
 * 1. Dispatch async thunks from Redux slices
 * 2. Handle success and error responses
 * 3. Show toast notifications with API messages
 * 4. Access Redux state
 */

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/use-toast'
import { useToastFromState } from '@/hooks/useApiToast'

// Import all the async thunks
import { 
  fetchCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '@/features/customers/customersSlice'

import { 
  fetchInventory, 
  createInventoryItem, 
  updateStock 
} from '@/features/inventory/inventorySlice'

import { 
  fetchRepairs, 
  createRepair, 
  updateRepairStatus 
} from '@/features/repairs/repairsSlice'

import { 
  createSale, 
  fetchSales 
} from '@/features/pos/posSlice'

import { 
  fetchEmployees, 
  createEmployee 
} from '@/features/employees/employeesSlice'

import { 
  fetchDashboardStats 
} from '@/features/reports/reportsSlice'

export function ApiUsageExample() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  // Access Redux state
  const customersState = useAppSelector((state) => state.customers)
  const inventoryState = useAppSelector((state) => state.inventory)
  const repairsState = useAppSelector((state) => state.repairs)

  // Use the toast hook to automatically show messages
  useToastFromState(customersState, {
    successTitle: 'Customer',
    errorTitle: 'Customer Error',
  })

  useToastFromState(inventoryState, {
    successTitle: 'Inventory',
    errorTitle: 'Inventory Error',
  })

  // Example 1: Fetch customers with proper error handling
  const handleFetchCustomers = async () => {
    try {
      const result = await dispatch(fetchCustomers({ page: 1, limit: 10 }))
      
      if (fetchCustomers.fulfilled.match(result)) {
        // Success is handled by useToastFromState hook
        // But you can also manually show toast:
        toast({
          title: 'Success',
          description: result.payload.message || 'Customers fetched successfully',
        })
      } else if (fetchCustomers.rejected.match(result)) {
        // Error is handled by useToastFromState hook
        // But you can also manually show toast:
        const errorMessage = (result.payload as string) || 'Failed to fetch customers'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Example 2: Create customer
  const handleCreateCustomer = async () => {
    try {
      const result = await dispatch(createCustomer({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      }))

      if (createCustomer.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Customer created successfully',
        })
      } else if (createCustomer.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Failed to create customer'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Example 3: Update customer
  const handleUpdateCustomer = async (id: string) => {
    try {
      const result = await dispatch(updateCustomer({
        id,
        data: { name: 'Jane Doe' },
      }))

      if (updateCustomer.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Customer updated successfully',
        })
      } else if (updateCustomer.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Failed to update customer'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Example 4: Delete customer
  const handleDeleteCustomer = async (id: string) => {
    try {
      const result = await dispatch(deleteCustomer(id))

      if (deleteCustomer.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Customer deleted successfully',
        })
      } else if (deleteCustomer.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Failed to delete customer'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Example 5: Create inventory item
  const handleCreateInventoryItem = async () => {
    try {
      const result = await dispatch(createInventoryItem({
        name: 'Product Name',
        quantity: 10,
        price: 29.99,
        category: 'Electronics',
      }))

      if (createInventoryItem.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Item created successfully',
        })
      } else if (createInventoryItem.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Failed to create item'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Example 6: Create sale (POS)
  const handleCreateSale = async () => {
    try {
      const result = await dispatch(createSale({
        items: [
          { id: '1', name: 'Product 1', quantity: 2, price: 10.00 },
          { id: '2', name: 'Product 2', quantity: 1, price: 20.00 },
        ],
        total: 40.00,
        paymentMethod: 'cash',
      }))

      if (createSale.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Sale created successfully',
        })
      } else if (createSale.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Failed to create sale'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Example 7: Fetch dashboard stats
  const handleFetchDashboardStats = async () => {
    try {
      const result = await dispatch(fetchDashboardStats())

      if (fetchDashboardStats.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Stats fetched successfully',
        })
      } else if (fetchDashboardStats.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Failed to fetch stats'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  // Load data on mount
  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 10 }))
    dispatch(fetchInventory({ page: 1, limit: 10 }))
    dispatch(fetchRepairs({ page: 1, limit: 10 }))
    dispatch(fetchDashboardStats())
  }, [dispatch])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Usage Examples</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Customers</h2>
          <p>Loading: {customersState.isLoading ? 'Yes' : 'No'}</p>
          <p>Count: {customersState.customers.length}</p>
          <button onClick={handleFetchCustomers}>Fetch Customers</button>
          <button onClick={handleCreateCustomer}>Create Customer</button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Inventory</h2>
          <p>Loading: {inventoryState.isLoading ? 'Yes' : 'No'}</p>
          <p>Count: {inventoryState.items.length}</p>
          <button onClick={handleCreateInventoryItem}>Create Item</button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Repairs</h2>
          <p>Loading: {repairsState.isLoading ? 'Yes' : 'No'}</p>
          <p>Count: {repairsState.repairs.length}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * KEY POINTS:
 * 
 * 1. Always use useAppDispatch and useAppSelector from @/store/hooks
 * 2. Dispatch async thunks and check the result with .fulfilled.match() and .rejected.match()
 * 3. Extract messages from result.payload.message for success messages
 * 4. Extract error messages from result.payload (string) for error messages
 * 5. Use useToastFromState hook for automatic toast notifications
 * 6. All API responses include a message field that can be displayed to users
 * 7. All errors are properly extracted and shown with toast notifications
 * 8. Loading states are available in Redux state (state.sliceName.isLoading)
 * 9. Error states are available in Redux state (state.sliceName.error)
 * 10. Success messages are available in Redux state (state.sliceName.message)
 */

