// QuickBooks API Integration Service
import type { QuickBooksConfig, QuickBooksProduct, QuickBooksCustomer, SyncResult } from '../types/integrations';

const QB_API_BASE_SANDBOX = 'https://sandbox-quickbooks.api.intuit.com';
const QB_API_BASE_PRODUCTION = 'https://quickbooks.api.intuit.com';
const QB_AUTH_BASE = 'https://appcenter.intuit.com/connect/oauth2';

export class QuickBooksService {
  private config: QuickBooksConfig['settings'];
  private baseUrl: string;

  constructor(config: QuickBooksConfig['settings']) {
    this.config = config;
    this.baseUrl = config.environment === 'production' ? QB_API_BASE_PRODUCTION : QB_API_BASE_SANDBOX;
  }

  /**
   * Get OAuth authorization URL
   */
  static getAuthorizationUrl(clientId: string, redirectUri: string, scopes: string[] = ['com.intuit.quickbooks.accounting']): string {
    const scope = scopes.join(' ');
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope,
      redirect_uri: redirectUri,
      access_type: 'offline',
    });
    return `${QB_AUTH_BASE}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    realmId: string;
  }> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('QuickBooks client ID and secret are required');
    }

    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    return await response.json();
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    if (!this.config.clientId || !this.config.clientSecret || !this.config.refreshToken) {
      throw new Error('QuickBooks credentials are required');
    }

    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.config.refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh token: ${error}`);
    }

    return await response.json();
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config.accessToken || !this.config.realmId) {
      throw new Error('QuickBooks is not connected. Please connect your account first.');
    }

    const url = `${this.baseUrl}/v3/company/${this.config.realmId}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshToken();
      this.config.accessToken = refreshed.access_token;
      this.config.refreshToken = refreshed.refresh_token;
      
      // Retry request
      return this.makeRequest(endpoint, options);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`QuickBooks API error: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get products/items from QuickBooks
   */
  async getProducts(): Promise<QuickBooksProduct[]> {
    const response = await this.makeRequest('/query?query=SELECT * FROM Item MAXRESULTS 1000');
    return response.QueryResponse?.Item || [];
  }

  /**
   * Create or update product in QuickBooks
   */
  async syncProduct(product: Partial<QuickBooksProduct>): Promise<QuickBooksProduct> {
    const response = await this.makeRequest('/item', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response.Item;
  }

  /**
   * Get customers from QuickBooks
   */
  async getCustomers(): Promise<QuickBooksCustomer[]> {
    const response = await this.makeRequest('/query?query=SELECT * FROM Customer MAXRESULTS 1000');
    return response.QueryResponse?.Customer || [];
  }

  /**
   * Create or update customer in QuickBooks
   */
  async syncCustomer(customer: Partial<QuickBooksCustomer>): Promise<QuickBooksCustomer> {
    const response = await this.makeRequest('/customer', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
    return response.Customer;
  }

  /**
   * Create invoice in QuickBooks
   */
  async createInvoice(invoice: any): Promise<any> {
    const response = await this.makeRequest('/invoice', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
    return response.Invoice;
  }

  /**
   * Sync data based on configuration
   */
  async syncData(): Promise<SyncResult> {
    const errors: string[] = [];
    let syncedItems = 0;

    try {
      if (this.config.syncProducts) {
        try {
          const products = await this.getProducts();
          syncedItems += products.length;
        } catch (error: any) {
          errors.push(`Products sync failed: ${error.message}`);
        }
      }

      if (this.config.syncCustomers) {
        try {
          const customers = await this.getCustomers();
          syncedItems += customers.length;
        } catch (error: any) {
          errors.push(`Customers sync failed: ${error.message}`);
        }
      }
    } catch (error: any) {
      errors.push(`Sync failed: ${error.message}`);
    }

    return {
      success: errors.length === 0,
      syncedItems,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/companyinfo/' + this.config.realmId);
      return true;
    } catch {
      return false;
    }
  }
}

