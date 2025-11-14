import { useState } from 'react'
import { Plus, Search, Eye, Edit } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

const statusColors = {
  New: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Awaiting Parts': 'bg-orange-100 text-orange-800',
  Completed: 'bg-green-100 text-green-800',
  Delivered: 'bg-gray-100 text-gray-800',
}

const mockTickets = [
  { id: '1', customer: 'John Doe', device: 'iPhone 14 Pro', issue: 'Screen replacement', status: 'In Progress', created: '2024-01-15' },
  { id: '2', customer: 'Jane Smith', device: 'Samsung Galaxy S23', issue: 'Battery replacement', status: 'Awaiting Parts', created: '2024-01-14' },
  { id: '3', customer: 'Bob Johnson', device: 'iPad Pro', issue: 'Charging port repair', status: 'Completed', created: '2024-01-13' },
]

export default function RepairsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Repair Tickets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage repair jobs and track progress</p>
        </div>
        <Button onClick={() => navigate('/repairs/new')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTickets
              .filter((ticket) =>
                ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.device.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>{ticket.device}</TableCell>
                  <TableCell>{ticket.issue}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/repairs/${ticket.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
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

