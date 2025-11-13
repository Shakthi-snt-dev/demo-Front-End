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
import { Search, Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';

const inventoryData = [
  { id: 1, sku: 'IP13-SCR', name: 'iPhone 13 Screen', category: 'Screens', stock: 45, minStock: 20, price: 100, cost: 60 },
  { id: 2, sku: 'SAM-BAT', name: 'Samsung Battery', category: 'Batteries', stock: 67, minStock: 30, price: 50, cost: 25 },
  { id: 3, sku: 'IPD-GLS', name: 'iPad Glass', category: 'Screens', stock: 23, minStock: 15, price: 100, cost: 55 },
  { id: 4, sku: 'MBK-KEY', name: 'MacBook Keyboard', category: 'Parts', stock: 15, minStock: 10, price: 100, cost: 70 },
  { id: 5, sku: 'PHN-CSE', name: 'Phone Case', category: 'Accessories', stock: 156, minStock: 50, price: 20, cost: 8 },
  { id: 6, sku: 'USB-CBL', name: 'USB-C Cable', category: 'Accessories', stock: 234, minStock: 100, price: 15, cost: 5 },
  { id: 7, sku: 'SCR-PRT', name: 'Screen Protector', category: 'Accessories', stock: 8, minStock: 50, price: 10, cost: 3 },
  { id: 8, sku: 'CHG-PRT', name: 'Charging Port', category: 'Parts', stock: 78, minStock: 25, price: 35, cost: 18 },
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(inventoryData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);
  const totalProducts = inventory.reduce((sum, item) => sum + item.stock, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Inventory Management</h1>
          <p className="text-slate-600">Manage your products and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" placeholder="Enter product name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="ABC-123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Category" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-stock">Min Stock</Label>
                  <Input id="min-stock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(false)}>
                  Add Product
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
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600">Total Products</p>
                <h3 className="text-slate-900">{totalProducts}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-slate-600">Inventory Value</p>
                <h3 className="text-slate-900">${totalValue.toFixed(2)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-slate-600">Low Stock Items</p>
                <h3 className="text-slate-900">{lowStockItems.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-1">Low Stock Alert</h3>
                <p className="text-red-700">
                  {lowStockItems.length} products are running low on stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Products</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search products..."
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
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-slate-900">{item.sku}</TableCell>
                    <TableCell className="text-slate-900">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span className={item.stock <= item.minStock ? 'text-red-600' : ''}>
                        {item.stock}
                      </span>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>${item.cost}</TableCell>
                    <TableCell>
                      <Badge variant={item.stock > item.minStock ? 'default' : 'destructive'}>
                        {item.stock > item.minStock ? 'In Stock' : 'Low Stock'}
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
