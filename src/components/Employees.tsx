import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Shield,
  UserCircle,
  Clock,
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'technician' | 'cashier';
  store: string;
  status: 'active' | 'inactive';
  hourlyRate: number;
  permissions: {
    pos: boolean;
    inventory: boolean;
    customers: boolean;
    tickets: boolean;
    reports: boolean;
    settings: boolean;
  };
  createdDate: string;
}

const employeesData: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@repairpos.com',
    phone: '+1 234-567-8900',
    role: 'admin',
    store: 'All Stores',
    status: 'active',
    hourlyRate: 25,
    permissions: {
      pos: true,
      inventory: true,
      customers: true,
      tickets: true,
      reports: true,
      settings: true,
    },
    createdDate: '2025-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@repairpos.com',
    phone: '+1 234-567-8901',
    role: 'manager',
    store: 'Main Store',
    status: 'active',
    hourlyRate: 20,
    permissions: {
      pos: true,
      inventory: true,
      customers: true,
      tickets: true,
      reports: true,
      settings: false,
    },
    createdDate: '2025-02-10',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.w@repairpos.com',
    phone: '+1 234-567-8902',
    role: 'technician',
    store: 'Main Store',
    status: 'active',
    hourlyRate: 18,
    permissions: {
      pos: false,
      inventory: true,
      customers: false,
      tickets: true,
      reports: false,
      settings: false,
    },
    createdDate: '2025-03-05',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@repairpos.com',
    phone: '+1 234-567-8903',
    role: 'cashier',
    store: 'Downtown Store',
    status: 'active',
    hourlyRate: 15,
    permissions: {
      pos: true,
      inventory: false,
      customers: true,
      tickets: false,
      reports: false,
      settings: false,
    },
    createdDate: '2025-04-12',
  },
];

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'technician',
    store: '',
    hourlyRate: '',
    permissions: {
      pos: false,
      inventory: false,
      customers: false,
      tickets: false,
      reports: false,
      settings: false,
    },
  });

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600';
      case 'manager':
        return 'bg-blue-600';
      case 'technician':
        return 'bg-green-600';
      case 'cashier':
        return 'bg-orange-600';
      default:
        return 'bg-slate-600';
    }
  };

  const handleAddEmployee = () => {
    const employee: Employee = {
      id: String(employees.length + 1),
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role as 'admin' | 'manager' | 'technician' | 'cashier',
      store: newEmployee.store,
      status: 'active',
      hourlyRate: parseFloat(newEmployee.hourlyRate) || 0,
      permissions: newEmployee.permissions,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setEmployees([employee, ...employees]);
    setIsAddDialogOpen(false);
    // Reset form
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: 'technician',
      store: '',
      hourlyRate: '',
      permissions: {
        pos: false,
        inventory: false,
        customers: false,
        tickets: false,
        reports: false,
        settings: false,
      },
    });
  };

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    admins: employees.filter((e) => e.role === 'admin').length,
    technicians: employees.filter((e) => e.role === 'technician').length,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Employee Management</h1>
          <p className="text-slate-600">Manage your team and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emp-name">Full Name *</Label>
                    <Input
                      id="emp-name"
                      placeholder="Enter employee name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-email">Email Address *</Label>
                    <Input
                      id="emp-email"
                      type="email"
                      placeholder="employee@email.com"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emp-phone">Phone Number</Label>
                    <Input
                      id="emp-phone"
                      placeholder="+1 234-567-8900"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-rate">Hourly Rate ($)</Label>
                    <Input
                      id="emp-rate"
                      type="number"
                      placeholder="0.00"
                      value={newEmployee.hourlyRate}
                      onChange={(e) => setNewEmployee({ ...newEmployee, hourlyRate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Role & Store */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Role & Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emp-role">Role *</Label>
                    <Select
                      value={newEmployee.role}
                      onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                    >
                      <SelectTrigger id="emp-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-store">Assigned Store</Label>
                    <Select
                      value={newEmployee.store}
                      onValueChange={(value) => setNewEmployee({ ...newEmployee, store: value })}
                    >
                      <SelectTrigger id="emp-store">
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Stores">All Stores</SelectItem>
                        <SelectItem value="Main Store">Main Store</SelectItem>
                        <SelectItem value="Downtown Store">Downtown Store</SelectItem>
                        <SelectItem value="Mall Store">Mall Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-pos">POS Access</Label>
                    <Switch
                      id="perm-pos"
                      checked={newEmployee.permissions.pos}
                      onCheckedChange={(checked) =>
                        setNewEmployee({
                          ...newEmployee,
                          permissions: { ...newEmployee.permissions, pos: checked },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-inventory">Inventory Management</Label>
                    <Switch
                      id="perm-inventory"
                      checked={newEmployee.permissions.inventory}
                      onCheckedChange={(checked) =>
                        setNewEmployee({
                          ...newEmployee,
                          permissions: { ...newEmployee.permissions, inventory: checked },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-customers">Customer Management</Label>
                    <Switch
                      id="perm-customers"
                      checked={newEmployee.permissions.customers}
                      onCheckedChange={(checked) =>
                        setNewEmployee({
                          ...newEmployee,
                          permissions: { ...newEmployee.permissions, customers: checked },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-tickets">Ticket Management</Label>
                    <Switch
                      id="perm-tickets"
                      checked={newEmployee.permissions.tickets}
                      onCheckedChange={(checked) =>
                        setNewEmployee({
                          ...newEmployee,
                          permissions: { ...newEmployee.permissions, tickets: checked },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-reports">Reports Access</Label>
                    <Switch
                      id="perm-reports"
                      checked={newEmployee.permissions.reports}
                      onCheckedChange={(checked) =>
                        setNewEmployee({
                          ...newEmployee,
                          permissions: { ...newEmployee.permissions, reports: checked },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="perm-settings">Settings Access</Label>
                    <Switch
                      id="perm-settings"
                      checked={newEmployee.permissions.settings}
                      onCheckedChange={(checked) =>
                        setNewEmployee({
                          ...newEmployee,
                          permissions: { ...newEmployee.permissions, settings: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddEmployee}>
                  Add Employee
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Employees</p>
                <h3 className="text-slate-900">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-slate-600">Active</p>
                <h3 className="text-slate-900">{stats.active}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-600">Admins</p>
                <h3 className="text-slate-900">{stats.admins}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-slate-600">Technicians</p>
                <h3 className="text-slate-900">{stats.technicians}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Employees</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-slate-900">{employee.name}</p>
                          <p className="text-slate-500">ID: {employee.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(employee.role)} text-white`}>
                        {employee.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-900">{employee.store}</TableCell>
                    <TableCell className="text-slate-900">${employee.hourlyRate}/hr</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
