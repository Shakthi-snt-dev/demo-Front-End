import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  DollarSign,
  User,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const products = [
  { id: 1, name: 'iPhone 13 Screen', price: 100, category: 'Screens', stock: 45 },
  { id: 2, name: 'Samsung Battery', price: 50, category: 'Batteries', stock: 67 },
  { id: 3, name: 'iPad Glass', price: 100, category: 'Screens', stock: 23 },
  { id: 4, name: 'MacBook Keyboard', price: 100, category: 'Parts', stock: 15 },
  { id: 5, name: 'Phone Case', price: 20, category: 'Accessories', stock: 156 },
  { id: 6, name: 'USB-C Cable', price: 15, category: 'Accessories', stock: 234 },
  { id: 7, name: 'Screen Protector', price: 10, category: 'Accessories', stock: 189 },
  { id: 8, name: 'Charging Port', price: 35, category: 'Parts', stock: 78 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export function POSCheckout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);

  const categories = ['All', 'Screens', 'Batteries', 'Parts', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const completePayment = () => {
    setCart([]);
    setShowPayment(false);
    alert('Payment completed successfully!');
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-50">
      {/* Products Section */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">POS Checkout</h1>
          <p className="text-slate-600">Scan or select products to add to cart</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="w-full h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-slate-400">Product Image</span>
                </div>
                <h3 className="text-slate-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600">${product.price}</span>
                  <Badge variant={product.stock > 20 ? 'default' : 'destructive'}>
                    Stock: {product.stock}
                  </Badge>
                </div>
                <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 bg-white border-l flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-slate-900">Current Order</h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-slate-900">{item.name}</p>
                  <p className="text-slate-600">${item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

     {/* ticke crate  */}
       <div> 
         
       </div>


        {/* Cart Summary */}
        <div className="p-6 border-t space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-slate-900">Total</span>
              <span className="text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Process Payment
          </Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex-col bg-blue-600 hover:bg-blue-700" onClick={completePayment}>
                <CreditCard className="w-6 h-6 mb-2" />
                Card
              </Button>
              <Button className="h-20 flex-col bg-green-600 hover:bg-green-700" onClick={completePayment}>
                <DollarSign className="w-6 h-6 mb-2" />
                Cash
              </Button>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
