import { useState } from 'react'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
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

interface Product {
  id: string
  name: string
  price: number
  stock: number
  tax?: number
}

interface CartItem extends Product {
  quantity: number
}

interface ServiceCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

const mockProducts: Product[] = [
  { id: '1', name: 'iPhone 14 Pro Screen', price: 149.99, stock: 15, tax: 12.0 },
  { id: '2', name: 'Samsung Galaxy Battery', price: 49.99, stock: 32, tax: 4.0 },
  { id: '3', name: 'USB-C Cable', price: 12.99, stock: 87, tax: 1.04 },
  { id: '4', name: 'Wireless Charger', price: 24.99, stock: 45, tax: 2.0 },
  { id: '5', name: 'Phone Case', price: 19.99, stock: 120, tax: 1.6 },
  { id: '6', name: 'Screen Protector', price: 9.99, stock: 200, tax: 0.8 },
]

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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const { toast } = useToast()

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
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
      setCart([...cart, { ...product, quantity: 1 }])
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

  const handlePayment = (method: string) => {
    toast({
      title: 'Payment successful',
      description: `Payment of $${total.toFixed(2)} processed via ${method}`,
    })
    setCart([])
    setSelectedCustomer(null)
    setShowPaymentDialog(false)
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
                      {selectedCustomer || 'Walkin Customer'}
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
                        <DialogTitle>Add Customer</DialogTitle>
                        <DialogDescription>Add a new customer to the system</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Customer Name</Label>
                          <Input placeholder="Enter customer name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" placeholder="Enter email" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input type="tel" placeholder="Enter phone number" />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedCustomer('New Customer')
                            setShowCustomerDialog(false)
                          }}
                        >
                          Add Customer
                        </Button>
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
              disabled={cart.length === 0}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Checkout
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
