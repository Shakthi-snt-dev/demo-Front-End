// Integration types for QuickBooks and Shopify

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'quickbooks' | 'shopify';
  enabled: boolean;
  connected: boolean;
  connectedAt?: string;
  lastSync?: string;
  settings: Record<string, any>;
}

export interface QuickBooksConfig extends IntegrationConfig {
  type: 'quickbooks';
  settings: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    realmId?: string;
    environment?: 'sandbox' | 'production';
    syncProducts?: boolean;
    syncCustomers?: boolean;
    syncInvoices?: boolean;
    syncPayments?: boolean;
    autoSync?: boolean;
    syncInterval?: number; // minutes
  };
}

export interface ShopifyConfig extends IntegrationConfig {
  type: 'shopify';
  settings: {
    shopDomain?: string;
    accessToken?: string;
    apiKey?: string;
    apiSecret?: string;
    syncProducts?: boolean;
    syncOrders?: boolean;
    syncCustomers?: boolean;
    syncInventory?: boolean;
    autoSync?: boolean;
    syncInterval?: number; // minutes
    webhookSecret?: string;
  };
}

export interface SyncResult {
  success: boolean;
  syncedItems: number;
  errors: string[];
  timestamp: string;
}

export interface QuickBooksProduct {
  Id: string;
  Name: string;
  QtyOnHand?: number;
  UnitPrice?: number;
  IncomeAccountRef?: {
    value: string;
    name: string;
  };
  Type?: string;
  Sku?: string;
}

export interface QuickBooksCustomer {
  Id: string;
  DisplayName: string;
  PrimaryEmailAddr?: {
    Address: string;
  };
  PrimaryPhone?: {
    FreeFormNumber: string;
  };
  Balance?: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  variants: Array<{
    id: string;
    price: string;
    inventory_quantity: number;
    sku: string;
  }>;
  vendor?: string;
  product_type?: string;
}

export interface ShopifyOrder {
  id: string;
  order_number: number;
  total_price: string;
  customer?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: string;
  }>;
  created_at: string;
  financial_status: string;
}

