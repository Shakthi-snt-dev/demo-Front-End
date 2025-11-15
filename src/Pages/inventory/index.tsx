import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  clearError,
  clearMessage,
} from '@/features/inventory/inventorySlice'
import { useToast } from '@/hooks/use-toast'
import { useToastFromState } from '@/hooks/useApiToast'

const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  price: z.number().min(0).optional(),
  quantity: z.number().min(0),
  category: z.string().optional(),
  description: z.string().optional(),
})

type InventoryFormData = z.infer<typeof inventorySchema>

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const inventoryState = useAppSelector((state) => state.inventory)

  // Auto-show toast notifications
  useToastFromState(inventoryState, {
    successTitle: 'Inventory',
    errorTitle: 'Inventory Error',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
  })

  // Fetch inventory on mount
  useEffect(() => {
    dispatch(fetchInventory({ page: 1, limit: 100 }))
  }, [dispatch])

  const onSubmit = async (data: InventoryFormData) => {
    try {
      if (editingItem) {
        const result = await dispatch(updateInventoryItem({ id: editingItem, data }))
        if (updateInventoryItem.fulfilled.match(result)) {
          toast({
            title: 'Success',
            description: result.payload.message || 'Item updated successfully',
          })
        }
      } else {
        const result = await dispatch(createInventoryItem(data))
        if (createInventoryItem.fulfilled.match(result)) {
          toast({
            title: 'Success',
            description: result.payload.message || 'Item created successfully',
          })
        }
      }
      setIsDialogOpen(false)
      reset()
      setEditingItem(null)
      dispatch(fetchInventory({ page: 1, limit: 100 }))
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save item',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const result = await dispatch(deleteInventoryItem(id))
        if (deleteInventoryItem.fulfilled.match(result)) {
          toast({
            title: 'Success',
            description: result.payload.message || 'Item deleted successfully',
          })
          dispatch(fetchInventory({ page: 1, limit: 100 }))
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete item',
          variant: 'destructive',
        })
      }
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item.id)
    reset({
      name: item.name || '',
      sku: item.sku || '',
      price: item.price || 0,
      quantity: item.quantity || 0,
      category: item.category || '',
      description: item.description || '',
    })
    setIsDialogOpen(true)
  }

  const items = inventoryState.items || []
  const filteredItems = items.filter((item: any) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                setEditingItem(null)
                reset()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update product information' : 'Add a new product to your inventory'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Enter SKU code"
                  {...register('sku')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    {...register('quantity', { valueAsNumber: true })}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-destructive">{errors.quantity.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  {...register('category')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  {...register('description')}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    reset()
                    setEditingItem(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={inventoryState.isLoading}>
                  {inventoryState.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingItem ? 'Update' : 'Add Item'
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
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {inventoryState.isLoading && items.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name || 'N/A'}</TableCell>
                    <TableCell>{item.sku || 'N/A'}</TableCell>
                    <TableCell>{item.category || 'N/A'}</TableCell>
                    <TableCell>${item.price ? item.price.toFixed(2) : '0.00'}</TableCell>
                    <TableCell>{item.quantity || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={inventoryState.isLoading}
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

