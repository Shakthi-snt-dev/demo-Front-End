// Shopify API Integration Service
import type { ShopifyConfig, ShopifyProduct, ShopifyOrder, SyncResult } from '../types/integrations';

export class ShopifyService {
  private config: ShopifyConfig['settings'];

  constructor(config: ShopifyConfig['settings']) {
    this.config = config;
  }

  /**
   * Get OAuth authorization URL
   */
  static getAuthorizationUrl(shopDomain: string, clientId: string, redirectUri: string, scopes: string[] = ['read_products', 'write_products', 'read_orders', 'write_orders', 'read_customers', 'read_inventory']): string {
    const scope = scopes.join(',');
    const params = new URLSearchParams({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    });
    return `https://${shopDomain}/admin/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    scope: string;
  }> {
    if (!this.config.shopDomain || !this.config.apiKey || !this.config.apiSecret) {
      throw new Error('Shopify credentials are required');
    }

    const response = await fetch(`https://${this.config.shopDomain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.apiKey,
        client_secret: this.config.apiSecret,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    return await response.json();
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config.shopDomain || !this.config.accessToken) {
      throw new Error('Shopify is not connected. Please connect your store first.');
    }

    const url = `https://${this.config.shopDomain}/admin/api/2024-01${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.config.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Shopify API error: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get products from Shopify
   */
  async getProducts(limit: number = 250): Promise<ShopifyProduct[]> {
    const products: ShopifyProduct[] = [];
    let pageInfo: string | null = null;
    let hasNextPage = true;
    let page = 1;
    const maxPages = 10; // Safety limit

    while (hasNextPage && page <= maxPages) {
      let url = `/products.json?limit=${limit}&page=${page}`;
      if (pageInfo) {
        url = `/products.json?limit=${limit}&page_info=${pageInfo}`;
      }

      const response = await this.makeRequest(url);
      const pageProducts = response.products || [];
      products.push(...pageProducts);

      // Check for pagination
      if (pageProducts.length < limit) {
        hasNextPage = false;
      } else {
        page++;
        // In production, parse Link header for page_info
        hasNextPage = pageProducts.length === limit;
      }
    }

    return products;
  }

  /**
   * Create or update product in Shopify
   */
  async syncProduct(product: Partial<ShopifyProduct>): Promise<ShopifyProduct> {
    if (product.id) {
      // Update existing product
      const response = await this.makeRequest(`/products/${product.id}.json`, {
        method: 'PUT',
        body: JSON.stringify({ product }),
      });
      return response.product;
    } else {
      // Create new product
      const response = await this.makeRequest('/products.json', {
        method: 'POST',
        body: JSON.stringify({ product }),
      });
      return response.product;
    }
  }

  /**
   * Get orders from Shopify
   */
  async getOrders(limit: number = 250, status: string = 'any'): Promise<ShopifyOrder[]> {
    const orders: ShopifyOrder[] = [];
    let pageInfo: string | null = null;
    let hasNextPage = true;
    let page = 1;
    const maxPages = 10; // Safety limit

    while (hasNextPage && page <= maxPages) {
      let url = `/orders.json?limit=${limit}&status=${status}&page=${page}`;
      if (pageInfo) {
        url = `/orders.json?limit=${limit}&status=${status}&page_info=${pageInfo}`;
      }

      const response = await this.makeRequest(url);
      const pageOrders = response.orders || [];
      orders.push(...pageOrders);

      // Check for pagination
      if (pageOrders.length < limit) {
        hasNextPage = false;
      } else {
        page++;
        hasNextPage = pageOrders.length === limit;
      }
    }

    return orders;
  }

  /**
   * Create order in Shopify
   */
  async createOrder(order: Partial<ShopifyOrder>): Promise<ShopifyOrder> {
    const response = await this.makeRequest('/orders.json', {
      method: 'POST',
      body: JSON.stringify({ order }),
    });
    return response.order;
  }

  /**
   * Get customers from Shopify
   */
  async getCustomers(limit: number = 250): Promise<any[]> {
    const customers: any[] = [];
    let pageInfo: string | null = null;
    let hasNextPage = true;
    let page = 1;
    const maxPages = 10; // Safety limit

    while (hasNextPage && page <= maxPages) {
      let url = `/customers.json?limit=${limit}&page=${page}`;
      if (pageInfo) {
        url = `/customers.json?limit=${limit}&page_info=${pageInfo}`;
      }

      const response = await this.makeRequest(url);
      const pageCustomers = response.customers || [];
      customers.push(...pageCustomers);

      // Check for pagination
      if (pageCustomers.length < limit) {
        hasNextPage = false;
      } else {
        page++;
        hasNextPage = pageCustomers.length === limit;
      }
    }

    return customers;
  }

  /**
   * Get inventory levels
   */
  async getInventoryLevels(locationId?: string): Promise<any[]> {
    let url = '/inventory_levels.json';
    if (locationId) {
      url += `?location_ids=${locationId}`;
    }

    const response = await this.makeRequest(url);
    return response.inventory_levels || [];
  }

  /**
   * Update inventory level
   */
  async updateInventoryLevel(inventoryItemId: string, locationId: string, quantity: number): Promise<any> {
    const response = await this.makeRequest('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });
    return response.inventory_level;
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

      if (this.config.syncOrders) {
        try {
          const orders = await this.getOrders();
          syncedItems += orders.length;
        } catch (error: any) {
          errors.push(`Orders sync failed: ${error.message}`);
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

      if (this.config.syncInventory) {
        try {
          const inventory = await this.getInventoryLevels();
          syncedItems += inventory.length;
        } catch (error: any) {
          errors.push(`Inventory sync failed: ${error.message}`);
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
      await this.makeRequest('/shop.json');
      return true;
    } catch {
      return false;
    }
  }
}

