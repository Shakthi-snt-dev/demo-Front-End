import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ChevronRight,
  Smartphone,
  Tablet,
  Laptop,
  Building,
  Ticket,
  FileText,
  Calculator,
  Shield,
  MoreHorizontal,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchInventory } from '@/features/inventory/inventorySlice'
import { createSale, fetchSales } from '@/features/pos/posSlice'
import { fetchCustomers, createCustomer } from '@/features/customers/customersSlice'
import { useToastFromState } from '@/hooks/useApiToast'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  tax?: number
}

interface ServiceCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

const serviceCategories: ServiceCategory[] = [
  { id: '1', name: 'Mobile Repair', icon: Smartphone, color: 'bg-orange-500' },
  { id: '2', name: 'Tablet Repair', icon: Tablet, color: 'bg-pink-500' },
  { id: '3', name: 'Macbook Repair', icon: Laptop, color: 'bg-blue-500' },
  { id: '4', name: 'Onsite/Remote Assistance', icon: Building, color: 'bg-purple-500' },
]

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const inventoryState = useAppSelector((state) => state.inventory)
  const posState = useAppSelector((state) => state.pos)
  const customersState = useAppSelector((state) => state.customers)

  // Auto-show toast notifications
  useToastFromState(posState, {
    successTitle: 'POS',
    errorTitle: 'POS Error',
  })

  // Fetch inventory on mount
  useEffect(() => {
    dispatch(fetchInventory({ page: 1, limit: 100 }))
    dispatch(fetchCustomers({ page: 1, limit: 100 }))
  }, [dispatch])

  const products = inventoryState.items || []
  const customers = customersState.customers || []

  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    const availableStock = product.quantity || 0
    
    if (existingItem) {
      if (existingItem.quantity < availableStock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        )
      } else {
        toast({
          title: 'Out of stock',
          description: 'Not enough stock available',
          variant: 'destructive',
        })
      }
    } else {
      if (availableStock > 0) {
        setCart([...cart, { 
          id: product.id,
          name: product.name,
          price: product.price || 0,
          quantity: 1,
          tax: (product.price || 0) * 0.08, // 8% tax
        }])
      } else {
        toast({
          title: 'Out of stock',
          description: 'This item is out of stock',
          variant: 'destructive',
        })
      }
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = cart.reduce((sum, item) => sum + (item.tax || 0) * item.quantity, 0)
  const discount = 0
  const total = subtotal + tax - discount

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items to cart before checkout',
        variant: 'destructive',
      })
      return
    }
    setShowPaymentDialog(true)
  }

  const handlePayment = async (method: string) => {
    try {
      const saleData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        paymentMethod: method,
        customerId: selectedCustomerId || undefined,
      }

      const result = await dispatch(createSale(saleData))
      
      if (createSale.fulfilled.match(result)) {
        toast({
          title: 'Payment successful',
          description: result.payload.message || `Payment of $${total.toFixed(2)} processed via ${method}`,
        })
        setCart([])
        setSelectedCustomer(null)
        setSelectedCustomerId(null)
        setShowPaymentDialog(false)
        // Refresh sales list
        dispatch(fetchSales({ page: 1, limit: 10 }))
      } else if (createSale.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Payment failed'
        toast({
          title: 'Payment failed',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive',
      })
    }
  }

  const handleCreateCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast({
        title: 'Error',
        description: 'Customer name is required',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await dispatch(createCustomer({
        name: newCustomerName,
        email: newCustomerEmail || undefined,
        phone: newCustomerPhone || undefined,
      }))

      if (createCustomer.fulfilled.match(result)) {
        toast({
          title: 'Success',
          description: result.payload.message || 'Customer created successfully',
        })
        setSelectedCustomer(newCustomerName)
        setSelectedCustomerId(result.payload.customer.id)
        setShowCustomerDialog(false)
        setNewCustomerName('')
        setNewCustomerEmail('')
        setNewCustomerPhone('')
        dispatch(fetchCustomers({ page: 1, limit: 100 }))
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create customer',
        variant: 'destructive',
      })
    }
  }

  const handleItemInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const product = filteredProducts[0]
      if (product) {
        addToCart(product)
        setSearchQuery('')
      }
    }
  }

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer.name)
    setSelectedCustomerId(customer.id)
    setShowCustomerDialog(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Process sales and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel - POS/Customer Interaction */}
        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-500 text-white">
                      {selectedCustomer ? selectedCustomer[0] : 'W'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedCustomer || 'Walk-in Customer'}
                    </p>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCustomerDialog(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="bg-primary-500 hover:bg-primary-600">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select or Add Customer</DialogTitle>
                        <DialogDescription>Choose an existing customer or add a new one</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
                        {/* Existing Customers List */}
                        {customers.length > 0 && (
                          <div className="space-y-2">
                            <Label>Existing Customers</Label>
                            <div className="space-y-1">
                              {customers.map((customer: any) => (
                                <Button
                                  key={customer.id}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleSelectCustomer(customer)}
                                >
                                  {customer.name} {customer.email && `(${customer.email})`}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Add New Customer */}
                        <div className="space-y-2 border-t pt-4">
                          <Label>Add New Customer</Label>
                          <div className="space-y-2">
                            <Input
                              placeholder="Customer Name *"
                              value={newCustomerName}
                              onChange={(e) => setNewCustomerName(e.target.value)}
                            />
                            <Input
                              type="email"
                              placeholder="Email"
                              value={newCustomerEmail}
                              onChange={(e) => setNewCustomerEmail(e.target.value)}
                            />
                            <Input
                              type="tel"
                              placeholder="Phone"
                              value={newCustomerPhone}
                              onChange={(e) => setNewCustomerPhone(e.target.value)}
                            />
                            <Button
                              className="w-full"
                              onClick={handleCreateCustomer}
                              disabled={customersState.isLoading || !newCustomerName.trim()}
                            >
                              {customersState.isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                'Add Customer'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Item Entry */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter item name, SKU or scan barcode"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleItemInput}
                  className="pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Ctrl S
                </span>
              </div>
              <Button variant="outline" className="bg-primary-500 hover:bg-primary-600 text-white">
                Advance Search
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Item List Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">QTY</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No items added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ${((item.tax || 0) * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${((item.price + (item.tax || 0)) * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary Totals */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub Total:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium">${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-primary-500">${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Service Categories */}
        <div className="space-y-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Category</span>
            <ChevronRight className="h-4 w-4" />
            <span>Manufacturer</span>
            <ChevronRight className="h-4 w-4" />
            <span>Devices</span>
            <ChevronRight className="h-4 w-4" />
            <span>Problems</span>
            <ChevronRight className="h-4 w-4" />
            <span>Parts</span>
            <ChevronRight className="h-4 w-4" />
            <span>Details</span>
          </div>

          {/* Service Categories Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-primary-500/50">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6 text-primary-500" />
                </div>
                <p className="text-sm font-medium text-center">Add Category</p>
              </CardContent>
            </Card>

            {serviceCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-full flex items-center justify-center mb-2',
                        category.color
                      )}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-center">{category.name}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start">
              <Ticket className="mr-2 h-4 w-4" />
              View Tickets
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              View Invoices
            </Button>
            <Button variant="outline" className="justify-start">
              <Calculator className="mr-2 h-4 w-4" />
              Create Estimate
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600 text-white justify-start">
              <Ticket className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Warranty Claim
            </Button>
            <Button variant="outline" className="justify-start">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              More Actions
            </Button>
            <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              className="bg-primary-500 hover:bg-primary-600 text-white justify-start"
              onClick={handleCheckout}
              disabled={cart.length === 0 || posState.isLoading}
            >
              {posState.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Total: ${total.toFixed(2)}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={() => handlePayment('Cash')} variant="outline">
              Cash
            </Button>
            <Button onClick={() => handlePayment('Card')} variant="outline">
              Card
            </Button>
            <Button onClick={() => handlePayment('Digital Wallet')} variant="outline">
              Digital Wallet
            </Button>
            <Button onClick={() => handlePayment('Store Credit')} variant="outline">
              Store Credit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
