// Integrations component for QuickBooks and Shopify - Redesigned with better UX
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useIntegrations } from '../hooks/useIntegrations';
import { QuickBooksService } from '../lib/quickbooks';
import { ShopifyService } from '../lib/shopify';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Settings as SettingsIcon,
  Loader2,
  AlertCircle,
  Clock,
  Zap,
  Package,
  Users,
  ShoppingBag,
  Database,
  Info,
  ChevronRight,
  Link2,
  Shield,
  Check,
} from 'lucide-react';
import type { QuickBooksConfig, ShopifyConfig } from '../types/integrations';

export function Integrations() {
  const {
    integrations,
    loading,
    syncing,
    connectQuickBooks,
    connectShopify,
    disconnectIntegration,
    syncIntegration,
    toggleIntegration,
    updateIntegration,
  } = useIntegrations();

  const [qbDialogOpen, setQbDialogOpen] = useState(false);
  const [shopifyDialogOpen, setShopifyDialogOpen] = useState(false);
  const [qbFormData, setQbFormData] = useState({
    clientId: '',
    clientSecret: '',
    environment: 'sandbox' as 'sandbox' | 'production',
  });
  const [shopifyFormData, setShopifyFormData] = useState({
    shopDomain: '',
    apiKey: '',
    apiSecret: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'credentials' | 'oauth' | 'complete'>('credentials');

  const qbIntegration = integrations.find((i) => i.id === 'quickbooks') as QuickBooksConfig | undefined;
  const shopifyIntegration = integrations.find((i) => i.id === 'shopify') as ShopifyConfig | undefined;

  const handleQuickBooksConnect = async () => {
    setError(null);
    setSuccess(null);
    try {
      const redirectUri = `${window.location.origin}/oauth/quickbooks/callback`;
      const authUrl = QuickBooksService.getAuthorizationUrl(
        qbFormData.clientId,
        redirectUri
      );

      const authWindow = window.open(
        authUrl,
        'QuickBooks OAuth',
        'width=600,height=700'
      );

      window.addEventListener('message', async (event) => {
        if (event.data.type === 'quickbooks_oauth_callback') {
          authWindow?.close();
          try {
            await connectQuickBooks({
              ...qbFormData,
              accessToken: event.data.access_token,
              refreshToken: event.data.refresh_token,
              realmId: event.data.realmId,
            });
            setSuccess('QuickBooks connected successfully!');
            setQbDialogOpen(false);
            setActiveStep('credentials');
          } catch (err: any) {
            setError(err.message);
          }
        }
      });

      setActiveStep('oauth');
      setSuccess('Please complete OAuth flow in the popup window');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleShopifyConnect = async () => {
    setError(null);
    setSuccess(null);
    try {
      const redirectUri = `${window.location.origin}/oauth/shopify/callback`;
      const authUrl = ShopifyService.getAuthorizationUrl(
        shopifyFormData.shopDomain,
        shopifyFormData.apiKey,
        redirectUri
      );

      window.open(authUrl, 'Shopify OAuth', 'width=600,height=700');
      setActiveStep('oauth');
      setSuccess('Please complete OAuth flow in the popup window');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSync = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      const result = await syncIntegration(id);
      if (result.success) {
        setSuccess(`Successfully synced ${result.syncedItems} items!`);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(`Sync completed with errors: ${result.errors.join(', ')}`);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const IntegrationCard = ({ 
    id, 
    name, 
    description, 
    icon: Icon, 
    color, 
    gradient, 
    features,
    integration,
    onConnect,
    onDisconnect,
    onSync,
    isConnected,
    isEnabled,
    onToggle,
  }: any) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isConnected ? 'ring-2 ring-green-200' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl">{name}</CardTitle>
                  {isConnected && (
                    <Badge className="bg-green-600 text-white px-2 py-1">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  {!isConnected && (
                    <Badge variant="outline" className="border-slate-300">
                      <XCircle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">{description}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Switch
                checked={isEnabled}
                onCheckedChange={onToggle}
                disabled={!isConnected}
                className="data-[state=checked]:bg-green-600"
              />
              {isConnected && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <SettingsIcon className="w-4 h-4 mr-1" />
                  Settings
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Features List */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                <div className={`w-5 h-5 rounded-full ${isConnected ? 'bg-green-100' : 'bg-slate-100'} flex items-center justify-center`}>
                  {isConnected ? (
                    <Check className={`w-3 h-3 ${color}`} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Connection Status Info */}
          {isConnected && integration && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Connected
                </span>
                <span className="text-slate-900 font-medium">
                  {integration.connectedAt
                    ? new Date(integration.connectedAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              {integration.lastSync && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Last Sync
                  </span>
                  <span className="text-slate-900 font-medium">
                    {new Date(integration.lastSync).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Settings Panel */}
          {isConnected && showSettings && integration && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-900">Sync Options</Label>
                <div className="space-y-3">
                  {Object.entries(integration.settings).map(([key, value]) => {
                    if (key.includes('sync') && typeof value === 'boolean') {
                      const label = key.replace('sync', '').replace(/([A-Z])/g, ' $1').trim() || 'Auto';
                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {key.includes('Products') && <Package className="w-4 h-4 text-slate-500" />}
                            {key.includes('Customers') && <Users className="w-4 h-4 text-slate-500" />}
                            {key.includes('Orders') && <ShoppingBag className="w-4 h-4 text-slate-500" />}
                            {key.includes('Inventory') && <Database className="w-4 h-4 text-slate-500" />}
                            {key.includes('auto') && <Zap className="w-4 h-4 text-slate-500" />}
                            <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                              {label.charAt(0).toUpperCase() + label.slice(1)}
                            </Label>
                          </div>
                          <Switch
                            id={key}
                            checked={value as boolean}
                            onCheckedChange={(checked) => {
                              updateIntegration(id, {
                                settings: { ...integration.settings, [key]: checked },
                              });
                            }}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {!isConnected ? (
              <Button
                onClick={onConnect}
                className={`flex-1 ${gradient} text-white hover:opacity-90 shadow-md`}
                size="lg"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Connect {name}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onSync(id)}
                  disabled={syncing === id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {syncing === id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={onDisconnect}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  size="lg"
                >
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
          <p className="text-slate-600 text-lg">Connect your favorite tools and sync data seamlessly</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg">
          <Info className="w-4 h-4 text-blue-600" />
          <span>All data is encrypted and secure</span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-700 font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QuickBooks Integration */}
        <IntegrationCard
          id="quickbooks"
          name="QuickBooks"
          description="Sync products, customers, invoices, and payments with QuickBooks accounting software"
          icon={Package}
          color="text-green-600"
          gradient="bg-gradient-to-br from-green-100 to-emerald-100"
          features={['Products Sync', 'Customers Sync', 'Invoices', 'Payments']}
          integration={qbIntegration}
          isConnected={qbIntegration?.connected || false}
          isEnabled={qbIntegration?.enabled || false}
          onToggle={(checked: boolean) => toggleIntegration('quickbooks', checked)}
          onConnect={() => setQbDialogOpen(true)}
          onDisconnect={() => disconnectIntegration('quickbooks')}
          onSync={handleSync}
        />

        {/* Shopify Integration */}
        <IntegrationCard
          id="shopify"
          name="Shopify"
          description="Connect your Shopify store to sync products, orders, customers, and inventory levels"
          icon={ShoppingBag}
          color="text-blue-600"
          gradient="bg-gradient-to-br from-blue-100 to-cyan-100"
          features={['Products Sync', 'Orders Sync', 'Customers', 'Inventory']}
          integration={shopifyIntegration}
          isConnected={shopifyIntegration?.connected || false}
          isEnabled={shopifyIntegration?.enabled || false}
          onToggle={(checked: boolean) => toggleIntegration('shopify', checked)}
          onConnect={() => setShopifyDialogOpen(true)}
          onDisconnect={() => disconnectIntegration('shopify')}
          onSync={handleSync}
        />
      </div>

      {/* QuickBooks Connection Dialog */}
      <Dialog open={qbDialogOpen} onOpenChange={setQbDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Connect QuickBooks</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Enter your QuickBooks API credentials to get started
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className={`flex items-center gap-2 ${activeStep === 'credentials' ? 'text-blue-600 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeStep === 'credentials' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  {activeStep !== 'credentials' ? <Check className="w-3 h-3" /> : '1'}
                </div>
                <span>Enter Credentials</span>
              </div>
              <ChevronRight className="w-4 h-4" />
              <div className={`flex items-center gap-2 ${activeStep === 'oauth' ? 'text-blue-600 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeStep === 'oauth' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  {activeStep === 'complete' ? <Check className="w-3 h-3" /> : '2'}
                </div>
                <span>Authorize</span>
              </div>
              <ChevronRight className="w-4 h-4" />
              <div className={`flex items-center gap-2 ${activeStep === 'complete' ? 'text-blue-600 font-medium' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeStep === 'complete' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  {activeStep === 'complete' ? <Check className="w-3 h-3" /> : '3'}
                </div>
                <span>Complete</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qb-client-id" className="text-sm font-semibold">
                  Client ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="qb-client-id"
                  value={qbFormData.clientId}
                  onChange={(e) => setQbFormData({ ...qbFormData, clientId: e.target.value })}
                  placeholder="Enter your QuickBooks Client ID"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qb-client-secret" className="text-sm font-semibold">
                  Client Secret <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="qb-client-secret"
                  type="password"
                  value={qbFormData.clientSecret}
                  onChange={(e) => setQbFormData({ ...qbFormData, clientSecret: e.target.value })}
                  placeholder="Enter your QuickBooks Client Secret"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qb-environment" className="text-sm font-semibold">
                  Environment
                </Label>
                <Select
                  value={qbFormData.environment}
                  onValueChange={(value: 'sandbox' | 'production') =>
                    setQbFormData({ ...qbFormData, environment: value })
                  }
                >
                  <SelectTrigger id="qb-environment" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                    <SelectItem value="production">Production (Live)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Need help getting your credentials?</p>
                  <p className="mb-2">Create a QuickBooks app at{' '}
                    <a
                      href="https://developer.intuit.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      developer.intuit.com
                    </a>
                  </p>
                  <p className="text-blue-700">Your credentials are encrypted and stored securely.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleQuickBooksConnect}
                disabled={loading || !qbFormData.clientId || !qbFormData.clientSecret}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Continue to Authorization
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setQbDialogOpen(false);
                  setActiveStep('credentials');
                  setError(null);
                  setSuccess(null);
                }}
                className="h-11"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopify Connection Dialog */}
      <Dialog open={shopifyDialogOpen} onOpenChange={setShopifyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Connect Shopify</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Enter your Shopify store credentials to connect
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopify-domain" className="text-sm font-semibold">
                  Shop Domain <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shopify-domain"
                  value={shopifyFormData.shopDomain}
                  onChange={(e) => setShopifyFormData({ ...shopifyFormData, shopDomain: e.target.value })}
                  placeholder="your-shop.myshopify.com"
                  className="h-11"
                />
                <p className="text-xs text-slate-500">Enter your Shopify store domain (e.g., mystore.myshopify.com)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopify-api-key" className="text-sm font-semibold">
                  API Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shopify-api-key"
                  value={shopifyFormData.apiKey}
                  onChange={(e) => setShopifyFormData({ ...shopifyFormData, apiKey: e.target.value })}
                  placeholder="Enter your Shopify API Key"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopify-api-secret" className="text-sm font-semibold">
                  API Secret <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shopify-api-secret"
                  type="password"
                  value={shopifyFormData.apiSecret}
                  onChange={(e) => setShopifyFormData({ ...shopifyFormData, apiSecret: e.target.value })}
                  placeholder="Enter your Shopify API Secret"
                  className="h-11"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">How to get your API credentials:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Go to your Shopify Admin</li>
                    <li>Navigate to Apps → Manage private apps</li>
                    <li>Create a new private app with read/write permissions</li>
                    <li>Copy the API key and secret</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleShopifyConnect}
                disabled={loading || !shopifyFormData.shopDomain || !shopifyFormData.apiKey || !shopifyFormData.apiSecret}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Store
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShopifyDialogOpen(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="h-11"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
