import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Loader2, Shield } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { rolesService } from '@/Api/services'
import { useToast } from '@/hooks/use-toast'

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isSuperUser: z.boolean().optional(),
})

type RoleFormData = z.infer<typeof roleSchema>

const modules = ['pos', 'inventory', 'customers', 'tickets', 'reports', 'settings']

export default function RolesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [permissions, setPermissions] = useState<Record<string, { access: boolean; edit: boolean; delete: boolean }>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  })

  const isSuperUser = watch('isSuperUser')

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const response = await rolesService.getAll()
      setRoles(response.data.data || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load roles',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: RoleFormData) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        permissions: permissions,
      }

      if (editingRole) {
        await rolesService.update(editingRole.id, payload)
        toast({
          title: 'Success',
          description: 'Role updated successfully',
        })
      } else {
        await rolesService.create(payload)
        toast({
          title: 'Success',
          description: 'Role created successfully',
        })
      }
      setIsDialogOpen(false)
      setEditingRole(null)
      reset()
      setPermissions({})
      loadRoles()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save role',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (role: any) => {
    setEditingRole(role)
    reset({
      name: role.name,
      description: role.description || '',
      isSuperUser: role.isSuperUser || false,
    })
    setPermissions(role.permissions || {})
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return

    try {
      setLoading(true)
      await rolesService.delete(id)
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      })
      loadRoles()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete role',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingRole(null)
    reset({
      isSuperUser: false,
    })
    setPermissions({})
    setIsDialogOpen(true)
  }

  const updatePermission = (module: string, field: 'access' | 'edit' | 'delete', value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [field]: value,
        // If access is false, disable edit and delete
        ...(field === 'access' && !value ? { edit: false, delete: false } : {}),
        // If edit is false, disable delete
        ...(field === 'edit' && !value ? { delete: false } : {}),
      },
    }))
  }

  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update role and permissions' : 'Create a new role with permissions'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Role Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  disabled={!!editingRole}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description')} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isSuperUser" {...register('isSuperUser')} />
                <Label htmlFor="isSuperUser" className="cursor-pointer">
                  Super User (Full Access)
                </Label>
              </div>

              {!isSuperUser && (
                <div className="space-y-4 border rounded-lg p-4">
                  <Label>Module Permissions</Label>
                  <div className="space-y-3">
                    {modules.map((module) => (
                      <div key={module} className="flex items-center justify-between border-b pb-2">
                        <Label className="capitalize">{module}</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permissions[module]?.access || false}
                              onChange={(e) => updatePermission(module, 'access', e.target.checked)}
                              className="rounded"
                            />
                            <Label className="text-xs">Access</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permissions[module]?.edit || false}
                              onChange={(e) => updatePermission(module, 'edit', e.target.checked)}
                              disabled={!permissions[module]?.access}
                              className="rounded"
                            />
                            <Label className="text-xs">Edit</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permissions[module]?.delete || false}
                              onChange={(e) => updatePermission(module, 'delete', e.target.checked)}
                              disabled={!permissions[module]?.edit}
                              className="rounded"
                            />
                            <Label className="text-xs">Delete</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingRole(null)
                    reset()
                    setPermissions({})
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
                  ) : editingRole ? (
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
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {loading && roles.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Super User</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || 'N/A'}</TableCell>
                    <TableCell>
                      {role.isSuperUser ? (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{role.employeeCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(role.id)}
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

