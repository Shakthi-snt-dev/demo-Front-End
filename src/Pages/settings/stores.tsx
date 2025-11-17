import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Loader2, Building2 } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { storesService } from '@/Api/services'
import { useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/use-toast'

const storeSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeType: z.string().optional(),
  phone: z.string().optional(),
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  enablePOS: z.boolean().optional(),
  enableInventory: z.boolean().optional(),
  timeZone: z.string().optional(),
})

type StoreFormData = z.infer<typeof storeSchema>

export default function ManageStoresPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [stores, setStores] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      enablePOS: true,
      enableInventory: true,
      timeZone: 'UTC',
    },
  })

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      setLoading(true)
      const response = await storesService.getAll()
      setStores(response.data.data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load stores',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: StoreFormData) => {
    try {
      setLoading(true)
      const payload = {
        storeName: data.storeName,
        storeType: data.storeType,
        phone: data.phone,
        address: data.streetNumber || data.streetName || data.city || data.state || data.postalCode
          ? {
              streetNumber: data.streetNumber || '',
              streetName: data.streetName || '',
              city: data.city || '',
              state: data.state || '',
              postalCode: data.postalCode || '',
            }
          : undefined,
        enablePOS: data.enablePOS,
        enableInventory: data.enableInventory,
        timeZone: data.timeZone,
      }

      if (editingStore) {
        await storesService.update(editingStore.id, payload)
        toast({
          title: 'Success',
          description: 'Store updated successfully',
        })
      } else {
        await storesService.create(payload)
        toast({
          title: 'Success',
          description: 'Store created successfully',
        })
      }
      setIsDialogOpen(false)
      setEditingStore(null)
      reset()
      loadStores()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save store',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (store: any) => {
    setEditingStore(store)
    reset({
      storeName: store.storeName || '',
      storeType: store.storeType || '',
      phone: store.phone || '',
      streetNumber: store.address?.streetNumber || '',
      streetName: store.address?.streetName || '',
      city: store.address?.city || '',
      state: store.address?.state || '',
      postalCode: store.address?.postalCode || '',
      enablePOS: store.enablePOS ?? true,
      enableInventory: store.enableInventory ?? true,
      timeZone: store.timeZone || 'UTC',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return

    try {
      setLoading(true)
      await storesService.delete(id)
      toast({
        title: 'Success',
        description: 'Store deleted successfully',
      })
      loadStores()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete store',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingStore(null)
    reset({
      enablePOS: true,
      enableInventory: true,
      timeZone: 'UTC',
    })
    setIsDialogOpen(true)
  }

  const filteredStores = stores.filter(
    (store) =>
      store.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.storeType?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manage Stores</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your stores and their settings
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
              <DialogDescription>
                {editingStore ? 'Update store information' : 'Create a new store'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">
                  Store Name <span className="text-destructive">*</span>
                </Label>
                <Input id="storeName" {...register('storeName')} />
                {errors.storeName && (
                  <p className="text-sm text-destructive">{errors.storeName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeType">Store Type</Label>
                <Input id="storeType" {...register('storeType')} placeholder="e.g., Company Owned" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="streetNumber" className="text-xs">Street Number</Label>
                    <Input id="streetNumber" {...register('streetNumber')} />
                  </div>
                  <div>
                    <Label htmlFor="streetName" className="text-xs">Street Name</Label>
                    <Input id="streetName" {...register('streetName')} />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs">City</Label>
                    <Input id="city" {...register('city')} />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs">State</Label>
                    <Input id="state" {...register('state')} />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-xs">Postal Code</Label>
                    <Input id="postalCode" {...register('postalCode')} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeZone">Time Zone</Label>
                <Input id="timeZone" {...register('timeZone')} placeholder="UTC" />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingStore(null)
                    reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingStore ? (
                    'Update'
                  ) : (
                    'Create'
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
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {loading && stores.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Store Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No stores found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store: any) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.storeName}</TableCell>
                    <TableCell>{store.storeType || 'N/A'}</TableCell>
                    <TableCell>
                      {store.address
                        ? `${store.address.streetNumber || ''} ${store.address.streetName || ''}`.trim()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{store.address?.postalCode || 'N/A'}</TableCell>
                    <TableCell>{store.address?.city || 'N/A'}</TableCell>
                    <TableCell>{store.address?.state || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(store)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(store.id)}
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

