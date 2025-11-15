import { useState, useEffect } from 'react'
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  fetchCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  searchCustomers,
  clearError,
  clearMessage 
} from '@/features/customers/customersSlice'
import { useToast } from '@/hooks/use-toast'
import { useToastFromState } from '@/hooks/useApiToast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const customersState = useAppSelector((state) => state.customers)
  
  // Auto-show toast notifications
  useToastFromState(customersState, {
    successTitle: 'Customer',
    errorTitle: 'Customer Error',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  // Fetch customers on mount
  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 100 }))
  }, [dispatch])

  // Search customers
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        dispatch(searchCustomers(searchQuery))
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      dispatch(fetchCustomers({ page: 1, limit: 100 }))
    }
  }, [searchQuery, dispatch])

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (editingCustomer) {
        const result = await dispatch(updateCustomer({ id: editingCustomer, data }))
        if (updateCustomer.fulfilled.match(result)) {
          toast({
            title: 'Success',
            description: result.payload.message || 'Customer updated successfully',
          })
        }
      } else {
        const result = await dispatch(createCustomer(data))
        if (createCustomer.fulfilled.match(result)) {
          toast({
            title: 'Success',
            description: result.payload.message || 'Customer created successfully',
          })
        }
      }
      setIsDialogOpen(false)
      reset()
      setEditingCustomer(null)
      dispatch(fetchCustomers({ page: 1, limit: 100 }))
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save customer',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const result = await dispatch(deleteCustomer(id))
        if (deleteCustomer.fulfilled.match(result)) {
          toast({
            title: 'Success',
            description: result.payload.message || 'Customer deleted successfully',
          })
          dispatch(fetchCustomers({ page: 1, limit: 100 }))
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete customer',
          variant: 'destructive',
        })
      }
    }
  }

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer.id)
    reset({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    })
    setIsDialogOpen(true)
  }

  const customers = customersState.customers || []

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your customer database</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                setEditingCustomer(null)
                reset()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Update customer information' : 'Add a new customer to your database'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter address"
                  {...register('address')}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    reset()
                    setEditingCustomer(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={customersState.isLoading}>
                  {customersState.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingCustomer ? 'Update' : 'Create'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {customersState.isLoading && customers.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{(customer.name || 'C')[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name || 'N/A'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{customer.email || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{customer.phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{customer.address || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDelete(customer.id)}
                          disabled={customersState.isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

