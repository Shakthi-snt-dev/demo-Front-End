import { useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
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

const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0),
  stock: z.number().min(0),
  category: z.string().min(1, 'Category is required'),
})

type InventoryFormData = z.infer<typeof inventorySchema>

const mockInventory = [
  { id: '1', name: 'iPhone 14 Pro Screen', sku: 'IP14P-SCR', price: 149.99, stock: 15, category: 'Screens' },
  { id: '2', name: 'Samsung Battery', sku: 'SAM-BAT', price: 49.99, stock: 32, category: 'Batteries' },
  { id: '3', name: 'USB-C Cable', sku: 'USB-C-01', price: 12.99, stock: 87, category: 'Cables' },
]

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
  })

  const onSubmit = (data: InventoryFormData) => {
    console.log('Save inventory item:', data)
    setIsDialogOpen(false)
    reset()
    setEditingItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingItem ? 'Update product information' : 'Add a new product to your inventory'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </Label>
                <Input 
                  id="name" 
                  placeholder="Enter product name"
                  className="h-10"
                  {...register('name')} 
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-medium">
                  SKU
                </Label>
                <Input 
                  id="sku" 
                  placeholder="Enter SKU code"
                  className="h-10"
                  {...register('sku')} 
                />
                {errors.sku && (
                  <p className="text-xs text-destructive mt-1">{errors.sku.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-10"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-medium">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    className="h-10"
                    {...register('stock', { valueAsNumber: true })}
                  />
                  {errors.stock && (
                    <p className="text-xs text-destructive mt-1">{errors.stock.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Input 
                  id="category" 
                  placeholder="Enter category"
                  className="h-10"
                  {...register('category')} 
                />
                {errors.category && (
                  <p className="text-xs text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>
              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false)
                    reset()
                    setEditingItem(null)
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  {editingItem ? 'Update' : 'Add Item'}
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
            {mockInventory
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

