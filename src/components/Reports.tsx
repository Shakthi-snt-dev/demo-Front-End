import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

const salesByMonth = [
  { month: 'Jan', revenue: 12000, orders: 145, profit: 4800 },
  { month: 'Feb', revenue: 15000, orders: 182, profit: 6000 },
  { month: 'Mar', revenue: 18000, orders: 215, profit: 7200 },
  { month: 'Apr', revenue: 16000, orders: 198, profit: 6400 },
  { month: 'May', revenue: 22000, orders: 268, profit: 8800 },
  { month: 'Jun', revenue: 25000, orders: 305, profit: 10000 },
];

const categoryData = [
  { name: 'Screens', value: 35, color: '#2563eb' },
  { name: 'Batteries', value: 25, color: '#3b82f6' },
  { name: 'Parts', value: 20, color: '#60a5fa' },
  { name: 'Accessories', value: 20, color: '#93c5fd' },
];

const topCustomers = [
  { name: 'Diana Martinez', orders: 42, spent: 5600 },
  { name: 'Bob Johnson', orders: 35, spent: 4200 },
  { name: 'John Doe', orders: 24, spent: 2850 },
  { name: 'Jane Smith', orders: 18, spent: 1920 },
  { name: 'Alice Brown', orders: 12, spent: 1450 },
];

const productPerformance = [
  { product: 'iPhone 13 Screen', sold: 145, revenue: 14500 },
  { product: 'Samsung Battery', sold: 132, revenue: 6600 },
  { product: 'iPad Glass', sold: 98, revenue: 9800 },
  { product: 'MacBook Keyboard', sold: 76, revenue: 7600 },
  { product: 'Phone Cases', sold: 234, revenue: 4680 },
];

export function Reports() {
  const [period, setPeriod] = useState('6months');

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Revenue</p>
                <h3 className="text-slate-900">$108,000</h3>
                <p className="text-green-600">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Profit</p>
                <h3 className="text-slate-900">$43,200</h3>
                <p className="text-green-600">+15.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Orders</p>
                <h3 className="text-slate-900">1,313</h3>
                <p className="text-green-600">+8.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-slate-600">Avg Order Value</p>
                <h3 className="text-slate-900">$82.25</h3>
                <p className="text-green-600">+3.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue ($)" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Orders by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#2563eb" radius={[8, 8, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformance.map((product, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-900">{product.product}</span>
                        <span className="text-slate-600">${product.revenue}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(product.sold / 250) * 100}%` }}
                        />
                      </div>
                      <p className="text-slate-500">{product.sold} units sold</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-slate-900">{customer.name}</p>
                        <p className="text-slate-600">{customer.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-900">${customer.spent}</p>
                      <p className="text-slate-600">Total spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
