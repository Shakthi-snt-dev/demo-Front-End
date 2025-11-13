import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Store,
  User,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Save,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { Integrations } from './Integrations';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  isDefault: boolean;
}

const storesData: StoreLocation[] = [
  {
    id: '1',
    name: 'Main Store',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '+1 234-567-8900',
    email: 'main@repairpos.com',
    status: 'active',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Downtown Store',
    address: '456 Downtown Ave',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    phone: '+1 234-567-8901',
    email: 'downtown@repairpos.com',
    status: 'active',
    isDefault: false,
  },
  {
    id: '3',
    name: 'Mall Store',
    address: '789 Shopping Mall Blvd',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11201',
    phone: '+1 234-567-8902',
    email: 'mall@repairpos.com',
    status: 'active',
    isDefault: false,
  },
];

export function Settings() {
  const [stores, setStores] = useState<StoreLocation[]>(storesData);
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+1 234-567-8900" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>Configure regional preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="est">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                    <SelectItem value="cst">Central Time (CST)</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="cad">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mm-dd-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-Store Settings */}
        <TabsContent value="stores" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-slate-900 mb-1">Store Locations</h2>
              <p className="text-slate-600">Manage multiple store locations</p>
            </div>
            <Dialog open={isAddStoreDialogOpen} onOpenChange={setIsAddStoreDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Store Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name *</Label>
                    <Input id="store-name" placeholder="Enter store name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-address">Street Address *</Label>
                    <Input id="store-address" placeholder="123 Main Street" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-city">City *</Label>
                      <Input id="store-city" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-state">State *</Label>
                      <Input id="store-state" placeholder="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-zip">ZIP Code *</Label>
                      <Input id="store-zip" placeholder="10001" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Phone Number</Label>
                      <Input id="store-phone" placeholder="+1 234-567-8900" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Email Address</Label>
                      <Input id="store-email" type="email" placeholder="store@email.com" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddStoreDialogOpen(false)}>
                      Add Store
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddStoreDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stores.map((store) => (
              <Card key={store.id} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Store className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{store.name}</CardTitle>
                          {store.isDefault && (
                            <Badge className="bg-blue-600">Default</Badge>
                          )}
                        </div>
                        <Badge variant={store.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                          {store.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p>{store.address}</p>
                      <p>{store.city}, {store.state} {store.zip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{store.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Settings */}
        <TabsContent value="inventory" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Inventory Management Settings</CardTitle>
                  <CardDescription>Configure inventory tracking and alerts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Enable Inventory Tracking</p>
                  <p className="text-slate-600">Track stock levels for all products</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Serialized Inventory</p>
                  <p className="text-slate-600">Track items by unique serial numbers</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Low Stock Alerts</p>
                  <p className="text-slate-600">Get notified when stock is running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="default-low-stock">Default Low Stock Threshold</Label>
                <Input id="default-low-stock" type="number" defaultValue="20" />
                <p className="text-slate-500">Alert when stock falls below this number</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Auto-Deduct Stock on Sale</p>
                  <p className="text-slate-600">Automatically reduce inventory on checkout</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Allow Negative Stock</p>
                  <p className="text-slate-600">Permit sales even when stock is zero</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Enable Purchase Orders & GRNs</p>
                  <p className="text-slate-600">Create POs and Goods Received Notes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="stock-display">Stock Display Format</Label>
                <Select defaultValue="quantity">
                  <SelectTrigger id="stock-display">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantity">Show Exact Quantity</SelectItem>
                    <SelectItem value="status">Show In Stock / Out of Stock</SelectItem>
                    <SelectItem value="both">Show Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory-count-frequency">Inventory Count Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="inventory-count-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auto-reorder">Auto-Create PO When Below Threshold</Label>
                  <Select defaultValue="off">
                    <SelectTrigger id="auto-reorder">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="per-variant">Per Variant</SelectItem>
                      <SelectItem value="per-sku">Per SKU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Stock Transfer Settings</CardTitle>
                  <CardDescription>Configure inter-store stock transfers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Enable Stock Transfers</p>
                  <p className="text-slate-600">Allow inventory movement between stores</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Require Transfer Approval</p>
                  <p className="text-slate-600">Transfers need manager authorization</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="transfer-reason">Require Transfer Reason</Label>
                <Switch defaultChecked />
                <p className="text-slate-500">Users must provide reason for transfers</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Reorder & Vendor Settings</CardTitle>
                  <CardDescription>Automate reordering and vendor preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Default Vendor for Auto-PO</p>
                  <p className="text-slate-600">Select the vendor used for automated POs</p>
                </div>
                <Select defaultValue="none">
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="preferred-1">Preferred Vendor 1</SelectItem>
                    <SelectItem value="preferred-2">Preferred Vendor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorder-multiplier">Reorder Multiplier</Label>
                  <Input id="reorder-multiplier" type="number" defaultValue="1.0" />
                  <p className="text-slate-500">Multiply reorder qty by this factor</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-time-days">Default Lead Time (days)</Label>
                  <Input id="lead-time-days" type="number" defaultValue="7" />
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Email Notifications</p>
                  <p className="text-slate-600">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">SMS Notifications</p>
                  <p className="text-slate-600">Receive notifications via text message</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Low Stock Alerts</p>
                  <p className="text-slate-600">Get notified when products are low in stock</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">New Order Notifications</p>
                  <p className="text-slate-600">Get notified about new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Ticket Updates</p>
                  <p className="text-slate-600">Notifications for ticket status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Daily Sales Report</p>
                  <p className="text-slate-600">Receive daily sales summary</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Marketing Updates</p>
                  <p className="text-slate-600">Receive tips and product updates</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Google Reviews Automation</p>
                  <p className="text-slate-600">Automatically request reviews after job completion</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="review-delay-hours">Review Request Delay (hours)</Label>
                  <Input id="review-delay-hours" type="number" defaultValue="24" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="digest-time">Daily Digest Time (HH:MM)</Label>
                  <Input id="digest-time" type="time" defaultValue="18:00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-sender-id">Customer SMS Sender ID</Label>
                <Input id="sms-sender-id" placeholder="e.g. REPAIRSHOP" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Two-Factor Authentication</p>
                  <p className="text-slate-600">Protect your account with 2FA</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Session Management</CardTitle>
                  <CardDescription>Manage your active sessions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-slate-900">Current Session</p>
                    <p className="text-slate-600">Chrome on Windows</p>
                    <p className="text-slate-500">Last active: Just now</p>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Configure payment options for your store</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Accept Cash Payments</p>
                  <p className="text-slate-600">Enable cash payment option</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Accept Card Payments</p>
                  <p className="text-slate-600">Enable credit/debit card payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Accept Digital Wallets</p>
                  <p className="text-slate-600">Apple Pay, Google Pay, etc.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Enable RD Payment Widget</p>
                  <p className="text-slate-600">Use embedded widget for secure online payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="default-provider">Default Payment Provider</Label>
                <Select defaultValue="rd">
                  <SelectTrigger id="default-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rd">RepairDesk Payments</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="10" />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surcharge-rate">Card Surcharge (%)</Label>
                  <Input id="surcharge-rate" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tips-enabled">Enable Tips at Checkout</Label>
                  <Select defaultValue="on">
                    <SelectTrigger id="tips-enabled">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tip1">Tip Option 1 (%)</Label>
                  <Input id="tip1" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tip2">Tip Option 2 (%)</Label>
                  <Input id="tip2" type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tip3">Tip Option 3 (%)</Label>
                  <Input id="tip3" type="number" defaultValue="20" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Allow Partial Payments</p>
                  <p className="text-slate-600">Collect deposits and pay remaining later</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="receipt-footer">Receipt Footer Message</Label>
                <Textarea
                  id="receipt-footer"
                  placeholder="Thank you for your business!"
                  defaultValue="Thank you for choosing RepairPOS!"
                  rows={3}
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced system options</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Auto Backup</p>
                  <p className="text-slate-600">Automatically backup data daily</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Debug Mode</p>
                  <p className="text-slate-600">Enable detailed error logging</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" defaultValue="sk_live_xxxxxxxxxxxxx" readOnly />
                <p className="text-slate-500">Your API key for integrations</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-domain.com/webhook" />
                <p className="text-slate-500">Receive real-time updates via webhook</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Integrations & Communication</CardTitle>
                  <CardDescription>Configure channels and connected apps</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">RepairDesk Connect</p>
                  <p className="text-slate-600">Unified inbox for SMS, email, website, and social</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">PhonePro</p>
                  <p className="text-slate-600">Integrated phone system with IVR and call logging</p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ivr-greeting">IVR Greeting</Label>
                  <Input id="ivr-greeting" placeholder="Welcome to our repair shop..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-number">Business Number</Label>
                  <Input id="business-number" placeholder="+1 000-000-0000" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-slate-900">Customer Facing Display</p>
                  <p className="text-slate-600">Enable secondary display for checkout</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="google-reviews-api-key">Google Reviews API Key</Label>
                <Input id="google-reviews-api-key" placeholder="AIza..." />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="export-schedule">Data Export Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger id="export-schedule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Integrations
              </Button>
            </CardContent>
          </Card>

          {/* QuickBooks and Shopify Integrations */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Third-Party Integrations</h3>
              <p className="text-slate-600 text-sm">Connect with QuickBooks and Shopify to sync your data</p>
            </div>
            <Integrations />
          </div>

          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
              <CardDescription className="text-red-700">Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-900">Export All Data</p>
                  <p className="text-red-700">Download all your business data</p>
                </div>
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-900">Delete Account</p>
                  <p className="text-red-700">Permanently delete your account and data</p>
                </div>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
