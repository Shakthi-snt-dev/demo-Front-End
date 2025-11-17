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
import { storeTypesService } from '@/Api/services'
import { useToast } from '@/hooks/use-toast'

const storeTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type StoreTypeFormData = z.infer<typeof storeTypeSchema>

export default function StoreTypesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [storeTypes, setStoreTypes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreTypeFormData>({
    resolver: zodResolver(storeTypeSchema),
  })

  useEffect(() => {
    loadStoreTypes()
  }, [])

  const loadStoreTypes = async () => {
    try {
      setLoading(true)
      const response = await storeTypesService.getAll()
      setStoreTypes(response.data.data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load store types',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: StoreTypeFormData) => {
    try {
      setLoading(true)
      if (editingType) {
        // Update not supported in current API
        toast({
          title: 'Info',
          description: 'Update functionality not available',
        })
      } else {
        await storeTypesService.create(data)
        toast({
          title: 'Success',
          description: 'Store type created successfully',
        })
      }
      setIsDialogOpen(false)
      setEditingType(null)
      reset()
      loadStoreTypes()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save store type',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (name: string) => {
    if (!confirm('Are you sure you want to delete this store type?')) return

    try {
      setLoading(true)
      await storeTypesService.delete(name)
      toast({
        title: 'Success',
        description: 'Store type deleted successfully',
      })
      loadStoreTypes()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete store type',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingType(null)
    reset()
    setIsDialogOpen(true)
  }

  const filteredTypes = storeTypes.filter((type) =>
    type.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Store Types</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage store type categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Store Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Store Type</DialogTitle>
              <DialogDescription>Create a new store type category</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description')} />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingType(null)
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
          placeholder="Search store types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {loading && storeTypes.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Store Type</TableHead>
                <TableHead>Store Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No store types found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTypes.map((type: any) => (
                  <TableRow key={type.name}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.storeCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(type.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

