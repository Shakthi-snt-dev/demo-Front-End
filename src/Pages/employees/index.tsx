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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { DynamicForm, type FormConfiguration } from '@/components/forms/DynamicForm'
import { employeesService, formConfigurationService } from '@/Api/services'
import { useAppSelector } from '@/store/hooks'
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch } from '@/store/hooks'
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '@/features/employees/employeesSlice'

export default function EmployeesPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { employees, isLoading: loading, error } = useAppSelector((state) => state.employees)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [formConfig, setFormConfig] = useState<FormConfiguration | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    // Load employees regardless of storeId
    loadEmployees()
    // Load form configuration if storeId is available
    if (user?.storeId) {
      loadFormConfiguration()
    }
  }, [user?.storeId])

  const loadEmployees = async () => {
    try {
      // Note: fetchEmployees doesn't support storeId filter yet, so we fetch all and filter client-side
      // Or we can update the API to support storeId filter
      await dispatch(fetchEmployees()).unwrap()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to load employees',
        variant: 'destructive',
      })
    }
  }

  const loadFormConfiguration = async () => {
    try {
      setFormLoading(true)
      const response = await formConfigurationService.getEmployeeForm(user?.storeId)
      setFormConfig(response.data.data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load form configuration',
        variant: 'destructive',
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingEmployee) {
        await dispatch(updateEmployee({ id: editingEmployee.id, data })).unwrap()
        toast({
          title: 'Success',
          description: 'Employee updated successfully',
        })
      } else {
        await dispatch(createEmployee({ ...data, storeId: user?.storeId })).unwrap()
        toast({
          title: 'Success',
          description: 'Employee created successfully',
        })
      }
      setIsDialogOpen(false)
      setEditingEmployee(null)
      loadEmployees()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to save employee',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      await dispatch(deleteEmployee(id)).unwrap()
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      })
      loadEmployees()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to delete employee',
        variant: 'destructive',
      })
    }
  }

  const handleAddNew = () => {
    setEditingEmployee(null)
    setIsDialogOpen(true)
  }

  const filteredEmployees = employees.filter(
    (emp: any) => {
      const name = emp.fullName || emp.name || ''
      const email = emp.email || ''
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage employees, roles, and permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee
                  ? 'Update employee information'
                  : 'Create a new employee account'}
              </DialogDescription>
            </DialogHeader>
            {formLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : formConfig ? (
              <DynamicForm
                configuration={formConfig}
                onSubmit={handleSubmit}
                defaultValues={editingEmployee || {}}
                loading={loading}
                submitLabel={editingEmployee ? 'Update' : 'Create'}
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Failed to load form configuration
              </p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee: any) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {(employee.fullName || employee.name || 'E')?.[0]?.toUpperCase() || 'E'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{employee.fullName || employee.name || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.role || 'N/A'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              employee.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(employee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(employee.id)}
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
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground">Roles & Permissions management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground">Commission management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
