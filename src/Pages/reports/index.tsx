import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const salesData = [
  { name: 'Jan', sales: 4000, repairs: 2400 },
  { name: 'Feb', sales: 3000, repairs: 1398 },
  { name: 'Mar', sales: 2000, repairs: 9800 },
  { name: 'Apr', sales: 2780, repairs: 3908 },
  { name: 'May', sales: 1890, repairs: 4800 },
  { name: 'Jun', sales: 2390, repairs: 3800 },
]

const commissionData = [
  { name: 'John Doe', commission: 450, sales: 12 },
  { name: 'Jane Smith', commission: 320, sales: 8 },
  { name: 'Bob Johnson', commission: 280, sales: 6 },
]

const inventoryData = [
  { name: 'Screens', value: 35 },
  { name: 'Batteries', value: 25 },
  { name: 'Cables', value: 20 },
  { name: 'Cases', value: 20 },
]

const COLORS = ['#4f66f1', '#818cf8', '#a5b4fc', '#c7d2fe']

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Analytics and insights for your business</p>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="repairs">Repair Performance</TabsTrigger>
          <TabsTrigger value="commission">Employee Commission</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Summary</TabsTrigger>
          <TabsTrigger value="tax">Tax Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales and repair revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#4f66f1" />
                  <Line type="monotone" dataKey="repairs" stroke="#818cf8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repair Performance</CardTitle>
              <CardDescription>Repair completion rates and turnaround time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="repairs" fill="#4f66f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Commission</CardTitle>
              <CardDescription>Commission earned by employees</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commissionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commission" fill="#4f66f1" />
                  <Bar dataKey="sales" fill="#818cf8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
              <CardDescription>Inventory distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Report</CardTitle>
              <CardDescription>Tax collected and breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Sales</span>
                  <span className="font-semibold">$24,567.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Collected (8%)</span>
                  <span className="font-semibold">$1,965.36</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Total Revenue</span>
                  <span className="font-semibold text-lg">$26,532.36</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

