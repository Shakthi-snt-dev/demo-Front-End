import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { Button } from './ui/button';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const statsData = [
  { label: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up', icon: DollarSign, color: 'blue' },
  { label: 'Total Orders', value: '2,345', change: '+15.3%', trend: 'up', icon: ShoppingCart, color: 'green' },
  { label: 'Products', value: '1,234', change: '-2.4%', trend: 'down', icon: Package, color: 'purple' },
  { label: 'Customers', value: '892', change: '+12.5%', trend: 'up', icon: Users, color: 'orange' },
];

const salesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 5000, orders: 32 },
  { name: 'Thu', sales: 4500, orders: 28 },
  { name: 'Fri', sales: 6000, orders: 38 },
  { name: 'Sat', sales: 7500, orders: 45 },
  { name: 'Sun', sales: 5500, orders: 35 },
];

const topProducts = [
  { name: 'iPhone 13 Screen', sold: 145, revenue: '$14,500' },
  { name: 'Samsung Battery', sold: 132, revenue: '$6,600' },
  { name: 'iPad Glass', sold: 98, revenue: '$9,800' },
  { name: 'MacBook Keyboard', sold: 76, revenue: '$7,600' },
  { name: 'Phone Cases', sold: 234, revenue: '$4,680' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', amount: '$234', status: 'completed', time: '10 min ago' },
  { id: '#ORD-002', customer: 'Jane Smith', amount: '$589', status: 'pending', time: '25 min ago' },
  { id: '#ORD-003', customer: 'Bob Johnson', amount: '$125', status: 'completed', time: '1 hour ago' },
  { id: '#ORD-004', customer: 'Alice Brown', amount: '$899', status: 'processing', time: '2 hours ago' },
];

export function Dashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={stat.label} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className={`flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </span>
                </div>
                <h3 className="text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Weekly Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2563eb" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Orders by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-900">{product.name}</p>
                      <p className="text-slate-500">{product.sold} sold</p>
                    </div>
                  </div>
                  <span className="text-slate-900">{product.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900">{order.id}</span>
                      <span className={`px-2 py-1 rounded text-white ${
                        order.status === 'completed' ? 'bg-green-500' :
                        order.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{order.customer}</p>
                    <p className="text-slate-400">{order.time}</p>
                  </div>
                  <span className="text-slate-900">{order.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
