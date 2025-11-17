import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Loader2, Building2, User } from 'lucide-react'
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
import { appUserAdminService } from '@/Api/services'
import { useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/use-toast'

const appUserAdminSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  isPrimaryOwner: z.boolean().optional(),
  createAsEmployee: z.boolean().optional(),
  address: z.object({
    streetNumber: z.string().optional(),
    streetName: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
})

type AppUserAdminFormData = z.infer<typeof appUserAdminSchema>

export default function AppUserAdminPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [appUserAdmins, setAppUserAdmins] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppUserAdminFormData>({
    resolver: zodResolver(appUserAdminSchema),
    defaultValues: {
      isPrimaryOwner: false,
      createAsEmployee: true,
    },
  })

  useEffect(() => {
    if (user?.id) {
      loadAppUserAdmins()
    }
  }, [user?.id])

  const loadAppUserAdmins = async () => {
    try {
      setLoading(true)
      const response = await appUserAdminService.getAll(user.id)
      setAppUserAdmins(response.data.data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load business owners',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: AppUserAdminFormData) => {
    try {
      setLoading(true)
      if (editingAdmin) {
        await appUserAdminService.update(editingAdmin.id, data)
        toast({
          title: 'Success',
          description: 'Business owner updated successfully',
        })
      } else {
        await appUserAdminService.create(user.id, {
          ...data,
          createAsEmployee: data.createAsEmployee ?? true,
          storeId: user.storeId, // Add storeId from user context
        })
        toast({
          title: 'Success',
          description: 'Business owner added successfully',
        })
      }
      setIsDialogOpen(false)
      setEditingAdmin(null)
      reset()
      loadAppUserAdmins()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save business owner',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin)
    reset({
      fullName: admin.fullName || '',
      email: admin.email || '',
      phone: admin.phone || '',
      isPrimaryOwner: admin.isPrimaryOwner || false,
      createAsEmployee: false, // Already created
      address: admin.address || {},
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business owner?')) return

    try {
      setLoading(true)
      await appUserAdminService.delete(id)
      toast({
        title: 'Success',
        description: 'Business owner deleted successfully',
      })
      loadAppUserAdmins()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete business owner',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingAdmin(null)
    reset({
      isPrimaryOwner: false,
      createAsEmployee: true,
      role: 'Owner',
    })
    setIsDialogOpen(true)
  }

  const filteredAdmins = appUserAdmins.filter(
    (admin) =>
      admin.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Business Owners</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage business owners and partners
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Business Owner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAdmin ? 'Edit Business Owner' : 'Add Business Owner'}
              </DialogTitle>
              <DialogDescription>
                {editingAdmin
                  ? 'Update business owner information'
                  : 'Add a new business owner or partner to your business'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input id="fullName" {...register('fullName')} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {!editingAdmin && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="createAsEmployee"
                    {...register('createAsEmployee')}
                    className="rounded border-gray-300"
                    defaultChecked={true}
                  />
                  <Label htmlFor="createAsEmployee" className="cursor-pointer">
                    Create as Employee with Owner role
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    (Business owners are automatically assigned Owner role)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Address (Optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="streetNumber" className="text-xs">Street Number</Label>
                    <Input
                      id="streetNumber"
                      {...register('address.streetNumber')}
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="streetName" className="text-xs">Street Name</Label>
                    <Input
                      id="streetName"
                      {...register('address.streetName')}
                      placeholder="Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs">City</Label>
                    <Input id="city" {...register('address.city')} placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs">State</Label>
                    <Input id="state" {...register('address.state')} placeholder="State" />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-xs">Country</Label>
                    <Input id="country" {...register('address.country')} placeholder="Country" />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-xs">Postal Code</Label>
                    <Input
                      id="postalCode"
                      {...register('address.postalCode')}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingAdmin(null)
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
                  ) : editingAdmin ? (
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
          placeholder="Search business owners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {loading && appUserAdmins.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No business owners found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin: any) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {admin.fullName?.[0]?.toUpperCase() || 'B'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.fullName || 'N/A'}</div>
                          {admin.isPrimaryOwner && (
                            <span className="text-xs text-muted-foreground">Primary Owner</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        Business Owner
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(admin)}
                          disabled={admin.isPrimaryOwner}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(admin.id)}
                          disabled={admin.isPrimaryOwner}
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

