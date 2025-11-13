import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Search, Plus, Edit, Trash2, Users, Mail, Phone, MapPin } from 'lucide-react';

const customersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900',
    address: '123 Main St, New York, NY',
    orders: 24,
    totalSpent: 2850,
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 234-567-8901',
    address: '456 Oak Ave, Los Angeles, CA',
    orders: 18,
    totalSpent: 1920,
    status: 'active'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.j@email.com',
    phone: '+1 234-567-8902',
    address: '789 Pine Rd, Chicago, IL',
    orders: 35,
    totalSpent: 4200,
    status: 'vip'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    phone: '+1 234-567-8903',
    address: '321 Elm St, Houston, TX',
    orders: 12,
    totalSpent: 1450,
    status: 'active'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.w@email.com',
    phone: '+1 234-567-8904',
    address: '654 Maple Dr, Phoenix, AZ',
    orders: 8,
    totalSpent: 890,
    status: 'active'
  },
  {
    id: 6,
    name: 'Diana Martinez',
    email: 'diana.m@email.com',
    phone: '+1 234-567-8905',
    address: '987 Cedar Ln, Philadelphia, PA',
    orders: 42,
    totalSpent: 5600,
    status: 'vip'
  },
];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState(customersData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Customer Management</h1>
          <p className="text-slate-600">View and manage your customers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Full Name</Label>
                <Input id="customer-name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email</Label>
                <Input id="customer-email" type="email" placeholder="customer@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Phone</Label>
                <Input id="customer-phone" placeholder="+1 234-567-8900" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-address">Address</Label>
                <Textarea id="customer-address" placeholder="Enter customer address" rows={3} />
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(false)}>
                  Add Customer
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Customers</p>
                <h3 className="text-slate-900">{totalCustomers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-600">VIP Customers</p>
                <h3 className="text-slate-900">{vipCustomers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Revenue</p>
                <h3 className="text-slate-900">${totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search customers..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-slate-900">{customer.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="max-w-xs truncate">{customer.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-900">{customer.orders}</TableCell>
                    <TableCell className="text-slate-900">${customer.totalSpent}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'vip' ? 'default' : 'secondary'} className={customer.status === 'vip' ? 'bg-purple-600' : ''}>
                        {customer.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
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
