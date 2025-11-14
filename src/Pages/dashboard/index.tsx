import { DollarSign, Wrench, FileText, Users, TrendingUp, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  {
    name: 'Total Sales',
    value: '$24,567',
    change: '+12.5%',
    icon: DollarSign,
    trend: 'up',
  },
  {
    name: 'Repairs Done',
    value: '142',
    change: '+8.2%',
    icon: Wrench,
    trend: 'up',
  },
  {
    name: 'Pending Invoices',
    value: '23',
    change: '-5.1%',
    icon: FileText,
    trend: 'down',
  },
  {
    name: 'Employees',
    value: '12',
    change: '+2',
    icon: Users,
    trend: 'up',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your business performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and repairs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {i === 1 && 'iPhone 14 Pro repair completed'}
                      {i === 2 && 'New sale: $450'}
                      {i === 3 && 'Samsung Galaxy screen replacement'}
                      {i === 4 && 'Inventory restocked: 25 items'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 && '2 hours ago'}
                      {i === 2 && '5 hours ago'}
                      {i === 3 && '1 day ago'}
                      {i === 4 && '2 days ago'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm">
              Create Repair Ticket
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm">
              New Sale
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm">
              Add Customer
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm">
              View Reports
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

