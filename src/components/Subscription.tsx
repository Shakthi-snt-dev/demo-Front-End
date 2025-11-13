import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Check,
  Crown,
  Zap,
  TrendingUp,
  Calendar,
  CreditCard,
  AlertCircle,
  Gift,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: 49,
    period: 'month',
    description: 'Perfect for small repair shops',
    features: [
      '1 Store Location',
      'Up to 3 Employees',
      '500 Tickets/month',
      'Basic Inventory Management',
      'Email Support',
      'Standard Reports',
    ],
    color: 'blue',
    icon: Zap,
  },
  {
    name: 'Professional',
    price: 99,
    period: 'month',
    description: 'For growing businesses',
    features: [
      '3 Store Locations',
      'Up to 10 Employees',
      '2,000 Tickets/month',
      'Advanced Inventory Management',
      'Priority Email Support',
      'Advanced Reports & Analytics',
      'Customer Portal',
      'SMS Notifications',
    ],
    popular: true,
    color: 'purple',
    icon: TrendingUp,
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large operations',
    features: [
      'Unlimited Store Locations',
      'Unlimited Employees',
      'Unlimited Tickets',
      'Full Inventory Suite',
      '24/7 Priority Support',
      'Custom Reports',
      'API Access',
      'White Label Options',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
    color: 'orange',
    icon: Crown,
  },
];

export function Subscription() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // Current subscription details (demo)
  const currentPlan = {
    name: 'Professional',
    status: 'trial',
    trialEndsIn: 12,
    totalTrialDays: 14,
    nextBillingDate: '2025-11-22',
    amount: 99,
  };

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    setIsPaymentDialogOpen(true);
  };

  const trialProgress = ((currentPlan.totalTrialDays - currentPlan.trialEndsIn) / currentPlan.totalTrialDays) * 100;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-900 mb-2">Subscription & Billing</h1>
        <p className="text-slate-600">Manage your subscription plan and billing information</p>
      </div>

      {/* Trial Status Banner */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-blue-900 mb-1">Free Trial Active</h3>
                <p className="text-blue-700">
                  You have {currentPlan.trialEndsIn} days left in your {currentPlan.name} plan trial
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-blue-700">
                  <span>Trial Progress</span>
                  <span>
                    {currentPlan.totalTrialDays - currentPlan.trialEndsIn} of {currentPlan.totalTrialDays} days used
                  </span>
                </div>
                <Progress value={trialProgress} className="h-2" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Upgrade Now & Save 20%
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subscription */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-slate-900">{currentPlan.name} Plan</h3>
                <Badge className="bg-yellow-500 text-white">Trial</Badge>
              </div>
              <p className="text-slate-600">Trial ends on November 22, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-slate-900">${currentPlan.amount}/month</p>
              <p className="text-slate-600">after trial</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-slate-900 mb-2">Choose Your Plan</h2>
          <p className="text-slate-600">Select the perfect plan for your business needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`border-0 shadow-lg relative ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-900">${plan.price}</span>
                      <span className="text-slate-600">/{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-slate-600 hover:bg-slate-700'
                    }`}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {currentPlan.name === plan.name ? 'Current Plan' : 'Upgrade to ' + plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center">
                    <span className="text-white">VISA</span>
                  </div>
                  <div>
                    <p className="text-slate-900">•••• •••• •••• 4242</p>
                    <p className="text-slate-600">Expires 12/2026</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-slate-900">Trial Started</p>
                <p className="text-slate-600">November 8, 2025</p>
              </div>
              <Badge className="bg-green-600 text-white">Free</Badge>
            </div>
            <p className="text-center text-slate-500 py-4">
              No billing history yet. Your first payment will be on {currentPlan.nextBillingDate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-slate-600 mb-2">Your trial will be converted to a paid subscription</p>
              <div className="flex justify-between items-center">
                <span className="text-slate-900">Amount Due Today:</span>
                <span className="text-blue-600">$0.00</span>
              </div>
              <p className="text-slate-500 mt-2">
                First billing date: {currentPlan.nextBillingDate}
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-date">Expiry Date</Label>
                  <Input id="exp-date" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-zip">Billing ZIP</Label>
                <Input id="billing-zip" placeholder="10001" />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <p className="text-slate-600">
                By confirming, you authorize RepairPOS to charge your payment method for this and future payments.
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Confirm Upgrade
              </Button>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
