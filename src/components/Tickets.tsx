import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
  Printer,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Phone,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Ticket {
  id: string;
  ticketNumber: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  device: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  depositPaid: number;
  createdDate: string;
  dueDate: string;
  assignedTo: string;
  notes: string;
}

const ticketsData: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-001',
    customer: 'John Doe',
    customerPhone: '+1 234-567-8900',
    customerEmail: 'john@email.com',
    device: 'iPhone 13 Pro',
    issue: 'Cracked screen replacement',
    status: 'in-progress',
    priority: 'high',
    estimatedCost: 250,
    depositPaid: 100,
    createdDate: '2025-11-08',
    dueDate: '2025-11-11',
    assignedTo: 'Tech A',
    notes: 'Customer needs device back ASAP',
  },
  {
    id: '2',
    ticketNumber: 'TKT-002',
    customer: 'Jane Smith',
    customerPhone: '+1 234-567-8901',
    customerEmail: 'jane@email.com',
    device: 'Samsung Galaxy S21',
    issue: 'Battery replacement',
    status: 'pending',
    priority: 'medium',
    estimatedCost: 80,
    depositPaid: 50,
    createdDate: '2025-11-09',
    dueDate: '2025-11-12',
    assignedTo: 'Tech B',
    notes: 'Original battery swelling',
  },
  {
    id: '3',
    ticketNumber: 'TKT-003',
    customer: 'Bob Johnson',
    customerPhone: '+1 234-567-8902',
    customerEmail: 'bob@email.com',
    device: 'iPad Air',
    issue: 'Water damage repair',
    status: 'completed',
    priority: 'urgent',
    estimatedCost: 350,
    depositPaid: 200,
    createdDate: '2025-11-05',
    dueDate: '2025-11-08',
    assignedTo: 'Tech A',
    notes: 'Device completely cleaned and tested',
  },
];

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states for new ticket
  const [newTicket, setNewTicket] = useState({
    customer: '',
    customerPhone: '',
    customerEmail: '',
    device: '',
    issue: '',
    priority: 'medium',
    estimatedCost: '',
    depositPaid: '',
    dueDate: '',
    assignedTo: '',
    notes: '',
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.device.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-slate-500';
      case 'medium':
        return 'bg-blue-500';
      case 'high':
        return 'bg-orange-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateTicket = () => {
    const ticketNumber = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicketData: Ticket = {
      id: String(tickets.length + 1),
      ticketNumber,
      customer: newTicket.customer,
      customerPhone: newTicket.customerPhone,
      customerEmail: newTicket.customerEmail,
      device: newTicket.device,
      issue: newTicket.issue,
      status: 'pending',
      priority: newTicket.priority as 'low' | 'medium' | 'high' | 'urgent',
      estimatedCost: parseFloat(newTicket.estimatedCost) || 0,
      depositPaid: parseFloat(newTicket.depositPaid) || 0,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: newTicket.dueDate,
      assignedTo: newTicket.assignedTo,
      notes: newTicket.notes,
    };

    setTickets([newTicketData, ...tickets]);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewTicket({
      customer: '',
      customerPhone: '',
      customerEmail: '',
      device: '',
      issue: '',
      priority: 'medium',
      estimatedCost: '',
      depositPaid: '',
      dueDate: '',
      assignedTo: '',
      notes: '',
    });
  };

  const handlePrintTicket = (ticket: Ticket) => {
    // Create a print-friendly view
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket ${ticket.ticketNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .ticket-info { margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .label { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #2563eb; color: white; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>RepairPOS</h1>
              <h2>Repair Ticket</h2>
            </div>
            <div class="ticket-info">
              <p><span class="label">Ticket #:</span> ${ticket.ticketNumber}</p>
              <p><span class="label">Date:</span> ${ticket.createdDate}</p>
              <p><span class="label">Due Date:</span> ${ticket.dueDate}</p>
            </div>
            <div class="section">
              <h3>Customer Information</h3>
              <p><span class="label">Name:</span> ${ticket.customer}</p>
              <p><span class="label">Phone:</span> ${ticket.customerPhone}</p>
              <p><span class="label">Email:</span> ${ticket.customerEmail}</p>
            </div>
            <div class="section">
              <h3>Device Information</h3>
              <p><span class="label">Device:</span> ${ticket.device}</p>
              <p><span class="label">Issue:</span> ${ticket.issue}</p>
            </div>
            <div class="section">
              <h3>Service Details</h3>
              <p><span class="label">Status:</span> ${ticket.status.toUpperCase()}</p>
              <p><span class="label">Priority:</span> ${ticket.priority.toUpperCase()}</p>
              <p><span class="label">Assigned To:</span> ${ticket.assignedTo}</p>
            </div>
            <div class="section">
              <h3>Payment Information</h3>
              <p><span class="label">Estimated Cost:</span> $${ticket.estimatedCost}</p>
              <p><span class="label">Deposit Paid:</span> $${ticket.depositPaid}</p>
              <p><span class="label">Balance Due:</span> $${ticket.estimatedCost - ticket.depositPaid}</p>
            </div>
            <div class="section">
              <h3>Notes</h3>
              <p>${ticket.notes || 'No additional notes'}</p>
            </div>
            <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
              <p>Customer Signature: _______________________</p>
              <p>Date: _______________________</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    completed: tickets.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Ticket Management</h1>
          <p className="text-slate-600">Create and manage repair tickets</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Repair Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name *</Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter customer name"
                      value={newTicket.customer}
                      onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone Number *</Label>
                    <Input
                      id="customer-phone"
                      placeholder="+1 234-567-8900"
                      value={newTicket.customerPhone}
                      onChange={(e) => setNewTicket({ ...newTicket, customerPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email Address</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="customer@email.com"
                    value={newTicket.customerEmail}
                    onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                  />
                </div>
              </div>

              {/* Device Information */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Device Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="device">Device Model *</Label>
                  <Input
                    id="device"
                    placeholder="e.g., iPhone 13 Pro, Samsung Galaxy S21"
                    value={newTicket.device}
                    onChange={(e) => setNewTicket({ ...newTicket, device: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue Description *</Label>
                  <Textarea
                    id="issue"
                    placeholder="Describe the issue with the device"
                    value={newTicket.issue}
                    onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level *</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned-to">Assigned To</Label>
                    <Select
                      value={newTicket.assignedTo}
                      onValueChange={(value) => setNewTicket({ ...newTicket, assignedTo: value })}
                    >
                      <SelectTrigger id="assigned-to">
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech A">Tech A</SelectItem>
                        <SelectItem value="Tech B">Tech B</SelectItem>
                        <SelectItem value="Tech C">Tech C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newTicket.dueDate}
                    onChange={(e) => setNewTicket({ ...newTicket, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-slate-900">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                    <Input
                      id="estimated-cost"
                      type="number"
                      placeholder="0.00"
                      value={newTicket.estimatedCost}
                      onChange={(e) => setNewTicket({ ...newTicket, estimatedCost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deposit-paid">Deposit Paid ($)</Label>
                    <Input
                      id="deposit-paid"
                      type="number"
                      placeholder="0.00"
                      value={newTicket.depositPaid}
                      onChange={(e) => setNewTicket({ ...newTicket, depositPaid: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information"
                  value={newTicket.notes}
                  onChange={(e) => setNewTicket({ ...newTicket, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateTicket}
                >
                  Create Ticket
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Tickets</p>
                <h3 className="text-slate-900">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-slate-600">Pending</p>
                <h3 className="text-slate-900">{stats.pending}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600">In Progress</p>
                <h3 className="text-slate-900">{stats.inProgress}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-slate-600">Completed</p>
                <h3 className="text-slate-900">{stats.completed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>All Tickets</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">Active</TabsTrigger>
                  <TabsTrigger value="completed">Done</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="text-slate-900">{ticket.ticketNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-slate-900">{ticket.customer}</p>
                        <p className="text-slate-500">{ticket.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-900">{ticket.device}</TableCell>
                    <TableCell className="max-w-xs truncate text-slate-600">{ticket.issue}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{ticket.dueDate}</TableCell>
                    <TableCell className="text-slate-900">${ticket.estimatedCost}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => handlePrintTicket(ticket)}
                        >
                          <Printer className="w-4 h-4" />
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

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details - {selectedTicket?.ticketNumber}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex gap-3">
                <Badge className={`${getStatusColor(selectedTicket.status)} text-white`}>
                  {selectedTicket.status}
                </Badge>
                <Badge className={`${getPriorityColor(selectedTicket.priority)} text-white`}>
                  {selectedTicket.priority} priority
                </Badge>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p className="text-slate-900">{selectedTicket.customer}</p>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedTicket.customerPhone}
                  </p>
                  <p className="text-slate-600">{selectedTicket.customerEmail}</p>
                </div>
              </div>

              {/* Device Information */}
              <div className="space-y-3">
                <h3 className="text-slate-900">Device Information</h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p><span className="text-slate-600">Device:</span> <span className="text-slate-900">{selectedTicket.device}</span></p>
                  <p><span className="text-slate-600">Issue:</span> <span className="text-slate-900">{selectedTicket.issue}</span></p>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Service Details
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p><span className="text-slate-600">Created:</span> <span className="text-slate-900">{selectedTicket.createdDate}</span></p>
                  <p><span className="text-slate-600">Due Date:</span> <span className="text-slate-900">{selectedTicket.dueDate}</span></p>
                  <p><span className="text-slate-600">Assigned To:</span> <span className="text-slate-900">{selectedTicket.assignedTo}</span></p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p><span className="text-slate-600">Estimated Cost:</span> <span className="text-slate-900">${selectedTicket.estimatedCost}</span></p>
                  <p><span className="text-slate-600">Deposit Paid:</span> <span className="text-slate-900">${selectedTicket.depositPaid}</span></p>
                  <p><span className="text-slate-600">Balance Due:</span> <span className="text-slate-900">${selectedTicket.estimatedCost - selectedTicket.depositPaid}</span></p>
                </div>
              </div>

              {/* Notes */}
              {selectedTicket.notes && (
                <div className="space-y-3">
                  <h3 className="text-slate-900">Notes</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700">{selectedTicket.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePrintTicket(selectedTicket)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Ticket
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
